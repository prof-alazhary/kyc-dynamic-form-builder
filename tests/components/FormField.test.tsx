import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '../../src/components/Form/FormField';
import { mockBasicFormFields, mockFormResponse } from '../fixtures/mockFormData';

const mockTextField = mockBasicFormFields[0]; // name field
const mockEmailField = mockBasicFormFields[1]; // email field

const mockRadioField = {
  id: 'gender',
  label: 'Gender',
  type: 'radio_buttons' as const,
  required: true,
  options: ['Male', 'Female', 'Other'],
};

const mockCheckboxField = {
  id: 'hobbies',
  label: 'Hobbies',
  type: 'multi_choice' as const,
  required: true,
  options: ['Reading', 'Sports', 'Music'],
  min: 1,
  max: 2,
};

const mockDateField = {
  id: 'birth_date',
  label: 'Birth Date',
  type: 'date' as const,
  required: true,
  minDate: '1900-01-01',
  maxDate: '2024-01-01',
  validation: [
    {
      type: 'required' as const,
      message: 'Birth date is required',
    },
  ],
};

const mockFileField = {
  id: 'profile_picture',
  label: 'Profile Picture',
  type: 'file' as const,
  required: false,
  accept: 'image/*',
  maxFileSize: 5242880, // 5MB
  validation: [
    {
      type: 'fileType' as const,
      value: ['image/*'],
      message: 'Please upload an image file',
    },
    {
      type: 'fileSize' as const,
      value: 5242880,
      message: 'File size must be less than 5MB',
    },
  ],
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

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
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

    const input = screen.getByPlaceholderText(/enter your name/i);
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockOnChange).toHaveBeenCalledWith('test value');
  });

  it('displays error message when provided', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockEmailField}
        value=""
        onChange={mockOnChange}
        error="Email is required"
      />
    );

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('renders with mock form response data', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockTextField}
        value={mockFormResponse.name}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue(mockFormResponse.name)).toBeInTheDocument();
  });

  it('renders date picker correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockDateField}
        value=""
        onChange={mockOnChange}
      />
    );

    // Check that the date input is rendered
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/select date/i)).toBeInTheDocument();
  });

  it('renders file upload correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockFileField}
        value={null}
        onChange={mockOnChange}
      />
    );

    // Check that the file upload interface is rendered
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/accepted formats/i)).toBeInTheDocument();
  });

  it('handles date picker value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockDateField}
        value=""
        onChange={mockOnChange}
      />
    );

    const dateInput = screen.getByDisplayValue('');
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } });

    // The date picker might convert the date format, so we check it was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays error message for date field', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockDateField}
        value=""
        onChange={mockOnChange}
        error="Birth date is required"
      />
    );

    // Check that error message is displayed
    expect(screen.getByText(/birth date is required/i)).toBeInTheDocument();
  });

  it('displays error message for file field', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField
        field={mockFileField}
        value={null}
        onChange={mockOnChange}
        error="Please upload an image file"
      />
    );

    // Check that error message is displayed
    expect(screen.getByText(/please upload an image file/i)).toBeInTheDocument();
  });
});
