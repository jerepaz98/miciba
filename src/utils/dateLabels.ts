export const getRelativeTimeLabel = (timestamp: number, now = Date.now()): string => {
  const diff = now - timestamp;
  if (diff <= 0) {
    return 'Ahora';
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return 'Hace un momento';
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `Hace ${minutes} min`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `Hace ${hours} h`;
  }

  if (diff < 2 * day) {
    return 'Ayer';
  }

  const days = Math.floor(diff / day);
  return `Hace ${days} días`;
};

export const getDayBucket = (timestamp: number, now = new Date()): 'Hoy' | 'Ayer' | 'Anteriores' => {
  const source = new Date(timestamp);
  const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startSource = new Date(source.getFullYear(), source.getMonth(), source.getDate()).getTime();
  const daysDiff = Math.floor((startNow - startSource) / (24 * 60 * 60 * 1000));

  if (daysDiff <= 0) {
    return 'Hoy';
  }

  if (daysDiff === 1) {
    return 'Ayer';
  }

  return 'Anteriores';
};
