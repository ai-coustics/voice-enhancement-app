export function formatDate(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
}

type DurationFormat = 'h:m:s' | 'm:s' | 'h:m' | 'hm' | 'minutes';

export function formatDuration(seconds: number | undefined, format: DurationFormat) {
  if (seconds === undefined) {
    return format
      .split(':')
      .map(() => '--')
      .join(':');
  }

  const pad = (v: number) => v.toFixed(0).padStart(2, '0');

  if (format === 'minutes') {
    const m = Math.round(seconds / 60);
    return m + (m > 1 ? ' minutes' : ' minute');
  } else if (format === 'm:s') {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds - m * 60);
    return `${m}:${pad(s)}`;
  } else if (format === 'h:m' || format === 'hm') {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds - h * 3600) / 60);
    return format === 'h:m' ? `${h}:${pad(m)}` : `${h} h ${m} m`;
  } else if (format === 'h:m:s') {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds - h * 3600) / 60);
    const s = Math.round(seconds - h * 3600 - m * 60);
    return `${h}:${pad(m)}:${pad(s)}`;
  }
}

export function formatEnhancedFilename(
  filename: string,
  mix: number,
  modelName: string,
  extension?: string
): string {
  const extIndex = filename.lastIndexOf('.');
  let fileStem = filename;
  let fileExtension = extension;
  if (extIndex !== -1) {
    fileStem = filename.substring(0, extIndex);
    if (!fileExtension) {
      fileExtension = filename.substring(extIndex);
    }
  }
  const enhancementPercentage = Math.round(mix * 100);
  const enhancedName =
    enhancementPercentage > 0
      ? `${fileStem}-aic-${modelName.toLowerCase()}-${enhancementPercentage}p${fileExtension}`
      : filename;
  return enhancedName;
}

export function formatPercentage(fraction: number, numDecimals = 0) {
  return `${(100 * fraction).toFixed(numDecimals)}%`;
}

const model2Name: Record<string, string> = { 'FINCH': 'Finch', 'LARK': 'Lark' };
export function formatModel(modelId?: string) {
  return (modelId && model2Name[modelId]) || 'Finch';
}
