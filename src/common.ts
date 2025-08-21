// Common types used across the HTMA platform

export interface BaseEntity {
  id: string;
  tenant_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  checks: Record<string, HealthCheckResult>;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  message?: string;
  details?: any;
  timestamp: Date;
}

export interface ServiceInfo {
  name: string;
  version: string;
  environment: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  cpu: {
    usage: number;
    load: number[];
  };
}

export type WorkItemType = 'objective' | 'strategy' | 'initiative' | 'task' | 'subtask';
export type WorkItemStatus = 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
export type WorkItemPriority = 'low' | 'medium' | 'high' | 'critical';
export type DependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
export type UserRole = 'CEO' | 'President' | 'VP' | 'Director' | 'Manager' | 'Contributor' | 'Auditor';

export interface Tenant {
  id: string;
  name: string;
  plan: 'standard' | 'professional' | 'enterprise';
  region: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}
