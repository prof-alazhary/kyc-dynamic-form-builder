import React, { useState, useEffect } from 'react';
import { FormField } from '../../types/form';

interface SimpleSchemaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSchemaChange: (schema: FormField[]) => void;
  currentSchema: FormField[];
}

export const SimpleSchemaEditor: React.FC<SimpleSchemaEditorProps> = ({
  isOpen,
  onClose,
  onSchemaChange,
  currentSchema,
}) => {
  const [jsonValue, setJsonValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Convert RegExp objects to strings before displaying in JSON editor
      const schemaForDisplay = currentSchema.map(field => ({
        ...field,
        validation: field.validation?.map((rule: any) => ({
          ...rule,
          value: rule.type === 'pattern' && rule.value instanceof RegExp 
            ? rule.value.toString() 
            : rule.value
        }))
      }));
      
      setJsonValue(JSON.stringify(schemaForDisplay, null, 2));
    }
  }, [isOpen, currentSchema]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonValue(value);
    
    try {
      JSON.parse(value);
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleSave = () => {
    if (!isValid) return;
    
    try {
      const parsed = JSON.parse(jsonValue);
      if (!Array.isArray(parsed)) {
        setError('Schema must be an array of form fields');
        return;
      }
      
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
      
      localStorage.setItem('form-schema', JSON.stringify(processedSchema));
      onSchemaChange(processedSchema);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleReset = () => {
    const defaultSchema = [
      {
        id: 'full_name',
        label: 'Full Name',
        type: 'text' as const,
        required: true,
        placeholder: 'Enter your full name',
        validation: [
          { type: 'required' as const, message: 'Full name is required' },
          { type: 'minLength' as const, value: 2, message: 'Must be at least 2 characters' }
        ]
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'text' as const,
        required: true,
        placeholder: 'Enter your email address',
        validation: [
          { type: 'required' as const, message: 'Email is required' },
          { type: 'pattern' as const, value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
        ]
      }
    ];
    
    const formattedSchema = JSON.stringify(defaultSchema, null, 2);
    setJsonValue(formattedSchema);
    setIsValid(true);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Form Schema
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Modify the JSON schema below to customize your form
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                JSON Schema
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="btn-sm btn-secondary"
                >
                  Reset to Default
                </button>
                <button
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(JSON.parse(jsonValue), null, 2);
                      setJsonValue(formatted);
                    } catch (err) {
                      // Ignore formatting errors
                    }
                  }}
                  className="btn-sm btn-secondary"
                >
                  Format JSON
                </button>
              </div>
            </div>
            
            <textarea
              value={jsonValue}
              onChange={handleJsonChange}
              className={`w-full h-96 p-4 font-mono text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isValid 
                  ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'border-error-500 bg-error-50 dark:bg-error-900/20 text-error-900 dark:text-error-100'
              }`}
              placeholder="Enter your form schema as JSON..."
              spellCheck={false}
            />
            
            {error && (
              <div className="mt-2 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-error-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-error-800 dark:text-error-200 font-medium">
                      Invalid JSON
                    </p>
                    <p className="text-xs text-error-700 dark:text-error-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Schema Structure
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Schema must be an array of form field objects</p>
              <p>• Each field must have: id (string), label (string), type (string)</p>
              <p>• Valid types: text, textarea, radio_buttons, multi_choice, drop_down</p>
              <p>• Optional: required (boolean), options (array), validation (array), placeholder (string)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isValid ? (
              <span className="text-success-600 dark:text-success-400">
                ✓ Valid JSON schema
              </span>
            ) : (
              <span className="text-error-600 dark:text-error-400">
                ⚠ Please fix JSON errors before saving
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Schema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
