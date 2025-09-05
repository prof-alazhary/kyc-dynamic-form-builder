import { FormField, FormResponse } from '../types/form';

export const getInitialFormValues = (fields: FormField[]): FormResponse => {
  const initialValues: FormResponse = {};
  
  fields.forEach(field => {
    switch (field.type) {
      case 'multi_choice':
        initialValues[field.id] = [];
        break;
      case 'radio_buttons':
      case 'drop_down':
        initialValues[field.id] = '';
        break;
      default:
        initialValues[field.id] = '';
    }
  });
  
  return initialValues;
};

export const formatFormResponse = (values: FormResponse): FormResponse => {
  const formatted: FormResponse = {};
  
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) {
      formatted[key] = '';
    } else {
      formatted[key] = value;
    }
  });
  
  return formatted;
};

export const isFormValid = (fields: FormField[], values: FormResponse, errors: Record<string, string>): boolean => {
  const requiredFields = fields.filter(field => field.required);
  
  for (const field of requiredFields) {
    const value = values[field.id];
    const error = errors[field.id];
    
    if (error || !value || (Array.isArray(value) && value.length === 0)) {
      return false;
    }
  }
  
  return Object.keys(errors).length === 0;
};

export const getFieldValue = (field: FormField, values: FormResponse): any => {
  return values[field.id] || (field.type === 'multi_choice' ? [] : '');
};

export const updateFieldValue = (field: FormField, currentValue: any, newValue: any): any => {
  // For multi_choice fields, the newValue is already the complete array from CheckboxGroup
  // So we just return it directly
  if (field.type === 'multi_choice') {
    return newValue;
  }
  
  // For other field types, return the new value directly
  return newValue;
};
