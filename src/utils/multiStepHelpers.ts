import { FormField, FormStep, MultiStepFormConfig } from '../types/form';

export const createMultiStepConfig = (
  fields: FormField[], 
  fieldsPerStep: number = 3
): MultiStepFormConfig => {
  const steps: FormStep[] = [];
  const totalSteps = Math.ceil(fields.length / fieldsPerStep);

  for (let i = 0; i < totalSteps; i++) {
    const startIndex = i * fieldsPerStep;
    const endIndex = Math.min(startIndex + fieldsPerStep, fields.length);
    const stepFields = fields.slice(startIndex, endIndex);

    steps.push({
      id: i + 1,
      title: `Step ${i + 1}`,
      description: `Complete the following fields (${startIndex + 1}-${endIndex} of ${fields.length})`,
      fields: stepFields.map(field => ({
        ...field,
        step: i + 1
      }))
    });
  }

  return {
    steps,
    allowStepNavigation: true,
    validateOnStepChange: true,
    showProgressBar: true
  };
};

export const createCustomMultiStepConfig = (
  fields: FormField[],
  stepConfig: { title: string; description?: string; fieldIds: string[] }[]
): MultiStepFormConfig => {
  const steps: FormStep[] = stepConfig.map((config, index) => {
    const stepFields = fields.filter(field => config.fieldIds.includes(field.id));
    
    return {
      id: index + 1,
      title: config.title,
      description: config.description,
      fields: stepFields.map(field => ({
        ...field,
        step: index + 1
      }))
    };
  });

  return {
    steps,
    allowStepNavigation: true,
    validateOnStepChange: true,
    showProgressBar: true
  };
};

export const getFieldsFromMultiStepConfig = (config: MultiStepFormConfig): FormField[] => {
  return config.steps.flatMap(step => step.fields);
};

export const getCurrentStepFields = (config: MultiStepFormConfig, currentStep: number): FormField[] => {
  const step = config.steps.find(s => s.id === currentStep);
  return step ? step.fields : [];
};

export const validateCurrentStep = (
  fields: FormField[], 
  values: Record<string, any>, 
  errors: Record<string, string>
): boolean => {
  return fields.every(field => {
    if (!field.required) return true;
    const value = values[field.id];
    const error = errors[field.id];
    return !error && value && (Array.isArray(value) ? value.length > 0 : value !== '');
  });
};
