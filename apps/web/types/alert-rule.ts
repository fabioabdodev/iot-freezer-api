export type AlertRule = {
  id: string;
  clientId: string;
  deviceId?: string | null;
  sensorType: string;
  minValue?: number | null;
  maxValue?: number | null;
  cooldownMinutes: number;
  toleranceMinutes: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AlertRuleInput = {
  clientId: string;
  deviceId?: string;
  sensorType: string;
  minValue?: number;
  maxValue?: number;
  cooldownMinutes?: number;
  toleranceMinutes?: number;
  enabled?: boolean;
};
