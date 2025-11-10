export const parseTime = (time: string): number => {
  const match = time.match(/^(\d+)([a-zA-Z]+)$/);
  if (!match) throw new Error(`Невалідний формат: ${time}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Невідома одиниця часу: ${unit}`);
  }
};
