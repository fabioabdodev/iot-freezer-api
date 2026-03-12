import { DeviceInput, DeviceReading, DeviceSummary } from '@/types/device';
import { AlertRule, AlertRuleInput } from '@/types/alert-rule';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

function buildAuthHeaders(authToken?: string) {
  // O token e opcional para permitir uso local e ambientes sem autenticacao no dashboard.
  const headers: HeadersInit = {};
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
}

function normalizeDeviceReadings(rows: unknown): DeviceReading[] {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    if (!row || typeof row !== 'object') return [];

    const record = row as Record<string, unknown>;
    const createdAt = record.createdAt;

    if (typeof createdAt !== 'string') return [];

    if (typeof record.temperature === 'number') {
      return [
        {
          temperature: record.temperature,
          createdAt,
        },
      ];
    }

    if (typeof record.value === 'number') {
      return [
        {
          temperature: record.value,
          createdAt,
        },
      ];
    }

    return [];
  });
}

export async function fetchDevices(
  clientId?: string,
  limit = 50,
  authToken?: string,
): Promise<DeviceSummary[]> {
  // O clientId filtra os dados por tenant sem duplicar endpoints no backend.
  const query = new URLSearchParams();
  query.set('limit', String(limit));
  if (clientId) query.set('clientId', clientId);

  const response = await fetch(`${API_BASE_URL}/devices?${query.toString()}`, {
    cache: 'no-store',
    headers: buildAuthHeaders(authToken),
  });

  if (!response.ok) {
    throw new Error('Falha ao carregar dispositivos');
  }

  return response.json() as Promise<DeviceSummary[]>;
}

export async function fetchDeviceReadings(
  deviceId: string,
  clientId?: string,
  limit = 48,
  authToken?: string,
): Promise<DeviceReading[]> {
  // Reaproveitamos o mesmo padrao de filtros para manter consistencia com a listagem principal.
  const query = new URLSearchParams();
  query.set('limit', String(limit));
  if (clientId) query.set('clientId', clientId);
  const headers = buildAuthHeaders(authToken);
  const primaryUrl = `${API_BASE_URL}/devices/${deviceId}/readings?${query.toString()}`;
  const fallbackUrl = `${API_BASE_URL}/readings/${deviceId}?sensor=temperature&${query.toString()}`;

  try {
    const response = await fetch(primaryUrl, {
      cache: 'no-store',
      headers,
    });

    if (response.ok) {
      return normalizeDeviceReadings(await response.json());
    }
  } catch {
    // Ignoramos a excecao aqui para tentar o endpoint legado/alternativo de leituras.
  }

  try {
    const fallbackResponse = await fetch(fallbackUrl, {
      cache: 'no-store',
      headers,
    });

    if (!fallbackResponse.ok) {
      throw new Error('Falha ao carregar historico do device');
    }

    return normalizeDeviceReadings(await fallbackResponse.json());
  } catch {
    throw new Error('Falha ao carregar historico do device');
  }
}

export async function createDevice(
  input: DeviceInput,
  authToken?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(authToken),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar device');
  }
}

export async function updateDevice(
  id: string,
  input: Omit<DeviceInput, 'id'>,
  clientId?: string,
  authToken?: string,
): Promise<void> {
  const query = new URLSearchParams();
  if (clientId) query.set('clientId', clientId);

  const response = await fetch(
    `${API_BASE_URL}/devices/${id}?${query.toString()}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...buildAuthHeaders(authToken),
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error('Falha ao atualizar device');
  }
}

export async function deleteDevice(
  id: string,
  clientId?: string,
  authToken?: string,
): Promise<void> {
  const query = new URLSearchParams();
  if (clientId) query.set('clientId', clientId);

  const response = await fetch(
    `${API_BASE_URL}/devices/${id}?${query.toString()}`,
    {
      method: 'DELETE',
      headers: buildAuthHeaders(authToken),
    },
  );

  if (!response.ok) {
    throw new Error('Falha ao remover device');
  }
}

export async function fetchAlertRules(
  clientId?: string,
  authToken?: string,
): Promise<AlertRule[]> {
  const query = new URLSearchParams();
  if (clientId) query.set('clientId', clientId);

  const response = await fetch(
    `${API_BASE_URL}/alert-rules?${query.toString()}`,
    {
      cache: 'no-store',
      headers: buildAuthHeaders(authToken),
    },
  );

  if (!response.ok) {
    throw new Error('Falha ao carregar regras de alerta');
  }

  return response.json() as Promise<AlertRule[]>;
}

export async function createAlertRule(
  input: AlertRuleInput,
  authToken?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/alert-rules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(authToken),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar regra de alerta');
  }
}

export async function deleteAlertRule(
  id: string,
  authToken?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/alert-rules/${id}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(authToken),
  });

  if (!response.ok) {
    throw new Error('Falha ao remover regra de alerta');
  }
}
