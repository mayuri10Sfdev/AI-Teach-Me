import clsx from 'clsx';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'soft' | 'elevated';
}

export function Card({
  variant = 'default',
  className,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-surface border border-border',
    soft: 'bg-surface-alt border border-border',
    elevated: 'bg-surface shadow-soft border border-border',
  };

  return (
    <div className={clsx('rounded-xl p-6', variants[variant], className)} {...props} />
  );
}
