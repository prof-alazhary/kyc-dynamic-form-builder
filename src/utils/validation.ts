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
    case 'fileSize':
      return validateFileSize(value, rule);
    case 'fileType':
      return validateFileType(value, rule);
    case 'dateRange':
      return validateDateRange(value, rule);
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
  
  let pattern: RegExp;
  
  // Handle both RegExp objects and string patterns
  if (rule.value instanceof RegExp) {
    pattern = rule.value;
  } else if (typeof rule.value === 'string') {
    try {
      // Try to create RegExp from string
      pattern = new RegExp(rule.value);
    } catch (error) {
      // If it's not a valid regex string, return invalid
      return {
        isValid: false,
        error: rule.message,
      };
    }
  } else {
    // If it's neither RegExp nor string, return invalid
    return {
      isValid: false,
      error: rule.message,
    };
  }
  
  const isValid = pattern.test(value);
  
  return {
    isValid,
    error: isValid ? null : rule.message,
  };
};

const validateFileSize = (value: any, rule: ValidationRule): ValidationResult => {
  if (!value) return { isValid: true, error: null };
  
  const maxSize = rule.value || 0;
  const files = Array.isArray(value) ? value : [value];
  
  for (const file of files) {
    if (file instanceof File && file.size > maxSize) {
      return {
        isValid: false,
        error: rule.message,
      };
    }
  }
  
  return { isValid: true, error: null };
};

const validateFileType = (value: any, rule: ValidationRule): ValidationResult => {
  if (!value) return { isValid: true, error: null };
  
  const allowedTypes = rule.value || [];
  const files = Array.isArray(value) ? value : [value];
  
  for (const file of files) {
    if (file instanceof File) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      const isValidType = allowedTypes.some((allowedType: string) => {
        if (allowedType.includes('*')) {
          // Handle wildcard types like "image/*"
          const baseType = allowedType.split('/')[0];
          return fileType.startsWith(baseType + '/');
        } else if (allowedType.startsWith('.')) {
          // Handle extensions like ".pdf"
          return fileName.endsWith(allowedType);
        } else {
          // Handle exact MIME types
          return fileType === allowedType;
        }
      });
      
      if (!isValidType) {
        return {
          isValid: false,
          error: rule.message,
        };
      }
    }
  }
  
  return { isValid: true, error: null };
};

const validateDateRange = (value: any, rule: ValidationRule): ValidationResult => {
  if (!value || typeof value !== 'string') return { isValid: true, error: null };
  
  const date = new Date(value);
  const { minDate, maxDate } = rule.value || {};
  
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: rule.message,
    };
  }
  
  if (minDate && date < new Date(minDate)) {
    return {
      isValid: false,
      error: rule.message,
    };
  }
  
  if (maxDate && date > new Date(maxDate)) {
    return {
      isValid: false,
      error: rule.message,
    };
  }
  
  return { isValid: true, error: null };
};
