// Event types for the event-driven architecture of the HTMA platform

export interface BaseEvent {
  id: string;
  type: string;
  tenant_id: string;
  timestamp: Date;
  version: string;
  source: string;
  correlation_id?: string;
  causation_id?: string;
}

export interface WorkItemEvent extends BaseEvent {
  type: 'work_item.created' | 'work_item.updated' | 'work_item.deleted' | 'work_item.status_changed';
  data: {
    work_item_id: string;
    work_item_type: string;
    changes?: Record<string, any>;
    previous_state?: Record<string, any>;
  };
}

export interface LineageEvent extends BaseEvent {
  type: 'lineage.edge.created' | 'lineage.edge.deleted' | 'lineage.edge.updated';
  data: {
    parent_id: string;
    child_id: string;
    relation_type: string;
    changes?: Record<string, any>;
  };
}

export interface DependencyEvent extends BaseEvent {
  type: 'dependency.created' | 'dependency.deleted' | 'dependency.updated';
  data: {
    from_id: string;
    to_id: string;
    dep_type: string;
    lag_hours: number;
    changes?: Record<string, any>;
  };
}

export interface UserEvent extends BaseEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted' | 'user.login' | 'user.logout';
  data: {
    user_id: string;
    changes?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
  };
}

export interface PolicyEvent extends BaseEvent {
  type: 'policy.created' | 'policy.updated' | 'policy.deleted' | 'policy.evaluated';
  data: {
    policy_id: string;
    policy_type: string;
    evaluation_result?: boolean;
    context?: Record<string, any>;
  };
}

export interface AuditEvent extends BaseEvent {
  type: 'audit.log_created';
  data: {
    action: string;
    resource_type: string;
    resource_id: string;
    user_id: string;
    details: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
  };
}

export interface NotificationEvent extends BaseEvent {
  type: 'notification.sent' | 'notification.delivered' | 'notification.failed';
  data: {
    notification_id: string;
    recipient_id: string;
    channel: string;
    template: string;
    status: string;
    error?: string;
  };
}

export interface AIEvent extends BaseEvent {
  type: 'ai.request' | 'ai.response' | 'ai.error';
  data: {
    request_id: string;
    model: string;
    prompt?: string;
    response?: string;
    tokens_used?: number;
    cost?: number;
    error?: string;
  };
}

export interface SystemEvent extends BaseEvent {
  type: 'system.health_check' | 'system.maintenance' | 'system.error';
  data: {
    component: string;
    status: string;
    message: string;
    details?: Record<string, any>;
  };
}

export type EventType = 
  | WorkItemEvent
  | LineageEvent
  | DependencyEvent
  | UserEvent
  | PolicyEvent
  | AuditEvent
  | NotificationEvent
  | AIEvent
  | SystemEvent;

export interface EventMetadata {
  event_id: string;
  event_type: string;
  tenant_id: string;
  timestamp: Date;
  source_service: string;
  version: string;
  schema_version: string;
}

export interface EventEnvelope<T = any> {
  metadata: EventMetadata;
  data: T;
}

export interface EventSubscription {
  id: string;
  service_name: string;
  event_types: string[];
  queue_name: string;
  active: boolean;
  created_at: Date;
  last_processed: Date;
}

export interface EventProcessingResult {
  success: boolean;
  event_id: string;
  processed_at: Date;
  error?: string;
  retry_count: number;
  next_retry?: Date;
}

export interface EventMetrics {
  total_events: number;
  events_by_type: Record<string, number>;
  events_by_service: Record<string, number>;
  processing_success_rate: number;
  average_processing_time: number;
  failed_events: number;
  retry_events: number;
}
