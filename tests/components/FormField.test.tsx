import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '../../src/components/Form/FormField';
import { FormField as FormFieldType } from '../../src/types/form';

const mockTextField: FormFieldType = {
  id: 'test-field',
  label: 'Test Field',
  type: 'text',
  required: true,
  placeholder: 'Enter test value',
};

const mockRadioField: FormFieldType = {
  id: 'gender',
  label: 'Gender',
  type: 'radio_buttons',
  required: true,
  options: ['Male', 'Female', 'Other'],
};

const mockCheckboxField: FormFieldType = {
  id: 'hobbies',
  label: 'Hobbies',
  type: 'multi_choice',
  required: true,
  options: ['Reading', 'Sports', 'Music'],
  min: 1,
  max: 2,
};

describe('FormField', () => {
  it('renders text input correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockTextField}
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/test field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter test value/i)).toBeInTheDocument();
  });

  it('renders radio buttons correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockRadioField}
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Male')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Female')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Other')).toBeInTheDocument();
  });

  it('renders checkbox group correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockCheckboxField}
        value={[]}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/hobbies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reading/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sports/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/music/i)).toBeInTheDocument();
  });

  it('calls onChange when text input changes', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockTextField}
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/enter test value/i);
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockOnChange).toHaveBeenCalledWith('test value');
  });

  it('displays error message when provided', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockTextField}
        value=""
        onChange={mockOnChange}
        error="This field is required"
      />
    );

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });
});
