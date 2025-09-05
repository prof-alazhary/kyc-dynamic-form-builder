import { useState, useEffect } from 'react';
import { FormField } from '../types/form';
import { sampleFormSchema } from '../data/formSchema';

export const useSchemaStorage = () => {
  const [schema, setSchema] = useState<FormField[]>(sampleFormSchema);

  useEffect(() => {
    const savedSchema = localStorage.getItem('form-schema');
    if (savedSchema) {
      try {
        const parsed = JSON.parse(savedSchema);
        if (Array.isArray(parsed)) {
          // Convert string patterns back to RegExp objects
          const processedSchema = parsed.map(field => ({
            ...field,
            validation: field.validation?.map((rule: any) => ({
              ...rule,
              value: rule.type === 'pattern' && typeof rule.value === 'string' 
                ? new RegExp(rule.value.replace(/^\//, '').replace(/\/$/, '')) 
                : rule.value
            }))
          }));
          setSchema(processedSchema);
        }
      } catch (error) {
        console.warn('Failed to parse saved schema, using default:', error);
      }
    }
  }, []);

  const updateSchema = (newSchema: FormField[]) => {
    setSchema(newSchema);
    
    // Convert RegExp objects to strings before saving to localStorage
    const schemaForStorage = newSchema.map(field => ({
      ...field,
      validation: field.validation?.map((rule: any) => ({
        ...rule,
        value: rule.type === 'pattern' && rule.value instanceof RegExp 
          ? rule.value.toString() 
          : rule.value
      }))
    }));
    
    localStorage.setItem('form-schema', JSON.stringify(schemaForStorage));
  };

  const resetToDefault = () => {
    setSchema(sampleFormSchema);
    
    // Convert RegExp objects to strings before saving to localStorage
    const schemaForStorage = sampleFormSchema.map(field => ({
      ...field,
      validation: field.validation?.map((rule: any) => ({
        ...rule,
        value: rule.type === 'pattern' && rule.value instanceof RegExp 
          ? rule.value.toString() 
          : rule.value
      }))
    }));
    
    localStorage.setItem('form-schema', JSON.stringify(schemaForStorage));
  };

  return {
    schema,
    updateSchema,
    resetToDefault,
  };
};
