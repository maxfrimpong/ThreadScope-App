import React, { useState } from 'react';
import { ScanInput } from '../components/ScanInput';
import { ResultCard } from '../components/ResultCard';
import { ScanType, ScanResult, User } from '../types';
import { scanUrlWithGemini, scanCodeOrText, scanImage, generateRemediation } from '../services/gemini';
import { mockDb } from '../services/mockDb';

interface ScannerProps {
  user: User;
}

export const Scanner: React.FC<ScannerProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemediating, setIsRemediating] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (type: ScanType, data: string | File) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      let scanResult: ScanResult;

      if (type === ScanType.URL && typeof data === 'string') {
        scanResult = await scanUrlWithGemini(data);
      } else if (type === ScanType.CODE && typeof data === 'string') {
        scanResult = await scanCodeOrText(data);
      } else if (type === ScanType.FILE && data instanceof File) {
        // Handle file reading
        const reader = new FileReader();
        scanResult = await new Promise<ScanResult>((resolve, reject) => {
          reader.onload = async () => {
             try {
                const base64String = (reader.result as string).split(',')[1];
                // Pass filename and mimetype
                const res = await scanImage(base64String, data.type, data.name);
                resolve(res);
             } catch (e) {
                reject(e);
             }
          };
          reader.onerror = reject;
          reader.readAsDataURL(data);
        });
      } else {
        throw new Error("Invalid input type");
      }

      setResult(scanResult);
      mockDb.addScan(scanResult); // Save to mock DB

    } catch (err: any) {
      setError(err.message || "An error occurred during scanning.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemediate = async (scanResult: ScanResult) => {
     if (!scanResult) return;
     setIsRemediating(true);
     try {
       const remediationPlan = await generateRemediation(scanResult);
       
       const updatedResult: ScanResult = {
         ...scanResult,
         remediationStatus: 'COMPLETED',
         remediationDetails: remediationPlan
       };
       
       setResult(updatedResult);
       mockDb.updateScan(scanResult.id, { 
         remediationStatus: 'COMPLETED', 
         remediationDetails: remediationPlan 
       });

     } catch (err) {
       console.error(err);
       setError("Failed to generate remediation plan.");
     } finally {
       setIsRemediating(false);
     }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Intelligent Threat Detection
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Analyze URLs, files, and code snippets using advanced AI models and real-time grounding to detect malware, phishing, and zero-day threats.
        </p>
      </div>

      <ScanInput onScan={handleScan} isLoading={isLoading} />

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-xl text-center">
          <p className="font-bold">Scan Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-12">
          <ResultCard 
            result={result} 
            user={user} 
            onRemediate={handleRemediate}
            isRemediating={isRemediating}
          />
        </div>
      )}
    </div>
  );
};