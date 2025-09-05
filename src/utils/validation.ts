import { ValidationRule, ValidationResult } from '../types/validation';

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    const result = validateRule(value, rule);
    if (!result.isValid) {
      return result.error;
    }
  }
  return null;
};

export const validateRule = (value: any, rule: ValidationRule): ValidationResult => {
  switch (rule.type) {
    case 'required':
      return validateRequired(value, rule);
    case 'minLength':
      return validateMinLength(value, rule);
    case 'maxLength':
      return validateMaxLength(value, rule);
    case 'min':
      return validateMin(value, rule);
    case 'max':
      return validateMax(value, rule);
    case 'pattern':
      return validatePattern(value, rule);
    default:
      return { isValid: true, error: null };
  }
};

const validateRequired = (value: any, rule: ValidationRule): ValidationResult => {
  if (Array.isArray(value)) {
    const isValid = value.length > 0;
    return {
      isValid,
      error: isValid ? null : rule.message,
    };
  }
  const isValid = value !== null && value !== undefined && value !== '';
  return {
    isValid,
    error: isValid ? null : rule.message,
  };
};

const validateMinLength = (value: any, rule: ValidationRule): ValidationResult => {
  if (typeof value !== 'string') return { isValid: true, error: null };
  const isValid = value.length >= (rule.value || 0);
  return {
    isValid,
    error: isValid ? null : rule.message,
  };
};

const validateMaxLength = (value: any, rule: ValidationRule): ValidationResult => {
  if (typeof value !== 'string') return { isValid: true, error: null };
  const isValid = value.length <= (rule.value || Infinity);
  return {
    isValid,
    error: isValid ? null : rule.message,
  };
};

const validateMin = (value: any, rule: ValidationRule): ValidationResult => {
  if (Array.isArray(value)) {
    const isValid = value.length >= (rule.value || 0);
    return {
      isValid,
      error: isValid ? null : rule.message,
    };
  }
  if (typeof value === 'number') {
    const isValid = value >= (rule.value || 0);
    return {
      isValid,
      error: isValid ? null : rule.message,
    };
  }
  return { isValid: true, error: null };
};

const validateMax = (value: any, rule: ValidationRule): ValidationResult => {
  if (Array.isArray(value)) {
    const isValid = value.length <= (rule.value || Infinity);
    return {
      isValid,
      error: isValid ? null : rule.message,
    };
  }
  if (typeof value === 'number') {
    const isValid = value <= (rule.value || Infinity);
    return {
      isValid,
      error: isValid ? null : rule.message,
    };
  }
  return { isValid: true, error: null };
};

const validatePattern = (value: any, rule: ValidationRule): ValidationResult => {
  if (typeof value !== 'string') return { isValid: true, error: null };
  const pattern = rule.value as RegExp;
  const isValid = pattern.test(value);
  return {
    isValid,
    error: isValid ? null : rule.message,
  };
};
