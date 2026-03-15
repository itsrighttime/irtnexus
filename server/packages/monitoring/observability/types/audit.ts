export interface AuditResource {
  resourceTable: string
  resourceId: string
  historyId?: string
}

export interface AuditOutcome {
  success: boolean
  message?: string
}

export interface AuditPerformance {
  latencyMs?: number
  dbTimeMs?: number
  externalTimeMs?: number
}

export interface AuditLog {
  id: string

  tenant_id?: string | null
  account_id?: string | null

  user_role?: string | null

  event_type: string
  event_version: number

  request_id?: string | null
  trace_id?: string | null

  http_method?: string | null
  http_path?: string | null

  ip_address?: string | null
  user_agent?: string | null

  resource?: AuditResource[]
  outcome?: AuditOutcome
  metadata?: Record<string, any>
  performance?: AuditPerformance

  audit: boolean

  previous_hash?: string | null
  hash?: string | null

  timestamp: Date
}