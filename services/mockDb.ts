
import { ScanResult, ThreatLevel, ScanType, DailyStat, SystemHealth, GeoStat, MockUser, UserRole, SubscriptionTier, ThreatEvent } from '../types';

// Initial mock data
const INITIAL_HISTORY: ScanResult[] = [
  {
    id: 'scan-101',
    type: ScanType.URL,
    target: 'http://suspicious-bank-login.com.xyz',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    threatLevel: ThreatLevel.MALICIOUS,
    score: 15,
    summary: 'Detected phishing patterns and known malicious domain association.',
    details: '### Analysis\nThe domain uses a homograph attack simulating a major bank. \n\n**Findings:**\n- Valid SSL certificate but issued by free provider (Let\'s Encrypt)\n- Domain age: < 24 hours\n- Contains obfuscated JS code in header.',
    groundingUrls: ['https://phishtank.com/1234'],
    remediationStatus: 'NONE'
  },
  {
    id: 'scan-102',
    type: ScanType.FILE,
    target: 'setup_installer_cracked.exe',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    threatLevel: ThreatLevel.SUSPICIOUS,
    score: 45,
    summary: 'Signature verification failed. Heuristic analysis suggests potential trojan.',
    details: '### File Analysis\nFile appears to be a repackaged installer.\n\n- **Entropy:** High (packed)\n- **Signature:** Invalid\n- **Behavior:** Attempts to modify registry keys on startup.',
    remediationStatus: 'NONE'
  },
  {
    id: 'scan-103',
    type: ScanType.CODE,
    target: 'auth_bypass.py',
    timestamp: new Date(Date.now() - 200000).toISOString(),
    threatLevel: ThreatLevel.SAFE,
    score: 95,
    summary: 'Code appears to be a standard educational example of SQL injection vulnerability, not malware itself.',
    details: '### Code Review\nThe provided Python script demonstrates a vulnerability but does not contain active exploit payloads targeting external systems.',
    remediationStatus: 'NONE'
  }
];

// Coordinates for simulation
const LOCATIONS = [
  { country: 'US', lat: 37.0902, lng: -95.7129 },
  { country: 'CN', lat: 35.8617, lng: 104.1954 },
  { country: 'RU', lat: 61.5240, lng: 105.3188 },
  { country: 'BR', lat: -14.2350, lng: -51.9253 },
  { country: 'DE', lat: 51.1657, lng: 10.4515 },
  { country: 'IN', lat: 20.5937, lng: 78.9629 },
  { country: 'AU', lat: -25.2744, lng: 133.7751 },
  { country: 'ZA', lat: -30.5595, lng: 22.9375 },
  { country: 'JP', lat: 36.2048, lng: 138.2529 },
  { country: 'GB', lat: 55.3781, lng: -3.4360 },
];

const THREAT_TYPES = ['DDoS', 'Phishing', 'Malware', 'SQL Injection', 'Brute Force', 'Ransomware'];

class MockDB {
  private history: ScanResult[] = [...INITIAL_HISTORY];

  getHistory(): ScanResult[] {
    return [...this.history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addScan(scan: ScanResult) {
    this.history.unshift(scan);
  }

  updateScan(id: string, updates: Partial<ScanResult>) {
    const index = this.history.findIndex(h => h.id === id);
    if (index !== -1) {
      this.history[index] = { ...this.history[index], ...updates };
    }
  }

  getStats() {
    const total = this.history.length;
    const malicious = this.history.filter(h => h.threatLevel === ThreatLevel.MALICIOUS).length;
    const suspicious = this.history.filter(h => h.threatLevel === ThreatLevel.SUSPICIOUS).length;
    const safe = this.history.filter(h => h.threatLevel === ThreatLevel.SAFE).length;
    
    return {
      total,
      malicious,
      suspicious,
      safe
    };
  }

  getMockAdminStats() {
    return [
      { name: 'Malware', value: 400 },
      { name: 'Phishing', value: 300 },
      { name: 'Ransomware', value: 300 },
      { name: 'Safe', value: 1200 },
    ];
  }

  // --- New Analytics Data Methods ---

  getTrendData(): DailyStat[] {
    const days = 7;
    const data: DailyStat[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        scans: Math.floor(Math.random() * 50) + 10,
        threats: Math.floor(Math.random() * 10)
      });
    }
    return data;
  }

  getSystemHealth(): SystemHealth {
    return {
      cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
      memory: Math.floor(Math.random() * 40) + 30, // 30-70%
      latency: Math.floor(Math.random() * 50) + 10, // 10-60ms
      uptime: '14d 2h 12m'
    };
  }

  getGeoStats(): GeoStat[] {
    return [
      { country: 'United States', code: 'US', count: 432 },
      { country: 'China', code: 'CN', count: 321 },
      { country: 'Russia', code: 'RU', count: 211 },
      { country: 'Brazil', code: 'BR', count: 154 },
      { country: 'Germany', code: 'DE', count: 98 },
    ];
  }

  getAllUsers(): MockUser[] {
    return [
      { id: '1', name: 'Alice Chen', email: 'alice@corp.com', role: UserRole.USER, subscriptionTier: SubscriptionTier.ENTERPRISE, avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=10b981&color=fff', status: 'ACTIVE', lastLogin: '2 mins ago' },
      { id: '2', name: 'Bob Smith', email: 'bob@freemail.com', role: UserRole.USER, subscriptionTier: SubscriptionTier.FREE, avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=64748b&color=fff', status: 'ACTIVE', lastLogin: '1 day ago' },
      { id: '3', name: 'Charlie Root', email: 'root@sys.admin', role: UserRole.ADMIN, subscriptionTier: SubscriptionTier.ENTERPRISE, avatar: 'https://ui-avatars.com/api/?name=Charlie+Root&background=ef4444&color=fff', status: 'ACTIVE', lastLogin: 'Now' },
      { id: '4', name: 'Dave Hunter', email: 'dave@sec.net', role: UserRole.USER, subscriptionTier: SubscriptionTier.PRO, avatar: 'https://ui-avatars.com/api/?name=Dave+Hunter&background=f59e0b&color=fff', status: 'SUSPENDED', lastLogin: '5 days ago' },
      { id: '5', name: 'Eve Mal', email: 'eve@suspicious.net', role: UserRole.USER, subscriptionTier: SubscriptionTier.FREE, avatar: 'https://ui-avatars.com/api/?name=Eve+Mal&background=64748b&color=fff', status: 'PENDING', lastLogin: 'Never' },
    ];
  }

  getRandomThreatEvent(): ThreatEvent {
    const source = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    // Target is usually "User's region" or just random for demo
    const target = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    
    return {
      id: crypto.randomUUID(),
      sourceCountry: source.country,
      sourceLat: source.lat + (Math.random() - 0.5) * 5, // Jitter
      sourceLng: source.lng + (Math.random() - 0.5) * 5,
      targetLat: target.lat,
      targetLng: target.lng,
      type: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
      timestamp: Date.now()
    };
  }
}

export const mockDb = new MockDB();
