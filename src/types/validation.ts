export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface FieldValidation {
  fieldId: string;
  value: any;
  rules: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export type ValidationFunction = (value: any, rule: ValidationRule) => ValidationResult;
