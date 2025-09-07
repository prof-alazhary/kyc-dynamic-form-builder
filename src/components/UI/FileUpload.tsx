import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  id: string;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  onBlur?: () => void;
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  value,
  onChange,
  onBlur,
  accept,
  multiple = false,
  maxFileSize,
  required = false,
  disabled = false,
  className = '',
  label,
  error,
  description,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileDisplayText = (): string => {
    if (!value) return 'No file selected';
    
    if (Array.isArray(value)) {
      if (value.length === 0) return 'No files selected';
      if (value.length === 1) return value[0].name;
      return `${value.length} files selected`;
    }
    
    return value.name;
  };

  const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
    // Handle file rejections (size, type errors)
    if (fileRejections.length > 0) {
      const errors = fileRejections.map(rejection => {
        const error = rejection.errors[0];
        if (error.code === 'file-too-large') {
          return `File size must be less than ${formatFileSize(maxFileSize || 0)}`;
        } else if (error.code === 'file-invalid-type') {
          return `File type not allowed. Accepted: ${accept || 'any'}`;
        }
        return error.message;
      });
      alert(errors.join('\n'));
      return;
    }

    if (acceptedFiles.length > 0) {
      if (multiple) {
        onChange(acceptedFiles);
      } else {
        onChange(acceptedFiles[0] || null);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple: multiple,
    maxSize: maxFileSize,
    disabled: disabled,
    onDropAccepted: () => {
      if (onBlur) onBlur();
    },
  });

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-error-600 dark:text-error-400 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      )}
      <div className={`file-upload-container ${className}`}>
        <div
          {...getRootProps()}
          className={`file-upload-dropzone ${isDragActive ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        >
          <input {...getInputProps()} id={id} required={required} />
          
          <div className="file-upload-content">
            <svg className="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="file-upload-text">
              <p className="file-upload-primary">
                {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="file-upload-secondary">
                {accept ? `Accepted formats: ${accept}` : 'Any file type'}
                {maxFileSize && ` • Max size: ${formatFileSize(maxFileSize)}`}
              </p>
            </div>
          </div>
          
          {value && (
            <div className="file-upload-selected">
              <span className="file-upload-selected-text">{getFileDisplayText()}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="file-upload-remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
