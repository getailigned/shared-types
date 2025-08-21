// Predefined persona templates with smart defaults

import { PredefinedPersona } from './personas'

export const PREDEFINED_PERSONAS: PredefinedPersona[] = [
  // ===== EXECUTIVE PERSONAS =====
  {
    id: 'executive-strategic-visionary',
    name: 'Strategic Visionary',
    description: 'Focus on long-term objectives, strategic initiatives, and organizational alignment',
    icon: '🎯',
    color: '#8B5CF6',
    category: 'Executive',
    targetRoles: ['CEO', 'President', 'VP', 'C-Suite'],
    filters: {
      workItemTypes: ['objective', 'strategy'],
      timeframe: 'this_quarter',
      assignmentScope: 'organization',
      showCompleted: false,
      maxDepth: 2,
      progressThresholds: {
        onTrack: true,
        behindSchedule: true
      }
    },
    layout: {
      defaultView: 'executive',
      components: {
        portfolioMap: true,
        metricsOverview: true,
        aiAssistant: true,
        dependencyGraph: true,
        riskAlerts: true,
        performanceCharts: true,
        recentActivity: false,
        teamStatus: false
      },
      layoutDensity: 'comfortable',
      defaultSort: { field: 'priority', direction: 'desc' },
      groupBy: 'type',
      emphasisStyle: 'bold'
    },
    insights: {
      primaryMetrics: ['progress', 'risk', 'timeline'],
      alertTypes: ['high_risk', 'decision_needed', 'blockers'],
      aiPersonality: 'strategic',
      briefingStyle: 'strategic',
      notificationFrequency: 'daily',
      escalationThresholds: { risk: 0.7, overdue: 7, blocked: 1 }
    }
  },

  {
    id: 'executive-crisis-manager',
    name: 'Crisis Manager',
    description: 'Immediate focus on blocked items, urgent decisions, and critical risks',
    icon: '🚨',
    color: '#EF4444',
    category: 'Executive',
    targetRoles: ['CEO', 'President', 'VP', 'Director'],
    filters: {
      statuses: ['blocked', 'on_hold'],
      priorities: ['critical', 'high'],
      timeframe: 'all',
      assignmentScope: 'organization',
      dueDateRange: { overdue: true, upcoming: 7 },
      riskLevels: ['critical', 'high'],
      showCompleted: false,
      showCancelled: false
    },
    layout: {
      defaultView: 'portfolio',
      components: {
        portfolioMap: true,
        metricsOverview: true,
        aiAssistant: true,
        riskAlerts: true,
        recentActivity: true,
        dependencyGraph: false,
        performanceCharts: false,
        teamStatus: true
      },
      layoutDensity: 'compact',
      defaultSort: { field: 'risk_score', direction: 'desc' },
      groupBy: 'priority',
      emphasisStyle: 'bold',
      accentColor: '#EF4444'
    },
    insights: {
      primaryMetrics: ['risk', 'timeline'],
      alertTypes: ['blockers', 'overdue', 'high_risk', 'decision_needed', 'resource_conflicts'],
      aiPersonality: 'directive',
      briefingStyle: 'action_oriented',
      notificationFrequency: 'real_time',
      escalationThresholds: { risk: 0.5, overdue: 1, blocked: 0 }
    }
  },

  // ===== OPERATIONAL PERSONAS =====
  {
    id: 'team-leader',
    name: 'Team Leader',
    description: 'Focus on team performance, resource allocation, and member development',
    icon: '👥',
    color: '#10B981',
    category: 'Management',
    targetRoles: ['Manager', 'Team Lead', 'Director'],
    filters: {
      assignmentScope: 'my_team',
      timeframe: 'this_month',
      includeWatching: true,
      includeCreated: true,
      showCompleted: true,
      progressThresholds: {
        behindSchedule: true,
        onTrack: true
      }
    },
    layout: {
      defaultView: 'portfolio',
      components: {
        portfolioMap: true,
        metricsOverview: true,
        teamStatus: true,
        recentActivity: true,
        aiAssistant: true,
        performanceCharts: true,
        riskAlerts: true,
        dependencyGraph: false
      },
      layoutDensity: 'comfortable',
      defaultSort: { field: 'due_date', direction: 'asc' },
      groupBy: 'assignee',
      emphasisStyle: 'moderate'
    },
    insights: {
      primaryMetrics: ['progress', 'resource_utilization', 'timeline'],
      alertTypes: ['overdue', 'resource_conflicts', 'blockers'],
      aiPersonality: 'supportive',
      briefingStyle: 'detailed',
      notificationFrequency: 'daily',
      escalationThresholds: { risk: 0.6, overdue: 3, blocked: 1 }
    }
  },

  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Emphasize timelines, dependencies, deliverables, and project health',
    icon: '📊',
    color: '#3B82F6',
    category: 'Management',
    targetRoles: ['Project Manager', 'Program Manager', 'Delivery Manager'],
    filters: {
      workItemTypes: ['initiative', 'task', 'subtask'],
      assignmentScope: 'my_department',
      timeframe: 'this_quarter',
      showCompleted: true,
      dueDateRange: { upcoming: 14, overdue: true }
    },
    layout: {
      defaultView: 'timeline',
      components: {
        portfolioMap: true,
        dependencyGraph: true,
        metricsOverview: true,
        performanceCharts: true,
        aiAssistant: true,
        riskAlerts: true,
        recentActivity: true,
        teamStatus: true
      },
      layoutDensity: 'comfortable',
      defaultSort: { field: 'due_date', direction: 'asc' },
      groupBy: 'status',
      emphasisStyle: 'moderate'
    },
    insights: {
      primaryMetrics: ['timeline', 'progress', 'quality'],
      alertTypes: ['overdue', 'blockers', 'resource_conflicts'],
      aiPersonality: 'analytical',
      briefingStyle: 'detailed',
      notificationFrequency: 'daily',
      escalationThresholds: { risk: 0.7, overdue: 2, blocked: 1 }
    }
  },

  {
    id: 'individual-contributor',
    name: 'Individual Contributor',
    description: 'Personal tasks, immediate context, and individual productivity focus',
    icon: '🎯',
    color: '#8B5CF6',
    category: 'Individual',
    targetRoles: ['Developer', 'Designer', 'Analyst', 'Specialist'],
    filters: {
      assignmentScope: 'my_items',
      workItemTypes: ['task', 'subtask'],
      timeframe: 'this_week',
      includeWatching: true,
      dueDateRange: { upcoming: 7, overdue: true },
      showCompleted: true,
      maxDepth: 3
    },
    layout: {
      defaultView: 'kanban',
      components: {
        portfolioMap: true,
        metricsOverview: false,
        recentActivity: true,
        aiAssistant: true,
        teamStatus: false,
        dependencyGraph: false,
        riskAlerts: true,
        performanceCharts: false
      },
      layoutDensity: 'compact',
      defaultSort: { field: 'priority', direction: 'desc' },
      groupBy: 'status',
      emphasisStyle: 'subtle',
      sidebarCollapsed: true
    },
    insights: {
      primaryMetrics: ['progress', 'timeline'],
      alertTypes: ['overdue', 'blockers'],
      aiPersonality: 'supportive',
      briefingStyle: 'action_oriented',
      notificationFrequency: 'hourly',
      escalationThresholds: { risk: 0.8, overdue: 1, blocked: 0 }
    }
  },

  // ===== ANALYTICAL PERSONAS =====
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Metrics, trends, performance data, and analytical insights',
    icon: '📈',
    color: '#F59E0B',
    category: 'Analytics',
    targetRoles: ['Data Analyst', 'Business Analyst', 'Performance Manager'],
    filters: {
      assignmentScope: 'organization',
      timeframe: 'this_quarter',
      showCompleted: true,
      showCancelled: true,
      progressThresholds: {
        min: 0,
        max: 100,
        onTrack: true,
        behindSchedule: true
      }
    },
    layout: {
      defaultView: 'portfolio',
      components: {
        metricsOverview: true,
        performanceCharts: true,
        portfolioMap: true,
        dependencyGraph: true,
        aiAssistant: true,
        riskAlerts: false,
        recentActivity: false,
        teamStatus: false
      },
      layoutDensity: 'spacious',
      defaultSort: { field: 'progress', direction: 'asc' },
      groupBy: 'type',
      emphasisStyle: 'moderate'
    },
    insights: {
      primaryMetrics: ['progress', 'quality', 'resource_utilization', 'timeline'],
      alertTypes: ['high_risk'],
      aiPersonality: 'analytical',
      briefingStyle: 'detailed',
      notificationFrequency: 'weekly',
      escalationThresholds: { risk: 0.8, overdue: 14, blocked: 3 }
    }
  },

  {
    id: 'risk-assessor',
    name: 'Risk Assessor',
    description: 'Risk indicators, mitigation needs, and compliance monitoring',
    icon: '⚠️',
    color: '#F97316',
    category: 'Analytics',
    targetRoles: ['Risk Manager', 'Compliance Officer', 'Quality Assurance'],
    filters: {
      assignmentScope: 'organization',
      riskLevels: ['medium', 'high', 'critical'],
      statuses: ['blocked', 'on_hold', 'in_progress'],
      timeframe: 'all',
      showCompleted: false,
      progressThresholds: {
        behindSchedule: true
      }
    },
    layout: {
      defaultView: 'portfolio',
      components: {
        riskAlerts: true,
        portfolioMap: true,
        metricsOverview: true,
        dependencyGraph: true,
        performanceCharts: true,
        aiAssistant: true,
        recentActivity: false,
        teamStatus: false
      },
      layoutDensity: 'comfortable',
      defaultSort: { field: 'risk_score', direction: 'desc' },
      groupBy: 'priority',
      emphasisStyle: 'bold',
      accentColor: '#F97316'
    },
    insights: {
      primaryMetrics: ['risk', 'quality', 'timeline'],
      alertTypes: ['high_risk', 'blockers', 'resource_conflicts'],
      aiPersonality: 'analytical',
      briefingStyle: 'detailed',
      notificationFrequency: 'daily',
      escalationThresholds: { risk: 0.6, overdue: 5, blocked: 1 }
    }
  },

  // ===== CONTEXTUAL PERSONAS =====
  {
    id: 'daily-standup',
    name: 'Daily Standup',
    description: 'Today\'s priorities, blockers, and immediate actions',
    icon: '☀️',
    color: '#06B6D4',
    category: 'Contextual',
    targetRoles: ['Developer', 'Designer', 'Manager', 'Team Lead'],
    filters: {
      assignmentScope: 'my_team',
      timeframe: 'today',
      statuses: ['in_progress', 'blocked'],
      dueDateRange: { upcoming: 1, overdue: true },
      includeWatching: true,
      showCompleted: false
    },
    layout: {
      defaultView: 'kanban',
      components: {
        portfolioMap: true,
        teamStatus: true,
        riskAlerts: true,
        recentActivity: true,
        aiAssistant: true,
        metricsOverview: false,
        dependencyGraph: false,
        performanceCharts: false
      },
      layoutDensity: 'compact',
      defaultSort: { field: 'priority', direction: 'desc' },
      groupBy: 'assignee',
      emphasisStyle: 'moderate'
    },
    insights: {
      primaryMetrics: ['progress'],
      alertTypes: ['blockers', 'overdue'],
      aiPersonality: 'collaborative',
      briefingStyle: 'summary',
      notificationFrequency: 'real_time',
      escalationThresholds: { risk: 0.7, overdue: 0, blocked: 0 }
    }
  },

  {
    id: 'weekly-review',
    name: 'Weekly Review',
    description: 'Weekly progress, upcoming milestones, and retrospective insights',
    icon: '📅',
    color: '#8B5CF6',
    category: 'Contextual',
    targetRoles: ['Manager', 'Team Lead', 'Project Manager'],
    filters: {
      assignmentScope: 'my_team',
      timeframe: 'this_week',
      showCompleted: true,
      dueDateRange: { upcoming: 7 },
      includeWatching: true,
      includeCreated: true
    },
    layout: {
      defaultView: 'portfolio',
      components: {
        portfolioMap: true,
        metricsOverview: true,
        performanceCharts: true,
        teamStatus: true,
        recentActivity: true,
        aiAssistant: true,
        riskAlerts: true,
        dependencyGraph: false
      },
      layoutDensity: 'comfortable',
      defaultSort: { field: 'due_date', direction: 'asc' },
      groupBy: 'status',
      emphasisStyle: 'moderate'
    },
    insights: {
      primaryMetrics: ['progress', 'timeline', 'resource_utilization'],
      alertTypes: ['overdue', 'high_risk', 'resource_conflicts'],
      aiPersonality: 'analytical',
      briefingStyle: 'detailed',
      notificationFrequency: 'weekly',
      escalationThresholds: { risk: 0.6, overdue: 3, blocked: 1 }
    }
  },

  {
    id: 'quarterly-business-review',
    name: 'Quarterly Business Review',
    description: 'High-level objectives, strategic outcomes, and business impact',
    icon: '📋',
    color: '#6366F1',
    category: 'Contextual',
    targetRoles: ['CEO', 'President', 'VP', 'Director'],
    filters: {
      workItemTypes: ['objective', 'strategy', 'initiative'],
      assignmentScope: 'organization',
      timeframe: 'this_quarter',
      showCompleted: true,
      maxDepth: 2,
      progressThresholds: {
        onTrack: true,
        behindSchedule: true
      }
    },
    layout: {
      defaultView: 'executive',
      components: {
        portfolioMap: true,
        metricsOverview: true,
        performanceCharts: true,
        dependencyGraph: true,
        aiAssistant: true,
        riskAlerts: true,
        recentActivity: false,
        teamStatus: false
      },
      layoutDensity: 'spacious',
      defaultSort: { field: 'priority', direction: 'desc' },
      groupBy: 'type',
      emphasisStyle: 'bold'
    },
    insights: {
      primaryMetrics: ['progress', 'risk', 'timeline', 'quality'],
      alertTypes: ['high_risk', 'decision_needed'],
      aiPersonality: 'strategic',
      briefingStyle: 'strategic',
      notificationFrequency: 'weekly',
      escalationThresholds: { risk: 0.7, overdue: 14, blocked: 2 }
    }
  }
]

// Helper function to get personas by category
export const getPersonasByCategory = (category: string): PredefinedPersona[] => {
  return PREDEFINED_PERSONAS.filter(persona => persona.category === category)
}

// Helper function to get personas by target role
export const getPersonasByRole = (role: string): PredefinedPersona[] => {
  return PREDEFINED_PERSONAS.filter(persona => 
    persona.targetRoles.some(targetRole => 
      targetRole.toLowerCase().includes(role.toLowerCase()) ||
      role.toLowerCase().includes(targetRole.toLowerCase())
    )
  )
}

// Get all categories
export const getPersonaCategories = (): string[] => {
  return [...new Set(PREDEFINED_PERSONAS.map(persona => persona.category))]
}
