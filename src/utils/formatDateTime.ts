export function formatDateTime(input: string): string {
  const date = new Date(input);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  // Format parts to extract components
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';

  return `${get('month')} ${get('day')}, ${get('year')} at ${get('hour')}:${get('minute')} ${get('dayPeriod')}`;
}

export function formatDateTime_(input: string): string {
  const date = new Date(input);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: "h24",
  };

  // Format parts to extract components
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';

  return `${get('hour')}:${get('minute')} ${get('day')}-${get('month')}-${get('year')}`;
}
