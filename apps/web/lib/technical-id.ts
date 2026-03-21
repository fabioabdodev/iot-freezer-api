function normalizeBase(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

export function buildTechnicalIdFromName(
  name: string,
  fallback = 'registro',
  maxLength = 50,
) {
  const normalized = normalizeBase(name);
  const raw = normalized || normalizeBase(fallback) || 'registro';
  const trimmed = raw.slice(0, maxLength).replace(/^_+|_+$/g, '');
  return trimmed.length >= 3 ? trimmed : `${trimmed}_001`.slice(0, maxLength);
}

export function buildUniqueTechnicalId(
  name: string,
  existingIds: Iterable<string>,
  options?: {
    fallback?: string;
    maxLength?: number;
  },
) {
  const maxLength = options?.maxLength ?? 50;
  const base = buildTechnicalIdFromName(
    name,
    options?.fallback ?? 'registro',
    maxLength,
  );
  const existing = new Set(Array.from(existingIds).map((id) => id.toLowerCase()));

  if (!existing.has(base.toLowerCase())) return base;

  let suffix = 2;
  while (suffix <= 9999) {
    const suffixText = `_${suffix}`;
    const baseCut = base.slice(0, Math.max(1, maxLength - suffixText.length));
    const candidate = `${baseCut}${suffixText}`;
    if (!existing.has(candidate.toLowerCase())) {
      return candidate;
    }
    suffix += 1;
  }

  return `${base.slice(0, Math.max(1, maxLength - 5))}_${Date.now()
    .toString()
    .slice(-4)}`;
}
