import clsx from 'clsx';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    neutral: 'bg-surface-alt text-secondaryText',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2.5 py-1 text-caption font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
