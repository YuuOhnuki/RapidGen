import React from 'react';

type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
};

export const Select: React.FC<SelectProps> & {
  Trigger: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
  Content: React.FC<React.PropsWithChildren>;
  Item: React.FC<{ value: string; children?: React.ReactNode }>;
  Value: React.FC<{ value?: string }>;
} = ({ value, onValueChange, children }) => {
  // Render a native select for simplicity; children should be SelectItem elements
  const options: Array<{ value: string; label: string }> = [];

  React.Children.forEach(children, (child) => {
    // support either SelectItem or raw option nodes
    if (!React.isValidElement(child)) return;
    const el = child as React.ReactElement<unknown>;
    const elType = (el.type as unknown as { name?: string })?.name;
    if (elType === 'SelectItem') {
      const props = el.props as unknown;
      if (typeof props === 'object' && props !== null && 'value' in (props as object)) {
        const p = props as { value?: string; children?: React.ReactNode };
        options.push({ value: p.value ?? '', label: String(p.children) });
      }
    }
  });

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="w-full border rounded-md p-2"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

export const SelectTrigger: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => <>{children}</>;

export const SelectContent: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>;

export const SelectItem: React.FC<{ value: string; children?: React.ReactNode }> = ({ children }) => <>{children}</>;

export const SelectValue: React.FC<{ value?: string }> = ({ value }) => <span>{value}</span>;

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;
Select.Value = SelectValue;

export default Select;
