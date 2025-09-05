import { describe, it, expect } from 'vitest';
import { 
  getInitialFormValues, 
  formatFormResponse, 
  isFormValid, 
  getFieldValue 
} from '../../src/utils/formHelpers';
import { mockBasicFormFields, mockFormResponse, mockInvalidFormResponse, mockExtendedFormResponse, mockExtendedInvalidFormResponse } from '../fixtures/mockFormData';

describe('formHelpers', () => {
  describe('getInitialFormValues', () => {
    it('creates initial values for mock form fields', () => {
      const initialValues = getInitialFormValues(mockBasicFormFields);
      
      expect(initialValues).toEqual({
        name: '',
        email: '',
      });
    });
  });

  describe('formatFormResponse', () => {
    it('formats mock form response correctly', () => {
      const formatted = formatFormResponse(mockFormResponse);
      
      expect(formatted).toEqual(mockFormResponse);
    });

    it('handles empty arrays in mock invalid response', () => {
      const formatted = formatFormResponse(mockInvalidFormResponse);
      
      expect(formatted.hobbies).toBe('');
    });
  });

  describe('isFormValid', () => {
    it('validates mock form response as valid', () => {
      const isValid = isFormValid(mockBasicFormFields, mockFormResponse, {});
      
      expect(isValid).toBe(true);
    });

    it('validates mock invalid form response as invalid', () => {
      const errors = {
        name: 'Name is required',
        email: 'Invalid email format',
      };
      
      const isValid = isFormValid(mockBasicFormFields, mockInvalidFormResponse, errors);
      
      expect(isValid).toBe(false);
    });
  });

  describe('getFieldValue', () => {
    it('gets field value from mock form response', () => {
      const nameField = mockBasicFormFields[0];
      const emailField = mockBasicFormFields[1];
      
      expect(getFieldValue(nameField, mockFormResponse)).toBe(mockFormResponse.name);
      expect(getFieldValue(emailField, mockFormResponse)).toBe(mockFormResponse.email);
    });

    it('returns default values for missing fields', () => {
      const nameField = mockBasicFormFields[0];
      
      expect(getFieldValue(nameField, {})).toBe('');
    });
  });

  describe('extended mock data tests', () => {
    it('formats extended form response correctly', () => {
      const formatted = formatFormResponse(mockExtendedFormResponse);
      
      expect(formatted).toEqual(mockExtendedFormResponse);
      expect(formatted.age).toBe('25');
      expect(formatted.phone).toBe('+1234567890');
    });

    it('handles extended invalid form response', () => {
      const formatted = formatFormResponse(mockExtendedInvalidFormResponse);
      
      expect(formatted.age).toBe('15');
      expect(formatted.phone).toBe('invalid-phone');
    });
  });
});
