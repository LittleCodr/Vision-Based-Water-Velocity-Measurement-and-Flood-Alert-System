export type UserRole = 'admin' | 'user';

export interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface VideoItem {
  id: string;
  name: string;
  url: string;
  contentType?: string;
  size?: number;
  createdAt: string;
  userId?: string;
}

export interface VelocityLog {
  id: string;
  velocity: number;
  source: string;
  timestamp: string;
  userId?: string;
}

export interface AlertItem {
  id: string;
  threshold: number;
  velocity: number;
  status: 'normal' | 'warning' | 'danger';
  triggeredAt: string;
  userId?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  createdAt: string;
  contentType?: string;
  userId?: string;
}

export interface ModelFile {
  id: string;
  name: string;
  version: string;
  status: 'not-integrated' | 'staged' | 'active';
  uploadedAt: string;
  sourceUrl?: string;
  mainFilePath?: string;
  files?: { name: string; path: string; size?: number; contentType?: string }[];
  notes?: string;
  userId?: string;
}

export interface InferenceResult {
  velocity: number;
  source: string;
  label: 'normal' | 'warning' | 'danger';
  score: number;
  thresholds: { warn: number; danger: number };
  explanation: string;
}

export interface VideoAnalysisResult {
  flood_probability: number;
  average_velocity: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface EmailDispatch {
  to_email: string;
  message: string;
  velocity?: string;
  threshold?: string;
  status?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  channel: string;
  delivered: boolean;
  createdAt: string;
  userId?: string;
}

export interface SiteItem {
  id: string;
  name: string;
  location: string;
  lat?: number;
  lon?: number;
  status: 'online' | 'offline' | 'degraded';
  alertStatus: 'normal' | 'warning' | 'danger';
  lastVelocity?: number;
  lastHeartbeat?: string;
  lastWaterLevel?: number;
  lastRainRate?: number;
  userId?: string;
}

export interface WaterLevelLog {
  id: string;
  siteId?: string;
  level: number;
  timestamp: string;
  userId?: string;
}

export interface RainLog {
  id: string;
  siteId?: string;
  rate: number;
  timestamp: string;
  userId?: string;
}
