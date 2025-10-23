import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base h-12',
  };

  const variants: Record<string, string> = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
    outline: 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50',
  };

  return (
    <button className={`${base} ${sizeMap[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
