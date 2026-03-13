export type ClientModule = {
  id: string;
  clientId: string;
  moduleKey: 'temperature' | 'actuation';
  name: string;
  description: string;
  enabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};
