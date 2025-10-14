import { forwardRef, SelectHTMLAttributes } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  label,
  error,
  className = '',
  ...props
}, ref) => {
  const { effectiveTheme } = useTheme();

  const selectClasses = `w-full p-2 rounded-md focus:outline-none focus:ring-2 ${
    effectiveTheme === 'dark'
      ? 'bg-background border border-border text-foreground focus:ring-primary focus:border-primary'
      : 'bg-white border border-gray-300 text-gray-700 focus:ring-emerald-500 focus:border-emerald-500'
  } ${error ? 'border-red-500' : ''} ${className}`;

  const optionClasses = effectiveTheme === 'dark' 
    ? 'bg-background text-foreground' 
    : 'bg-white text-gray-700';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className={optionClasses}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';