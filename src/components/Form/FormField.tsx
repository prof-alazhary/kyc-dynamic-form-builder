import React from 'react';
import { FormField as FormFieldType } from '../../types/form';
import { Input } from '../UI/Input';
import { TextArea } from '../UI/TextArea';
import { RadioGroup } from '../UI/RadioGroup';
import { CheckboxGroup } from '../UI/CheckboxGroup';
import { Select } from '../UI/Select';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  onBlur?: () => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  onBlur,
}) => {
  const commonProps = {
    label: field.label,
    error,
    description: field.description,
    required: field.required,
    onBlur,
  };

  switch (field.type) {
    case 'text':
      return (
        <Input
          {...commonProps}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      );

    case 'textarea':
      return (
        <TextArea
          {...commonProps}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      );

    case 'radio_buttons':
      return (
        <RadioGroup
          {...commonProps}
          options={field.options || []}
          value={value || ''}
          onChange={onChange}
        />
      );

    case 'multi_choice':
      return (
        <CheckboxGroup
          {...commonProps}
          options={field.options || []}
          value={value || []}
          onChange={onChange}
          min={field.min}
          max={field.max}
        />
      );

    case 'drop_down':
      return (
        <Select
          {...commonProps}
          options={field.options || []}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return (
        <div className="form-field">
          <p className="text-error-600 dark:text-error-400">
            Unknown field type: {field.type}
          </p>
        </div>
      );
  }
};
