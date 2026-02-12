type ParsedDateParts = {
  year: number;
  month: number;
  day: number;
};

const monthShortEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const isValidDate = (value: Date) => !Number.isNaN(value.getTime());

const fromDayFirst = (value: string): ParsedDateParts | null => {
  const match = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2}|\d{4})$/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const rawYear = Number(match[3]);
  const year = match[3].length === 2 ? 2000 + rawYear : rawYear;
  return { year, month, day };
};

const fromYearFirst = (value: string): ParsedDateParts | null => {
  const match = value.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };
};

const parseTime = (value: string): { hours: number; minutes: number } | null => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  return {
    hours: Number(match[1]),
    minutes: Number(match[2])
  };
};

export const parseAppointmentDateTime = (dateValue: string, timeValue: string): Date | null => {
  const parsedDate = fromYearFirst(dateValue.trim()) ?? fromDayFirst(dateValue.trim());
  const parsedTime = parseTime(timeValue);

  if (!parsedDate || !parsedTime) {
    console.warn('[appointments] Fecha/hora inválida', { dateValue, timeValue });
    return null;
  }

  const resolved = new Date(
    parsedDate.year,
    parsedDate.month - 1,
    parsedDate.day,
    parsedTime.hours,
    parsedTime.minutes,
    0,
    0
  );

  if (!isValidDate(resolved)) {
    console.warn('[appointments] No se pudo construir Date', { dateValue, timeValue });
    return null;
  }

  return resolved;
};

export const formatAppointmentDate = (value: Date): string => {
  const month = monthShortEs[value.getMonth()] ?? '';
  return `${String(value.getDate()).padStart(2, '0')} ${month} ${value.getFullYear()}`;
};

export const formatAppointmentTime = (value: Date): string => {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
