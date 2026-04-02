export type AuthUser = {
  id: string;
  clientId: string | null;
  name: string;
  email: string;
  role: 'operator' | 'admin';
  phone?: string | null;
  preferredLayout?: 'inherit' | 'technical' | 'client';
  effectiveLayout?: 'technical' | 'client';
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
  turnstileToken?: string;
};

export type RequestPasswordResetInput = {
  email: string;
  turnstileToken?: string;
};

export type ConfirmPasswordResetInput = {
  token: string;
  password: string;
};

export type PasswordResetValidation = {
  valid: boolean;
  emailHint: string;
  expiresAt: string;
};

export type PasswordResetRequestResult = {
  message: string;
  resetUrl?: string;
  expiresAt?: string;
};
