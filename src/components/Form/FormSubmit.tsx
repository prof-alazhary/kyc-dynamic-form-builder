import React from 'react';
import { Button } from '../UI/Button';

interface FormSubmitProps {
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
}

export const FormSubmit: React.FC<FormSubmitProps> = ({
  onSubmit,
  onReset,
  isSubmitting,
  isValid,
  hasErrors,
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        type="button"
        variant="secondary"
        onClick={onReset}
        disabled={isSubmitting}
      >
        Reset Form
      </Button>
      
      <div className="flex items-center space-x-4">
        {hasErrors && (
          <p className="text-sm text-error-600 dark:text-error-400">
            Please fix the errors above
          </p>
        )}
        <Button
          type="button"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Form'}
        </Button>
      </div>
    </div>
  );
};
