// User and authentication types for the HTMA platform

import { BaseEntity, UserRole } from './common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  password_hash?: string;
  is_active: boolean;
}

export interface Role extends BaseEntity {
  name: UserRole;
  description?: string;
}

export interface UserRoleAssignment extends BaseEntity {
  user_id: string;
  role_id: string;
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface UserCreateRequest {
  email: string;
  name: string;
  password: string;
  roles?: UserRoleAssignment[];
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  is_active?: boolean;
  roles?: UserRoleAssignment[];
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: UserWithRoles;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: UserRoleAssignment[];
  tenant_id: string;
  is_active: boolean;
  created_at: Date;
  last_login?: Date;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface UserSearchParams {
  query?: string;
  role?: UserRole;
  is_active?: boolean;
  tenant_id?: string;
  page?: number;
  limit?: number;
}

export interface UserAnalytics {
  total_users: number;
  active_users: number;
  by_role: Record<UserRole, number>;
  new_users_this_month: number;
  last_login_distribution: Record<string, number>;
}
