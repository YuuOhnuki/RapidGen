import React from 'react';

type SliderProps = {
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange: (v: number[]) => void;
  className?: string;
};

export const Slider: React.FC<SliderProps> = ({ id, min = 0, max = 100, step = 1, value, onValueChange, className = '' }) => {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={`w-full ${className}`}
    />
  );
};

export default Slider;
