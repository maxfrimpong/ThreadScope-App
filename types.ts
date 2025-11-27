
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  subscriptionTier: SubscriptionTier;
}

export enum ScanType {
  URL = 'URL',
  FILE = 'FILE',
  CODE = 'CODE'
}

export enum ThreatLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  MALICIOUS = 'MALICIOUS',
  UNKNOWN = 'UNKNOWN'
}

export interface ScanResult {
  id: string;
  type: ScanType;
  target: string; // The URL or filename
  timestamp: string;
  threatLevel: ThreatLevel;
  score: number; // 0 to 100, where 100 is safest
  summary: string;
  details: string; // Markdown content
  groundingUrls?: string[];
  remediationStatus?: 'NONE' | 'PENDING' | 'COMPLETED';
  remediationDetails?: string;
}

export interface DashboardStats {
  totalScans: number;
  maliciousDetected: number;
  safeDetected: number;
  avgScanTime: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

// New Analytical Types
export interface SystemHealth {
  cpu: number;
  memory: number;
  latency: number;
  uptime: string;
}

export interface GeoStat {
  country: string;
  code: string;
  count: number;
}

export interface DailyStat {
  date: string;
  scans: number;
  threats: number;
}

export interface MockUser extends User {
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  lastLogin: string;
}

export interface ThreatEvent {
  id: string;
  sourceLat: number;
  sourceLng: number;
  sourceCountry: string;
  targetLat: number;
  targetLng: number;
  type: string; // e.g. "DDoS", "SQL Injection", "Malware"
  timestamp: number;
}
