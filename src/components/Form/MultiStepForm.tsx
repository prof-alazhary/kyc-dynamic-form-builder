import React, { useState, useCallback, useEffect } from 'react';
import { FormField as FormFieldType, FormResponse, MultiStepFormConfig } from '../../types/form';
import { FormField } from './FormField';
import { ProgressBar } from '../UI/ProgressBar';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getInitialFormValues, formatFormResponse } from '../../utils/formHelpers';
import { getCurrentStepFields, validateCurrentStep } from '../../utils/multiStepHelpers';

interface MultiStepFormProps {
  config: MultiStepFormConfig;
  onSubmit: (data: FormResponse) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  persistData?: boolean;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  config,
  onSubmit,
  onSuccess,
  onError,
  persistData = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get all fields from the multi-step config
  const allFields = config.steps.flatMap(step => step.fields);
  const initialValues = getInitialFormValues(allFields);
  
  const [formValues, setFormValues] = useLocalStorage(
    persistData ? 'kyc-multistep-form-data' : 'temp-multistep-form-data',
    initialValues
  );

  const [stepData, setStepData] = useLocalStorage(
    persistData ? 'kyc-multistep-step-data' : 'temp-multistep-step-data',
    { currentStep: 1 }
  );

  const {
    errors,
    touched,
    validateFieldValue,
    validateForm,
    setFieldError,
    setFieldTouched,
    clearErrors,
    clearTouched,
  } = useFormValidation(allFields);

  // Restore current step from localStorage on mount
  useEffect(() => {
    if (stepData.currentStep && stepData.currentStep <= config.steps.length) {
      setCurrentStep(stepData.currentStep);
    }
  }, []); // Only run on mount

  const currentStepFields = getCurrentStepFields(config, currentStep);
  const currentStepConfig = config.steps.find(step => step.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === config.steps.length;

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    const field = allFields.find(f => f.id === fieldId);
    if (!field) return;

    setFormValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    const error = validateFieldValue(fieldId, value);
    setFieldError(fieldId, error);
  }, [allFields, setFormValues, validateFieldValue, setFieldError]);

  const handleFieldBlur = useCallback((fieldId: string) => {
    setFieldTouched(fieldId);
  }, [setFieldTouched]);

  const handleNext = useCallback(() => {
    if (config.validateOnStepChange) {
      // Mark current step fields as touched
      currentStepFields.forEach(field => {
        setFieldTouched(field.id);
      });

      // Validate current step
      const isCurrentStepValid = validateCurrentStep(currentStepFields, formValues, errors);
      if (!isCurrentStepValid) {
        onError?.('Please fix all validation errors before proceeding');
        return;
      }
    }

    if (!isLastStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setStepData({ currentStep: nextStep });
    }
  }, [currentStepFields, formValues, errors, config.validateOnStepChange, isLastStep, setFieldTouched, onError, currentStep, setStepData]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep && config.allowStepNavigation) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setStepData({ currentStep: prevStep });
    }
  }, [isFirstStep, config.allowStepNavigation, currentStep, setStepData]);

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched to show validation errors
    allFields.forEach(field => {
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
      const formattedData = formatFormResponse(formValues, allFields);
      await onSubmit(formattedData);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, validateForm, onSubmit, onSuccess, onError, allFields, setFieldTouched]);

  const handleReset = useCallback(() => {
    setFormValues(initialValues);
    setCurrentStep(1);
    setStepData({ currentStep: 1 });
    clearErrors();
    clearTouched();
  }, [setFormValues, initialValues, clearErrors, clearTouched, setStepData]);

  const isValid = Object.keys(errors).length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="multistep-form-container">
      {config.showProgressBar && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={config.steps.length}
          stepTitles={config.steps.map(step => step.title)}
          className="mb-8"
        />
      )}

      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {currentStepConfig?.title}
        </h2>
        {currentStepConfig?.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {currentStepConfig.description}
          </p>
        )}
      </div>

      <form className="form-container" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6">
          {currentStepFields.map((field) => (
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
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {!isFirstStep && config.allowStepNavigation && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
            >
              Reset
            </button>
            
            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
