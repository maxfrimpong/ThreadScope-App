import { GoogleGenAI } from "@google/genai";
import { ScanResult, ThreatLevel, ScanType } from "../types";

// Helper to sanitize and validate API key usage
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to parse the raw text response into a structured format
const parseAnalysisResponse = (text: string, originalTarget: string, type: ScanType): Omit<ScanResult, 'id' | 'timestamp'> => {
  let threatLevel = ThreatLevel.UNKNOWN;
  let score = 50;
  let summary = "Analysis completed.";
  let details = text;

  const verdictMatch = text.match(/VERDICT:\s*(SAFE|SUSPICIOUS|MALICIOUS|CLEAN)/i);
  if (verdictMatch) {
    const v = verdictMatch[1].toUpperCase();
    if (v === 'SAFE' || v === 'CLEAN') threatLevel = ThreatLevel.SAFE;
    else if (v === 'SUSPICIOUS') threatLevel = ThreatLevel.SUSPICIOUS;
    else if (v === 'MALICIOUS') threatLevel = ThreatLevel.MALICIOUS;
  }

  const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
  if (scoreMatch) {
    score = parseInt(scoreMatch[1], 10);
  }

  const summaryMatch = text.match(/SUMMARY:\s*(.+)/i);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }
  
  if (threatLevel === ThreatLevel.UNKNOWN) {
    if (text.toLowerCase().includes('malicious') || text.toLowerCase().includes('malware')) threatLevel = ThreatLevel.MALICIOUS;
    else if (text.toLowerCase().includes('suspicious') || text.toLowerCase().includes('risk')) threatLevel = ThreatLevel.SUSPICIOUS;
    else threatLevel = ThreatLevel.SAFE;
  }

  return {
    type,
    target: originalTarget,
    threatLevel,
    score,
    summary,
    details,
    remediationStatus: 'NONE'
  };
};

export const scanUrlWithGemini = async (url: string): Promise<ScanResult> => {
  const ai = getAiClient();
  
  const prompt = `
  You are a cybersecurity threat intelligence engine. Analyze the following URL for potential security threats.
  Target URL: ${url}
  
  Use Google Search to find reputation reports, whois data, or malware reports related to this domain.
  
  Format your response EXACTLY as follows:
  VERDICT: [SAFE, SUSPICIOUS, or MALICIOUS]
  SCORE: [0-100, where 100 is perfectly safe, 0 is definitely malware]
  SUMMARY: [A concise one-sentence summary of the finding]
  DETAILS:
  [Provide a detailed markdown report. Include headers for Reputation, Domain Age (if found), Content Analysis, and Recommendations.]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No response generated.";
    const parsed = parseAnalysisResponse(text, url, ScanType.URL);
    
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => c.web?.uri)
      .filter((u: string) => !!u) as string[] || [];

    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...parsed,
      groundingUrls
    };

  } catch (error) {
    console.error("URL Scan Error", error);
    throw error;
  }
};

export const scanCodeOrText = async (content: string, filename: string = "Snippet"): Promise<ScanResult> => {
  const ai = getAiClient();
  
  const prompt = `
  You are a static code analysis and malware detection engine. Analyze the following code snippet or text file content.
  Look for: Obfuscation, shell injection, hardcoded credentials, malicious external calls, or known malware signatures.
  
  File Name/Context: ${filename}
  Content:
  \`\`\`
  ${content.substring(0, 30000)} 
  \`\`\`
  (Content truncated to 30k chars if longer)

  Format your response EXACTLY as follows:
  VERDICT: [SAFE, SUSPICIOUS, or MALICIOUS]
  SCORE: [0-100, where 100 is perfectly safe]
  SUMMARY: [A concise one-sentence summary]
  DETAILS:
  [Markdown report explaining the findings. Highlight specific dangerous lines if any.]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });

    const text = response.text || "No response generated.";
    const parsed = parseAnalysisResponse(text, filename, ScanType.CODE);

    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...parsed,
    };
  } catch (error) {
    console.error("Code Scan Error", error);
    throw error;
  }
};

export const scanImage = async (base64Data: string, mimeType: string, filename: string): Promise<ScanResult> => {
  const ai = getAiClient();
  
  const prompt = `
  Analyze this image from a security perspective.
  1. Does it look like a phishing attempt (e.g. a fake Microsoft/Google login screen)?
  2. Does it contain suspicious text or QR codes that might lead to malware?
  3. If it is a screenshot of a software installer, does it look legitimate?

  Format your response EXACTLY as follows:
  VERDICT: [SAFE, SUSPICIOUS, or MALICIOUS]
  SCORE: [0-100, where 100 is safe]
  SUMMARY: [A concise summary]
  DETAILS:
  [Markdown analysis of the visual elements.]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      }
    });

    const text = response.text || "No response generated.";
    const parsed = parseAnalysisResponse(text, filename, ScanType.FILE);

    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...parsed,
    };
  } catch (error) {
     console.error("Image Scan Error", error);
     throw error;
  }
};

export const generateRemediation = async (result: ScanResult): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
  You are a senior security engineer. A user has detected a potential threat using ThreatScope AI.
  
  Threat Info:
  Type: ${result.type}
  Target: ${result.target}
  Summary: ${result.summary}
  Details: ${result.details}

  TASK:
  Generate a detailed remediation playbook to neutralize this threat.
  - If it's a malicious URL/Domain: Provide steps to block it in hosts file, firewall, or browser.
  - If it's a File/Code: Provide a CLI script (Bash or PowerShell) to isolate, remove, or sanitize the artifact.
  - Include specific "Copy-Paste" commands.
  
  Tone: Professional, urgent, and precise.
  `;

  try {
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt
     });
     return response.text || "Unable to generate remediation steps.";
  } catch (error) {
    console.error("Remediation Gen Error", error);
    throw new Error("Failed to generate remediation plan.");
  }
};

// --- New: Traffic Profile Analysis ---

export interface TrafficProfile {
  techStack: string;
  normalPaths: string[];
  adminPaths: string[];
  vulnerablePaths: string[];
}

export const analyzeSiteTrafficProfile = async (url: string): Promise<TrafficProfile> => {
  const ai = getAiClient();
  
  // This prompt asks Gemini to fingerprint the site and predict its likely structure
  // This allows the "Mock" traffic to look incredibly real for the specific site
  const prompt = `
  Analyze the URL structure and likely technology stack for: ${url}
  
  1. Identify the probable Tech Stack (e.g. WordPress, Shopify, React, PHP/Laravel, Static HTML).
  2. List 5 likely "Normal User" paths (e.g. /product/123, /blog, /about).
  3. List 3 likely "Admin/Hidden" paths (e.g. /wp-admin, /admin, /dashboard).
  4. List 3 likely "Vulnerable/Targeted" paths bots would check (e.g. /wp-login.php, /.env, /cart).
  
  Respond in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return {
      techStack: data.techStack || "Unknown Web Server",
      normalPaths: data.normalPaths || ['/', '/about', '/contact'],
      adminPaths: data.adminPaths || ['/admin', '/login'],
      vulnerablePaths: data.vulnerablePaths || ['/.env', '/config', '/backup.zip']
    };
  } catch (error) {
    console.error("Traffic Profile Error", error);
    // Fallback profile
    return {
      techStack: "Generic Web Server",
      normalPaths: ['/', '/index.html', '/about'],
      adminPaths: ['/admin', '/cms'],
      vulnerablePaths: ['/login', '/.git/HEAD']
    };
  }
};