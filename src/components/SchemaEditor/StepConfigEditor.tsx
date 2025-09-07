import React, { useState, useEffect } from 'react';
import { FormField, MultiStepFormConfig } from '../../types/form';
import { createCustomMultiStepConfig } from '../../utils/multiStepHelpers';

interface StepConfigEditorProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FormField[];
  onConfigChange: (config: MultiStepFormConfig) => void;
}

interface StepConfig {
  id: number;
  title: string;
  description: string;
  fieldIds: string[];
}

export const StepConfigEditor: React.FC<StepConfigEditorProps> = ({
  isOpen,
  onClose,
  fields,
  onConfigChange,
}) => {
  const [steps, setSteps] = useState<StepConfig[]>([
    { id: 1, title: 'Step 1', description: '', fieldIds: [] }
  ]);

  useEffect(() => {
    if (isOpen) {
      // Initialize with default step configuration
      const defaultSteps: StepConfig[] = [
        { id: 1, title: 'Personal Information', description: 'Tell us about yourself', fieldIds: [] },
        { id: 2, title: 'Preferences', description: 'What do you like?', fieldIds: [] },
        { id: 3, title: 'Additional Info', description: 'Any other details?', fieldIds: [] }
      ];
      setSteps(defaultSteps);
    }
  }, [isOpen]);

  const handleStepChange = (stepId: number, field: keyof StepConfig, value: string | string[]) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, [field]: value }
        : step
    ));
  };

  const addStep = () => {
    const newStepId = Math.max(...steps.map(s => s.id)) + 1;
    setSteps(prev => [...prev, { 
      id: newStepId, 
      title: `Step ${newStepId}`, 
      description: '', 
      fieldIds: [] 
    }]);
  };

  const removeStep = (stepId: number) => {
    if (steps.length > 1) {
      setSteps(prev => prev.filter(step => step.id !== stepId));
    }
  };

  const moveStepUp = (stepId: number) => {
    const index = steps.findIndex(s => s.id === stepId);
    if (index > 0) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const moveStepDown = (stepId: number) => {
    const index = steps.findIndex(s => s.id === stepId);
    if (index < steps.length - 1) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const toggleFieldInStep = (stepId: number, fieldId: string) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        const fieldIds = step.fieldIds.includes(fieldId)
          ? step.fieldIds.filter(id => id !== fieldId)
          : [...step.fieldIds, fieldId];
        return { ...step, fieldIds };
      }
      return step;
    }));
  };

  const handleSave = () => {
    const stepConfigs = steps.map(step => ({
      title: step.title,
      description: step.description,
      fieldIds: step.fieldIds
    }));

    const config = createCustomMultiStepConfig(fields, stepConfigs);
    onConfigChange(config);
    onClose();
  };

  const getAvailableFields = () => {
    const usedFields = new Set(steps.flatMap(step => step.fieldIds));
    return fields.filter(field => !usedFields.has(field.id));
  };

  const getStepFields = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    return step ? fields.filter(field => step.fieldIds.includes(field.id)) : [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col my-4">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
              Configure Form Steps
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Define how your form fields are organized into steps
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveStepUp(step.id)}
                      disabled={index === 0}
                      className="btn-sm btn-secondary disabled:opacity-50"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveStepDown(step.id)}
                      disabled={index === steps.length - 1}
                      className="btn-sm btn-secondary disabled:opacity-50"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeStep(step.id)}
                      disabled={steps.length === 1}
                      className="btn-sm btn-secondary text-error-600 hover:text-error-700 disabled:opacity-50"
                      title="Remove step"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                      className="form-input text-sm"
                      placeholder="Enter step title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                      className="form-input text-sm"
                      placeholder="Enter step description"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fields in this step ({getStepFields(step.id).length})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {fields.map(field => (
                      <label key={field.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <input
                          type="checkbox"
                          checked={step.fieldIds.includes(field.id)}
                          onChange={() => toggleFieldInStep(step.id, field.id)}
                          className="form-checkbox"
                        />
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {field.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addStep}
              className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Step
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Available Fields ({getAvailableFields().length})
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {getAvailableFields().length === 0 ? (
                <span className="text-success-600 dark:text-success-400">✓ All fields have been assigned to steps</span>
              ) : (
                <span className="text-warning-600 dark:text-warning-400">
                  ⚠ {getAvailableFields().length} fields are not assigned to any step
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {getAvailableFields().length === 0 ? (
              <span className="text-success-600 dark:text-success-400">
                ✓ All fields assigned to steps
              </span>
            ) : (
              <span className="text-warning-600 dark:text-warning-400">
                ⚠ Please assign all fields to steps
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="btn-secondary text-sm w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={getAvailableFields().length > 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
