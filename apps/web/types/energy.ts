export type EnergySensorType = 'corrente' | 'tensao' | 'consumo';

export type EnergyReading = {
  deviceId: string;
  sensorType: string;
  value: number;
  unit: string | null;
  createdAt: string;
  count?: number;
  minValue?: number;
  maxValue?: number;
};

export type EnergyLatestBySensor = {
  sensorType: string;
  value: number | null;
  unit: string | null;
  deviceId: string | null;
  createdAt: string | null;
};

export type EnergySummary = {
  clientId: string;
  sensors: string[];
  deviceCount: number;
  devicesWithRecentReadings: number;
  recentWindowHours: number;
  latestBySensor: EnergyLatestBySensor[];
};
