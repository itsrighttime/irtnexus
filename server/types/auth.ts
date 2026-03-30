// Define the shape of the user object in session
export interface SessionUser {
  id: string;
  username: string;
  isActive: boolean;
  role?: string;
  [key: string]: any;
}

// Define the shape of the session stored in Redis
export interface SessionData {
  user: SessionUser;
  [key: string]: any;
}

// Type for actor / request context
export interface ActorContext {
  anonymous: boolean;
  accountId: string | null;
  username: string | null;
  role: string | null;
  tenantId: string | null;
  tenantIdentifier: string | null;
  [key: string]: any;
}

export interface RequestContext {
  requestId: string;
  traceId: string | null;
  auditId: string | null;
  actor: ActorContext;
  startTime: number;
  [key: string]: any;
}
