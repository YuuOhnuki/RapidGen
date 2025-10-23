import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-200 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
