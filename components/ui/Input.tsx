import clsx from 'clsx';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label || 'text-input';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-label font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-body text-ink placeholder:text-secondaryText',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          error && 'border-error focus:ring-error/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-caption text-secondaryText">{helperText}</p>
      )}
    </div>
  );
}
