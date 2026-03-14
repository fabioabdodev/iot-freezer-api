export type ActuatorSummary = {
  id: string;
  clientId: string;
  deviceId: string | null;
  name: string;
  location: string | null;
  currentState: 'on' | 'off';
  lastCommandAt: string | null;
  lastCommandBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActuatorInput = {
  id: string;
  clientId: string;
  deviceId?: string;
  name: string;
  location?: string;
};

export type ActuationCommandInput = {
  desiredState: 'on' | 'off';
  source?: string;
  note?: string;
};

export type ActuationCommand = {
  id: string;
  actuatorId: string;
  clientId: string;
  desiredState: 'on' | 'off';
  source: string | null;
  note: string | null;
  executedAt: string;
  actuator?: ActuatorSummary;
};

export type ActuationSchedule = {
  id: string;
  clientId: string;
  actuatorId: string;
  name: string;
  weekdays: Array<'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'>;
  startMinutes: number;
  endMinutes: number;
  timezone: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ActuationScheduleInput = {
  clientId: string;
  actuatorId: string;
  name: string;
  weekdays: Array<'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'>;
  startMinutes: number;
  endMinutes: number;
  timezone?: string;
  enabled?: boolean;
};
