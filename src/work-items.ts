// Work Item types for the HTMA platform

import { BaseEntity, WorkItemType, WorkItemStatus, WorkItemPriority } from './common';

export interface WorkItem extends BaseEntity {
  type: WorkItemType;
  title: string;
  description?: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  created_by: string;
  owner_id?: string;
  due_at?: Date;
  estimated_hours?: number;
  actual_hours?: number;
}

export interface LineageEdge extends BaseEntity {
  parent_id: string;
  child_id: string;
  relation_type: string;
  created_by: string;
}

export interface DependencyEdge extends BaseEntity {
  from_id: string;
  to_id: string;
  dep_type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lag_hours: number;
  created_by: string;
}

export interface WorkItemCreateRequest {
  type: WorkItemType;
  title: string;
  description?: string;
  priority?: WorkItemPriority;
  owner_id?: string;
  due_at?: Date;
  estimated_hours?: number;
  parent_id?: string; // For lineage enforcement
}

export interface WorkItemUpdateRequest {
  title?: string;
  description?: string;
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  owner_id?: string;
  due_at?: Date;
  estimated_hours?: number;
  actual_hours?: number;
}

export interface WorkItemResponse extends WorkItem {
  parent?: WorkItemSummary;
  children: WorkItemSummary[];
  dependencies: DependencySummary[];
  dependents: DependencySummary[];
  lineage_path: string[];
  depth: number;
  branch_factor: number;
}

export interface WorkItemSummary {
  id: string;
  type: WorkItemType;
  title: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
}

export interface DependencySummary {
  id: string;
  from_id: string;
  to_id: string;
  dep_type: string;
  lag_hours: number;
}

export interface LineageValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggested_parents?: WorkItemSummary[];
}

export interface WorkItemAnalytics {
  total_count: number;
  by_status: Record<WorkItemStatus, number>;
  by_type: Record<WorkItemType, number>;
  by_priority: Record<WorkItemPriority, number>;
  lineage_coverage: number;
  orphaned_count: number;
  critical_path_length: number;
  average_cycle_time: number;
}
