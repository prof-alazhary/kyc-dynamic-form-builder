import React from 'react';

interface CheckboxGroupProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  description,
  required = false,
  min,
  max,
}) => {
  const handleChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    
    if (max && newValue.length > max) {
      return;
    }
    
    onChange(newValue);
  };
  
  return (
    <div className="form-field">
      {label && (
        <fieldset>
          <legend className="form-label">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
            {min && max && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                (Select {min}-{max})
              </span>
            )}
          </legend>
          <div className="mt-2 space-y-2">
            {options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => handleChange(option)}
                  className={`form-checkbox ${error ? 'border-error-500' : ''}`}
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
