import { FormField } from '../types/form';

export const defaultFormSchema: FormField[] = [
  {
    id: 'full_name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name',
    validation: [
      {
        type: 'required',
        message: 'Full name is required',
      },
      {
        type: 'minLength',
        value: 2,
        message: 'Full name must be at least 2 characters',
      },
    ],
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'text',
    required: true,
    placeholder: 'Enter your email address',
    validation: [
      {
        type: 'required',
        message: 'Email is required',
      },
      {
        type: 'pattern',
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    ],
  },
  {
    id: 'age',
    label: 'Age',
    type: 'text',
    required: true,
    placeholder: 'Enter your age',
    validation: [
      {
        type: 'required',
        message: 'Age is required',
      },
      {
        type: 'pattern',
        value: /^\d+$/,
        message: 'Age must be a number',
      },
      {
        type: 'min',
        value: 18,
        message: 'You must be at least 18 years old',
      },
      {
        type: 'max',
        value: 120,
        message: 'Please enter a valid age',
      },
    ],
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'radio_buttons',
    required: true,
    options: ['Male', 'Female', 'Other'],
    validation: [
      {
        type: 'required',
        message: 'Please select your gender',
      },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    type: 'multi_choice',
    required: true,
    options: ['Reading', 'Traveling', 'Sports', 'Gaming', 'Music', 'Art'],
    min: 1,
    max: 3,
    validation: [
      {
        type: 'required',
        message: 'Please select at least one hobby',
      },
      {
        type: 'min',
        value: 1,
        message: 'Please select at least 1 hobby',
      },
      {
        type: 'max',
        value: 3,
        message: 'Please select no more than 3 hobbies',
      },
    ],
  },
  {
    id: 'country',
    label: 'Country of Residence',
    type: 'drop_down',
    required: true,
    options: ['Egypt', 'USA', 'Germany', 'France', 'UK', 'Canada', 'Australia', 'Other'],
    validation: [
      {
        type: 'required',
        message: 'Please select your country',
      },
    ],
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'text',
    required: false,
    placeholder: '+1 (555) 123-4567',
    validation: [
      {
        type: 'pattern',
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number',
      },
    ],
  },
  {
    id: 'bio',
    label: 'Bio',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us about yourself...',
    validation: [
      {
        type: 'maxLength',
        value: 500,
        message: 'Bio must be no more than 500 characters',
      },
    ],
  },
];
