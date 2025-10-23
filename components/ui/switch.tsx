import React from 'react';

type SwitchProps = {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  className?: string;
};

export const Switch: React.FC<SwitchProps> = ({ id, checked = false, onCheckedChange, className = '' }) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`h-5 w-10 rounded-full bg-gray-200 accent-primary ${className}`}
    />
  );
};

export default Switch;
