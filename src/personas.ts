// Persona system types for dynamic user experience customization

export interface PersonaFilter {
  // Work item filtering
  workItemTypes?: ('objective' | 'strategy' | 'initiative' | 'task' | 'subtask')[]
  statuses?: ('not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled' | 'blocked')[]
  priorities?: ('low' | 'medium' | 'high' | 'critical')[]
  
  // Time-based filtering
  timeframe?: 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'all'
  dueDateRange?: {
    overdue?: boolean
    upcoming?: number // days
    completed?: boolean
  }
  
  // Assignment filtering
  assignmentScope?: 'my_items' | 'my_team' | 'my_department' | 'organization' | 'all_visible'
  includeWatching?: boolean
  includeCreated?: boolean
  
  // Risk and performance filtering
  riskLevels?: ('low' | 'medium' | 'high' | 'critical')[]
  progressThresholds?: {
    min?: number
    max?: number
    onTrack?: boolean
    behindSchedule?: boolean
  }
  
  // Hierarchy filtering
  maxDepth?: number
  rootLevelOnly?: boolean
  showCompleted?: boolean
  showCancelled?: boolean
}

export interface PersonaLayout {
  // View configuration
  defaultView?: 'portfolio' | 'executive' | 'kanban' | 'timeline' | 'calendar'
  
  // Component visibility
  components?: {
    portfolioMap?: boolean
    metricsOverview?: boolean
    recentActivity?: boolean
    aiAssistant?: boolean
    dependencyGraph?: boolean
    riskAlerts?: boolean
    performanceCharts?: boolean
    teamStatus?: boolean
  }
  
  // Layout preferences
  layoutDensity?: 'compact' | 'comfortable' | 'spacious'
  sidebarCollapsed?: boolean
  showMinimap?: boolean
  
  // Sorting and grouping
  defaultSort?: {
    field: 'priority' | 'due_date' | 'status' | 'progress' | 'risk_score' | 'title'
    direction: 'asc' | 'desc'
  }
  groupBy?: 'none' | 'status' | 'priority' | 'assignee' | 'type' | 'department'
  
  // Colors and themes
  accentColor?: string
  emphasisStyle?: 'subtle' | 'moderate' | 'bold'
}

export interface PersonaInsights {
  // Metrics emphasis
  primaryMetrics?: ('progress' | 'risk' | 'timeline' | 'quality' | 'resource_utilization')[]
  alertTypes?: ('blockers' | 'overdue' | 'high_risk' | 'decision_needed' | 'resource_conflicts')[]
  
  // AI assistant configuration
  aiPersonality?: 'analytical' | 'supportive' | 'directive' | 'collaborative' | 'strategic'
  briefingStyle?: 'summary' | 'detailed' | 'action_oriented' | 'strategic'
  
  // Notification preferences
  notificationFrequency?: 'real_time' | 'hourly' | 'daily' | 'weekly'
  escalationThresholds?: {
    risk?: number
    overdue?: number
    blocked?: number
  }
}

export interface PersonaProfile {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  
  // Ownership and sharing
  createdBy: string
  organizationId: string
  isPublic: boolean // Can be used by others in organization
  isDefault?: boolean // Default for new users in organization
  
  // Configuration
  filters: PersonaFilter
  layout: PersonaLayout
  insights: PersonaInsights
  
  // Metadata
  category: 'predefined' | 'organizational' | 'personal'
  tags?: string[]
  usage_count?: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
}

export interface UserPersonaPreference {
  userId: string
  currentPersonaId: string
  recentPersonas: string[] // Recently used persona IDs
  customPersonas: string[] // User's custom persona IDs
  favoritePersonas: string[] // Bookmarked personas
  
  // Session preferences
  sessionPersonaHistory: {
    personaId: string
    usedAt: string
    duration?: number // minutes
  }[]
  
  updatedAt: string
}

// Predefined persona templates
export interface PredefinedPersona {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  targetRoles: string[]
  filters: PersonaFilter
  layout: PersonaLayout
  insights: PersonaInsights
}

// Persona usage analytics
export interface PersonaAnalytics {
  personaId: string
  organizationId: string
  
  // Usage metrics
  totalUsers: number
  activeUsers: number // last 30 days
  averageSessionDuration: number
  
  // Performance metrics
  taskCompletionRate: number
  decisionSpeed: number // average time to action
  userSatisfactionScore?: number
  
  // Usage patterns
  peakUsageHours: number[]
  commonWorkflows: string[]
  frequentFilters: string[]
  
  updatedAt: string
}

// API types
export interface CreatePersonaRequest {
  name: string
  description: string
  icon?: string
  color?: string
  isPublic: boolean
  filters: PersonaFilter
  layout: PersonaLayout
  insights: PersonaInsights
  tags?: string[]
}

export interface UpdatePersonaRequest extends Partial<CreatePersonaRequest> {
  id: string
}

export interface PersonaSearchRequest {
  query?: string
  category?: PersonaProfile['category']
  tags?: string[]
  createdBy?: string
  isPublic?: boolean
  limit?: number
  offset?: number
}

export interface PersonaSearchResponse {
  personas: PersonaProfile[]
  total: number
  hasMore: boolean
}

// Persona application context
export interface PersonaContext {
  currentPersona: PersonaProfile
  availablePersonas: PersonaProfile[]
  userPreferences: UserPersonaPreference
  
  // Actions
  switchPersona: (personaId: string) => Promise<void>
  savePersona: (persona: CreatePersonaRequest) => Promise<PersonaProfile>
  updatePersona: (update: UpdatePersonaRequest) => Promise<PersonaProfile>
  deletePersona: (personaId: string) => Promise<void>
  sharePersona: (personaId: string, userIds: string[]) => Promise<void>
  duplicatePersona: (personaId: string, newName: string) => Promise<PersonaProfile>
}

// Helper types for UI components
export interface PersonaOption {
  value: string
  label: string
  description?: string
  icon?: string
  color?: string
  category?: string
  isRecent?: boolean
  isFavorite?: boolean
}

export interface PersonaFilterApplied {
  workItems: any[]
  metrics: any
  insights: any[]
  totalFiltered: number
  totalAvailable: number
  appliedFilters: string[]
}
