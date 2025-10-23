import React from 'react';

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;
