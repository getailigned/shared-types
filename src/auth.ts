// Authentication and authorization types for the HTMA platform

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  tenant_id: string;
  roles: string[];
  iat: number; // Issued at
  exp: number; // Expiration
  type: 'access' | 'refresh';
}

export interface AuthContext {
  user_id: string;
  email: string;
  tenant_id: string;
  roles: string[];
  permissions: string[];
  is_authenticated: boolean;
}

export interface CedarPolicyRequest {
  principal: {
    id: string;
    type: string;
    roles: string[];
    attributes: Record<string, any>;
  };
  action: {
    id: string;
    type: string;
  };
  resource: {
    id: string;
    type: string;
    attributes: Record<string, any>;
  };
  context?: Record<string, any>;
}

export interface CedarPolicyResponse {
  decision: 'allow' | 'deny';
  reason?: string;
  errors?: string[];
  diagnostics?: any;
}

export interface PolicyEvaluationResult {
  allowed: boolean;
  policy_id: string;
  reason: string;
  context: Record<string, any>;
  timestamp: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource_type: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  role_id: string;
  role_name: string;
  permissions: Permission[];
}

export interface Session {
  id: string;
  user_id: string;
  tenant_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
  last_used: Date;
  ip_address?: string;
  user_agent?: string;
}

export interface SessionCreateRequest {
  user_id: string;
  tenant_id: string;
  ip_address?: string;
  user_agent?: string;
}

export interface SessionValidationRequest {
  access_token: string;
  required_permissions?: string[];
}

export interface SessionValidationResponse {
  valid: boolean;
  session?: Session;
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
  permissions: string[];
  expires_in: number;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LogoutRequest {
  session_id: string;
  reason?: string;
}

export interface AuthMetrics {
  total_logins: number;
  failed_logins: number;
  active_sessions: number;
  token_refreshes: number;
  policy_evaluations: number;
  average_response_time: number;
}
