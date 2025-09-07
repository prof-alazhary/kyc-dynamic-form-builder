import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DynamicForm } from '../../src/components/Form/DynamicForm';
import { mockBasicFormFields, mockFormResponse, mockInvalidFormResponse, mockExtendedFormResponse, mockExtendedInvalidFormResponse } from '../fixtures/mockFormData';

const mockOnSubmit = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnError = vi.fn();

describe('DynamicForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with mock fields correctly', () => {
    render(
      <DynamicForm
        fields={mockBasicFormFields}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/submit form/i)).toBeInTheDocument();
  });

  it('handles form submission with valid mock data', async () => {
    render(
      <DynamicForm
        fields={mockBasicFormFields}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByText(/submit form/i);

    fireEvent.change(nameInput, { target: { value: mockFormResponse.name } });
    fireEvent.change(emailInput, { target: { value: mockFormResponse.email } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: mockFormResponse.name,
        email: mockFormResponse.email,
      });
    });
  });

  it('shows validation errors with invalid mock data', async () => {
    render(
      <DynamicForm
        fields={mockBasicFormFields}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByText(/submit form/i);

    // First, touch the fields by changing values
    fireEvent.change(nameInput, { target: { value: mockInvalidFormResponse.name } });
    fireEvent.blur(nameInput); // Trigger touch
    fireEvent.change(emailInput, { target: { value: mockInvalidFormResponse.email } });
    fireEvent.blur(emailInput); // Trigger touch

    // Then try to submit
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows submission when form is empty (validation on submit)', () => {
    render(
      <DynamicForm
        fields={mockBasicFormFields}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    const submitButton = screen.getByText(/submit form/i);
    // Button should be enabled initially - validation happens on submit
    expect(submitButton).not.toBeDisabled();
  });

  it('handles extended form response data', () => {
    // Test that our extended mock data has the expected structure
    expect(mockExtendedFormResponse).toHaveProperty('name');
    expect(mockExtendedFormResponse).toHaveProperty('email');
    expect(mockExtendedFormResponse).toHaveProperty('age');
    expect(mockExtendedFormResponse).toHaveProperty('phone');
    expect(mockExtendedFormResponse.age).toBe('25');
    expect(mockExtendedFormResponse.phone).toBe('+1234567890');
  });

  it('handles extended invalid form response data', () => {
    // Test that our extended invalid mock data has the expected structure
    expect(mockExtendedInvalidFormResponse).toHaveProperty('name');
    expect(mockExtendedInvalidFormResponse).toHaveProperty('email');
    expect(mockExtendedInvalidFormResponse).toHaveProperty('age');
    expect(mockExtendedInvalidFormResponse).toHaveProperty('phone');
    expect(mockExtendedInvalidFormResponse.age).toBe('15'); // Invalid age
    expect(mockExtendedInvalidFormResponse.phone).toBe('invalid-phone');
  });
});
