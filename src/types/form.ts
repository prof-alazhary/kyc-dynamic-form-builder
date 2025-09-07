export type FieldType = 'text' | 'textarea' | 'radio_buttons' | 'multi_choice' | 'drop_down';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  validation?: ValidationRule[];
  placeholder?: string;
  description?: string;
  step?: number; // Which step this field belongs to
}

export interface FormStep {
  id: number;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface MultiStepFormConfig {
  steps: FormStep[];
  allowStepNavigation?: boolean; // Allow going back to previous steps
  validateOnStepChange?: boolean; // Validate fields when changing steps
  showProgressBar?: boolean; // Show progress indicator
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FormResponse {
  [fieldId: string]: string | string[] | boolean | number;
}

export interface FormState {
  values: FormResponse;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormContextType {
  formState: FormState;
  updateField: (fieldId: string, value: any) => void;
  validateField: (fieldId: string, value: any) => string | null;
  validateForm: () => boolean;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}
