import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  description,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={`form-textarea ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''} ${className}`}
        {...props}
      />
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
