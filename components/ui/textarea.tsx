import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string };

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return <textarea className={`w-full rounded-md border border-gray-200 px-3 py-2 ${className}`} {...props} />;
};

export default Textarea;
