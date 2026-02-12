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
}

export interface AlertItem {
  id: string;
  threshold: number;
  velocity: number;
  status: 'normal' | 'warning' | 'danger';
  triggeredAt: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  createdAt: string;
}

export interface ModelFile {
  id: string;
  name: string;
  version: string;
  status: 'not-integrated' | 'active';
  uploadedAt: string;
}

export interface InferenceResult {
  velocity: number;
  source: string;
  label: 'normal' | 'warning' | 'danger';
  score: number;
  thresholds: { warn: number; danger: number };
  explanation: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
