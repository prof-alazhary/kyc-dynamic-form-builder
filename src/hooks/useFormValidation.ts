import { useState, useCallback } from 'react';
import { FormField, FormResponse } from '../types/form';
import { validateField } from '../utils/validation';

export const useFormValidation = (fields: FormField[]) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateFieldValue = useCallback((fieldId: string, value: any): string | null => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.validation) return null;
    
    return validateField(value, field.validation);
  }, [fields]);

  const validateForm = useCallback((values: FormResponse): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = values[field.id];
      const error = validateFieldValue(field.id, value);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, validateFieldValue]);

  const setFieldError = useCallback((fieldId: string, error: string | null) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [fieldId]: error };
      } else {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  const setFieldTouched = useCallback((fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearTouched = useCallback(() => {
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateFieldValue,
    validateForm,
    setFieldError,
    setFieldTouched,
    clearErrors,
    clearTouched,
  };
};
