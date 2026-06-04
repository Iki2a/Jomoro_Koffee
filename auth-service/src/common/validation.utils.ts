/**
 * Manual validation utilities — NO REGEX allowed per project spec.
 * All checks use character code comparisons, .includes(), .endsWith(), etc.
 */

export function isLettersOnly(value: string): boolean {
  if (!value || value.length === 0) return false;
  for (const char of value) {
    const code = char.charCodeAt(0);
    // A-Z: 65-90, a-z: 97-122
    if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
      return false;
    }
  }
  return true;
}

export function isValidEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;

  const atIndex = email.indexOf('@');
  const lastAtIndex = email.lastIndexOf('@');

  // Must have exactly one @
  if (atIndex !== lastAtIndex) return false;

  const localPart = email.substring(0, atIndex);
  const domain = email.substring(atIndex + 1);

  if (!localPart || localPart.length === 0) return false;
  if (!domain || domain.length === 0) return false;

  // Domain must end with one of these extensions
  const validExtensions = ['.com', '.net', '.org', '.id'];
  return validExtensions.some((ext) => domain.endsWith(ext));
}

export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8) return false;

  // No spaces allowed
  if (password.includes(' ')) return false;

  // Count numeric digits (0-9: char codes 48-57)
  let digitCount = 0;
  for (const char of password) {
    const code = char.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      digitCount++;
    }
  }

  return digitCount >= 2;
}
