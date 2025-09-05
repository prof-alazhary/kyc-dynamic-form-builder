import React from 'react';

interface RadioGroupProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  name?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  description,
  required = false,
  name,
}) => {
  const groupName = name || `radio-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="form-field">
      {label && (
        <fieldset>
          <legend className="form-label">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </legend>
          <div className="mt-2 space-y-2">
            {options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={groupName}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className={`form-radio ${error ? 'border-error-500' : ''}`}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {description && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
      {error && (
        <p className="form-error">
          {error}
        </p>
      )}
    </div>
  );
};
