import clsx from 'clsx';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-ring disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700',
    secondary: 'border border-border bg-surface text-ink hover:bg-surface-alt',
    ghost: 'text-primary hover:bg-primary/10',
    danger: 'bg-error text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-label',
    md: 'px-4 py-2.5 text-body',
    lg: 'px-6 py-3 text-body-lg',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
