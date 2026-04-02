export type UserSummary = {
  id: string;
  clientId: string | null;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  phone: string | null;
  preferredLayout: 'inherit' | 'technical' | 'client';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserInput = {
  clientId?: string;
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'operator';
  phone?: string;
  preferredLayout?: 'inherit' | 'technical' | 'client';
  isActive?: boolean;
};
