import { FormField } from '../../src/types/form';

export const mockBasicFormFields: FormField[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your name',
    validation: [
      {
        type: 'required',
        message: 'Name is required',
      },
    ],
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    required: true,
    placeholder: 'Enter your email',
    validation: [
      {
        type: 'required',
        message: 'Email is required',
      },
      {
        type: 'pattern',
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format',
      },
    ],
  },
];

export const mockFormResponse = {
  name: 'John Doe',
  email: 'john@example.com',
  gender: 'Male',
  hobbies: ['Reading', 'Sports'],
  country: 'USA',
  bio: 'Test bio',
};

export const mockInvalidFormResponse = {
  name: '',
  email: 'invalid-email',
  gender: '',
  hobbies: [],
  country: '',
  bio: '',
};
