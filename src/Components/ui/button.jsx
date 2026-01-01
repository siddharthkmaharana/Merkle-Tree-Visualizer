import React from 'react';

export const Button = React.forwardRef(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-[#00ff88] text-black hover:bg-[#00dd77]',
      ghost: 'hover:bg-gray-200 dark:hover:bg-gray-800',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    const computedClassName = `${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

    return (
      <button
        className={computedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
