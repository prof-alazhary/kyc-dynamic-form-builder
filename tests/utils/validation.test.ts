import { describe, it, expect } from 'vitest';
import { validateField } from '../../src/utils/validation';
import { ValidationRule } from '../../src/types/validation';
import { mockBasicFormFields, mockFormResponse, mockInvalidFormResponse } from '../fixtures/mockFormData';

describe('validation', () => {
  describe('validateField', () => {
    it('validates required field correctly', () => {
      const rules: ValidationRule[] = [
        {
          type: 'required',
          message: 'This field is required',
        },
      ];

      expect(validateField('', rules)).toBe('This field is required');
      expect(validateField('test', rules)).toBeNull();
      expect(validateField([], rules)).toBe('This field is required');
      expect(validateField(['item'], rules)).toBeNull();
      expect(validateField(null, rules)).toBe('This field is required');
      expect(validateField(undefined, rules)).toBe('This field is required');
    });

    it('validates minLength correctly', () => {
      const rules: ValidationRule[] = [
        {
          type: 'minLength',
          value: 3,
          message: 'Must be at least 3 characters',
        },
      ];

      expect(validateField('ab', rules)).toBe('Must be at least 3 characters');
      expect(validateField('abc', rules)).toBeNull();
      expect(validateField('abcd', rules)).toBeNull();
    });

    it('validates maxLength correctly', () => {
      const rules: ValidationRule[] = [
        {
          type: 'maxLength',
          value: 5,
          message: 'Must be no more than 5 characters',
        },
      ];

      expect(validateField('abcdef', rules)).toBe('Must be no more than 5 characters');
      expect(validateField('abcde', rules)).toBeNull();
      expect(validateField('abcd', rules)).toBeNull();
    });

    it('validates pattern correctly', () => {
      const rules: ValidationRule[] = [
        {
          type: 'pattern',
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Invalid email format',
        },
      ];

      expect(validateField('invalid-email', rules)).toBe('Invalid email format');
      expect(validateField('test@example.com', rules)).toBeNull();
    });

    it('validates min for arrays correctly', () => {
      const rules: ValidationRule[] = [
        {
          type: 'min',
          value: 2,
          message: 'Select at least 2 items',
        },
      ];

      expect(validateField([], rules)).toBe('Select at least 2 items');
      expect(validateField(['item1'], rules)).toBe('Select at least 2 items');
      expect(validateField(['item1', 'item2'], rules)).toBeNull();
    });

    it('validates max for arrays correctly', () => {
      const rules: ValidationRule[] = [
        {
          type: 'max',
          value: 2,
          message: 'Select no more than 2 items',
        },
      ];

      expect(validateField(['item1', 'item2', 'item3'], rules)).toBe('Select no more than 2 items');
      expect(validateField(['item1', 'item2'], rules)).toBeNull();
      expect(validateField(['item1'], rules)).toBeNull();
    });

    it('returns null when no validation rules', () => {
      expect(validateField('any value', [])).toBeNull();
    });

    it('validates mock form fields correctly', () => {
      const nameField = mockBasicFormFields[0];
      const emailField = mockBasicFormFields[1];

      // Test valid name
      expect(validateField(mockFormResponse.name, nameField.validation!)).toBeNull();
      
      // Test invalid name (empty)
      expect(validateField(mockInvalidFormResponse.name, nameField.validation!)).toBe('Name is required');
      
      // Test valid email
      expect(validateField(mockFormResponse.email, emailField.validation!)).toBeNull();
      
      // Test invalid email
      expect(validateField(mockInvalidFormResponse.email, emailField.validation!)).toBe('Invalid email format');
    });
  });
});
