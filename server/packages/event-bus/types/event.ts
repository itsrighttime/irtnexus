export interface BaseEvent {
  eventId: string; // UUID
  eventType: string; // e.g., EmployeeHired
  tenantId: string; // Tenant isolation
  sourceModule?: string; // hr, projects, partner, etc.
  timestamp?: string; // ISO string
  version?: string; // Schema version, e.g., "1.0"
  payload: Record<string, any>; // Event-specific data
}

export function validateEvent(event: Partial<BaseEvent>): event is BaseEvent {
  return (
    typeof event.eventId === "string" &&
    typeof event.eventType === "string" &&
    typeof event.tenantId === "string" &&
    typeof event.sourceModule === "string" &&
    typeof event.timestamp === "string" &&
    typeof event.version === "string" &&
    typeof event.payload === "object" &&
    event.payload !== null
  );
}
