import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DEFAULT_TIME_ZONE = 'America/Sao_Paulo';

function coerceDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function formatHumanDatePrefix(date: Date) {
  if (isToday(date)) return 'hoje';
  if (isYesterday(date)) return 'ontem';

  return format(date, 'EEEE, dd/MM/yy', { locale: ptBR });
}

export function formatHumanDateTime(value: string | Date) {
  const date = coerceDate(value);
  const dateLabel = formatHumanDatePrefix(date);
  const timeLabel = date.toLocaleTimeString('pt-BR', {
    timeZone: DEFAULT_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
  });

  if (dateLabel === 'hoje' || dateLabel === 'ontem') {
    return `${dateLabel}, ${format(date, 'dd/MM/yyyy', { locale: ptBR })} às ${timeLabel}`;
  }

  return `${dateLabel} às ${timeLabel}`;
}

export function formatRelativeDateTime(value: string | Date) {
  const date = coerceDate(value);
  return `${formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  })} (${formatHumanDateTime(date)})`;
}
