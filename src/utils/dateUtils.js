/**
 * Extract date part from a date string (YYYY-MM-DD format)
 * @param {string} dateString - Can be YYYY-MM-DD or any string containing a date
 * @returns {string} - Date in YYYY-MM-DD format, empty string if invalid
 */
export function extractDate(dateString) {
  if (!dateString) return '';
  try {
    // If it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // If it's a full datetime or ISO string, extract the date part
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error extracting date:', error);
    return '';
  }
}

/**
 * Extract time part from a datetime string (HH:MM format)
 * @param {string} dateTimeString - ISO datetime or time string
 * @returns {string} - Time in HH:MM format, empty string if invalid
 */
export function extractTime(dateTimeString) {
  if (!dateTimeString) return '';
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error extracting time:', error);
    return '';
  }
}

/**
 * Combine date and time strings into an ISO datetime string
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string|undefined} - ISO format datetime string or undefined if invalid
 */
export function combineDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return undefined;
  
  try {
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return undefined;
    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(timeStr)) return undefined;
    
    // Combine date and time
    const dateTimeStr = `${dateStr}T${timeStr}:00`;
    const date = new Date(dateTimeStr);
    
    if (isNaN(date.getTime())) return undefined;
    
    // Return ISO string
    return date.toISOString();
  } catch (error) {
    console.error('Error combining date and time:', error);
    return undefined;
  }
}

/**
 * Format date for display (e.g., "May 23, 2026")
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted display string
 */
export function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
}

/**
 * Format time for display (e.g., "10:30 AM")
 * @param {string} timeString - Time string in HH:MM format
 * @returns {string} - Formatted time string
 */
export function formatTimeForDisplay(timeString) {
  if (!timeString) return '';
  try {
    // Create a dummy date with the time
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time for display:', error);
    return '';
  }
}
