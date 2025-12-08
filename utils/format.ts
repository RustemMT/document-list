/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирует размер файла в читаемый формат
 * @param bytes - размер в байтах
 * @returns отформатированная строка (B, KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Форматирует дату в формат времени
 * @param date - объект Date
 * @param locale - локаль (по умолчанию 'ru-RU')
 * @returns отформатированное время (HH:MM)
 */
export function formatTime(date: Date, locale: string = "ru-RU"): string {
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Форматирует дату в читаемый формат
 * @param dateString - строка с датой
 * @param locale - локаль (по умолчанию 'ru-RU')
 * @returns отформатированная дата
 */
export function formatDate(
  dateString: string,
  locale: string = "ru-RU"
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
