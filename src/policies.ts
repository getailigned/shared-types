// Cedar policy types for the HTMA platform

export interface CedarPolicy {
  id: string;
  name: string;
  description: string;
  version: string;
  tenant_id: string;
  content: string;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  tags: string[];
  priority: number;
}

export interface CedarPolicyCreateRequest {
  name: string;
  description: string;
  content: string;
  tags?: string[];
  priority?: number;
}

export interface CedarPolicyUpdateRequest {
  name?: string;
  description?: string;
  content?: string;
  tags?: string[];
  priority?: number;
  is_active?: boolean;
}

export interface CedarPolicyValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  syntax_errors: CedarSyntaxError[];
  semantic_errors: CedarSemanticError[];
}

export interface CedarSyntaxError {
  line: number;
  column: number;
  message: string;
  code: string;
}

export interface CedarSemanticError {
  type: string;
  message: string;
  context: Record<string, any>;
}

export interface CedarPolicyTest {
  id: string;
  policy_id: string;
  name: string;
  description: string;
  principal: Record<string, any>;
  action: Record<string, any>;
  resource: Record<string, any>;
  context?: Record<string, any>;
  expected_result: 'allow' | 'deny';
  expected_reason?: string;
}

export interface CedarPolicyTestResult {
  test_id: string;
  passed: boolean;
  expected: 'allow' | 'deny';
  actual: 'allow' | 'deny';
  reason?: string;
  execution_time: number;
  errors?: string[];
}

export interface CedarPolicyDeployment {
  id: string;
  policy_id: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'deploying' | 'deployed' | 'failed' | 'rolled_back';
  deployed_by: string;
  deployed_at: Date;
  version: string;
  rollback_version?: string;
  rollback_reason?: string;
  deployment_logs: string[];
}

export interface CedarPolicyEvaluation {
  id: string;
  policy_id: string;
  principal: Record<string, any>;
  action: Record<string, any>;
  resource: Record<string, any>;
  context?: Record<string, any>;
  result: 'allow' | 'deny';
  reason?: string;
  evaluation_time: number;
  timestamp: Date;
  user_id: string;
  tenant_id: string;
}

export interface CedarPolicyMetrics {
  total_policies: number;
  active_policies: number;
  policies_by_tenant: Record<string, number>;
  evaluation_count: number;
  average_evaluation_time: number;
  allow_rate: number;
  deny_rate: number;
  top_policies: Array<{
    policy_id: string;
    name: string;
    evaluation_count: number;
  }>;
}

export interface CedarPolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content_template: string;
  variables: CedarPolicyVariable[];
  examples: CedarPolicyExample[];
  created_by: string;
  created_at: Date;
  usage_count: number;
}

export interface CedarPolicyVariable {
  name: string;
  description: string;
  type: string;
  required: boolean;
  default_value?: any;
  validation_rules?: string[];
}

export interface CedarPolicyExample {
  name: string;
  description: string;
  variables: Record<string, any>;
  expected_result: 'allow' | 'deny';
}

export interface CedarPolicyBundle {
  id: string;
  name: string;
  description: string;
  version: string;
  policies: CedarPolicy[];
  dependencies: string[];
  created_by: string;
  created_at: Date;
  is_active: boolean;
}

export interface CedarPolicyImport {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imported_policies: number;
  failed_policies: number;
  errors: string[];
  imported_by: string;
  imported_at: Date;
  completed_at?: Date;
}

export interface CedarPolicyExport {
  id: string;
  filename: string;
  format: 'json' | 'cedar' | 'bundle';
  policies: string[];
  exported_by: string;
  exported_at: Date;
  download_url?: string;
}
