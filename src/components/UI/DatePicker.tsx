import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export const DatePickerComponent: React.FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  onBlur,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = '',
}) => {
  const selectedDate = value ? new Date(value) : null;
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Convert to ISO string format (YYYY-MM-DD)
      const isoString = date.toISOString().split('T')[0];
      onChange(isoString);
    } else {
      onChange('');
    }
  };

  const minDateObj = minDate ? new Date(minDate) : undefined;
  const maxDateObj = maxDate ? new Date(maxDate) : undefined;

  return (
    <div className="relative">
      <DatePicker
        id={id}
        selected={selectedDate}
        onChange={handleDateChange}
        onBlur={onBlur}
        placeholderText={placeholder}
        required={required}
        disabled={disabled}
        minDate={minDateObj}
        maxDate={maxDateObj}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        className={`form-input pr-10 ${className}`}
        wrapperClassName="w-full"
        autoComplete="off"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-400 dark:text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    </div>
  );
};
