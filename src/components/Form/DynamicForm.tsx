import React, { useState, useCallback, useEffect } from 'react';
import { FormField as FormFieldType, FormResponse } from '../../types/form';
import { FormField } from './FormField';
import { FormSubmit } from './FormSubmit';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getInitialFormValues, formatFormResponse } from '../../utils/formHelpers';

interface DynamicFormProps {
  fields: FormFieldType[];
  onSubmit: (data: FormResponse) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  persistData?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onSuccess,
  onError,
  persistData = false,
}) => {
  const initialValues = getInitialFormValues(fields);
  const [formValues, setFormValues] = useLocalStorage(
    persistData ? 'kyc-form-data' : 'temp-form-data',
    initialValues
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    errors,
    touched,
    validateFieldValue,
    validateForm,
    setFieldError,
    setFieldTouched,
    clearErrors,
    clearTouched,
  } = useFormValidation(fields);

  // Clean up form values when schema changes (remove data for fields that no longer exist)
  useEffect(() => {
    const currentFieldIds = fields.map(field => field.id);
    const currentFormValues = { ...formValues };
    let hasChanges = false;

    // Remove values for fields that no longer exist in the schema
    Object.keys(currentFormValues).forEach(key => {
      if (!currentFieldIds.includes(key)) {
        delete currentFormValues[key];
        hasChanges = true;
      }
    });

    // Add default values for new fields that don't exist in form values
    fields.forEach(field => {
      if (currentFormValues[field.id] === undefined) {
        currentFormValues[field.id] = field.type === 'multi_choice' ? [] : '';
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setFormValues(currentFormValues);
    }
  }, [fields]); // Only run when fields change


  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    setFormValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    const error = validateFieldValue(fieldId, value);
    setFieldError(fieldId, error);
  }, [fields, setFormValues, validateFieldValue, setFieldError]);

  const handleFieldBlur = useCallback((fieldId: string) => {
    setFieldTouched(fieldId);
  }, [setFieldTouched]);

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched to show validation errors
    fields.forEach(field => {
      setFieldTouched(field.id);
    });

    const isValid = validateForm(formValues);
    if (!isValid) {
      console.log('Validation errors found:', errors);
      console.log('Form values:', formValues);
      onError?.('Please fix all validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedData = formatFormResponse(formValues, fields);
      await onSubmit(formattedData);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, validateForm, onSubmit, onSuccess, onError, fields, setFieldTouched]);

  const handleReset = useCallback(() => {
    setFormValues(initialValues);
    clearErrors();
    clearTouched();
  }, [setFormValues, initialValues, clearErrors, clearTouched]);

  const isValid = Object.keys(errors).length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={formValues[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={touched[field.id] ? errors[field.id] : undefined}
            onBlur={() => handleFieldBlur(field.id)}
          />
        ))}
      </div>
      
      <FormSubmit
        onSubmit={handleSubmit}
        onReset={handleReset}
        isSubmitting={isSubmitting}
        isValid={isValid}
        hasErrors={hasErrors}
      />
    </form>
  );
};
