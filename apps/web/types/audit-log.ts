export interface AuditLogEntry {
  id: string;
  clientId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  fieldName: string | null;
  previousValue: unknown;
  nextValue: unknown;
  actorUserId: string | null;
  actorEmail: string | null;
  actorRole: string | null;
  actorClientId: string | null;
  createdAt: string;
}
