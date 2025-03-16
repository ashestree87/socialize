/**
 * Utility functions for form validation
 */

/**
 * Validate an email address
 * @param email Email to validate
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a password strength
 * @param password Password to validate
 * @param options Validation options
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { isValid: boolean; errors: string[] } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;
  
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate a URL
 * @param url URL to validate
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate a phone number
 * @param phone Phone number to validate
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (10 digits for US, or 11 if starting with 1)
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.charAt(0) === '1');
}

/**
 * Validate a date
 * @param date Date to validate
 * @param options Validation options
 */
export function validateDate(
  date: Date | string,
  options: {
    minDate?: Date;
    maxDate?: Date;
    allowFuture?: boolean;
    allowPast?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const {
    minDate,
    maxDate,
    allowFuture = true,
    allowPast = true
  } = options;
  
  const now = new Date();
  
  if (!allowFuture && dateObj > now) {
    return { isValid: false, error: 'Future dates are not allowed' };
  }
  
  if (!allowPast && dateObj < now) {
    return { isValid: false, error: 'Past dates are not allowed' };
  }
  
  if (minDate && dateObj < minDate) {
    return {
      isValid: false,
      error: `Date must be on or after ${minDate.toLocaleDateString()}`
    };
  }
  
  if (maxDate && dateObj > maxDate) {
    return {
      isValid: false,
      error: `Date must be on or before ${maxDate.toLocaleDateString()}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate a required field
 * @param value Value to validate
 * @param fieldName Field name for error message
 */
export function validateRequired(value: any, fieldName: string = 'Field'): { isValid: boolean; error?: string } {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
}

/**
 * Validate a number is within range
 * @param value Number to validate
 * @param options Validation options
 */
export function validateNumber(
  value: number,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
    fieldName?: string;
  } = {}
): { isValid: boolean; error?: string } {
  const { min, max, integer = false, fieldName = 'Value' } = options;
  
  if (value === null || value === undefined || isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  
  if (integer && !Number.isInteger(value)) {
    return { isValid: false, error: `${fieldName} must be an integer` };
  }
  
  if (min !== undefined && value < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && value > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }
  
  return { isValid: true };
}

/**
 * Validate text length
 * @param text Text to validate
 * @param options Validation options
 */
export function validateLength(
  text: string,
  options: {
    min?: number;
    max?: number;
    fieldName?: string;
  } = {}
): { isValid: boolean; error?: string } {
  const { min, max, fieldName = 'Text' } = options;
  
  if (!text && min && min > 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!text) {
    return { isValid: true };
  }
  
  if (min !== undefined && text.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  
  if (max !== undefined && text.length > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max} characters` };
  }
  
  return { isValid: true };
} 