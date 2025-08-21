// Validation utilities using Zod for the HTMA platform

import { z } from 'zod';

// Common validation schemas
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');
export const dateSchema = z.string().datetime().or(z.date());

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).optional(),
});

// Work item validation schemas
export const workItemTypeSchema = z.enum(['objective', 'strategy', 'initiative', 'task', 'subtask']);
export const workItemStatusSchema = z.enum(['draft', 'active', 'in_progress', 'completed', 'cancelled', 'on_hold']);
export const workItemPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const workItemCreateSchema = z.object({
  type: workItemTypeSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  priority: workItemPrioritySchema.default('medium'),
  owner_id: uuidSchema.optional(),
  due_at: dateSchema.optional(),
  estimated_hours: z.number().positive().max(10000).optional(),
  parent_id: uuidSchema.optional(),
});

export const workItemUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional(),
  status: workItemStatusSchema.optional(),
  priority: workItemPrioritySchema.optional(),
  owner_id: uuidSchema.optional(),
  due_at: dateSchema.optional(),
  estimated_hours: z.number().positive().max(10000).optional(),
  actual_hours: z.number().positive().max(10000).optional(),
});

// User validation schemas
export const userCreateSchema = z.object({
  email: emailSchema,
  name: z.string().min(1).max(255),
  password: passwordSchema,
  roles: z.array(z.string()).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: emailSchema.optional(),
  is_active: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

// Cedar policy validation schemas
export const cedarPolicyCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
  priority: z.number().int().min(0).max(100).default(50),
});

export const cedarPolicyUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  is_active: z.boolean().optional(),
});

// Lineage validation schemas
export const lineageEdgeCreateSchema = z.object({
  parent_id: uuidSchema,
  child_id: uuidSchema,
  relation_type: z.string().default('contains'),
});

export const dependencyEdgeCreateSchema = z.object({
  from_id: uuidSchema,
  to_id: uuidSchema,
  dep_type: z.enum(['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish']).default('finish_to_start'),
  lag_hours: z.number().min(0).max(10000).default(0),
});

// Validation helper functions
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

export function validatePartialSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: Partial<T> } | { success: false; errors: string[] } {
  try {
    const result = (schema as any).partial().parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Type guards
export function isValidUUID(value: string): boolean {
  return uuidSchema.safeParse(value).success;
}

export function isValidEmail(value: string): boolean {
  return emailSchema.safeParse(value).success;
}

export function isValidWorkItemType(value: string): boolean {
  return workItemTypeSchema.safeParse(value).success;
}

export function isValidWorkItemStatus(value: string): boolean {
  return workItemStatusSchema.safeParse(value).success;
}

export function isValidWorkItemPriority(value: string): boolean {
  return workItemPrioritySchema.safeParse(value).success;
}
