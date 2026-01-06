"use client";

import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

// Root Select component
export const Select = RadixSelect.Root;

// Trigger button
export const SelectTrigger: React.FC<
  React.PropsWithChildren<RadixSelect.SelectTriggerProps>
> = ({ children, className, ...props }) => (
  <RadixSelect.Trigger
    className={`flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      className || ""
    }`}
    {...props}
  >
    {children}
    <ChevronDown size={16} />
  </RadixSelect.Trigger>
);

// Value display inside trigger
export const SelectValue: React.FC<
  React.PropsWithChildren<RadixSelect.SelectValueProps>
> = ({ children, ...props }) => (
  <RadixSelect.Value {...props}>{children}</RadixSelect.Value>
);

// Content / dropdown
export const SelectContent: React.FC<
  React.PropsWithChildren<RadixSelect.SelectContentProps>
> = ({ children, className, ...props }) => (
  <RadixSelect.Content
    className={`bg-white border border-gray-300 rounded shadow-md p-1 mt-1 z-50 ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </RadixSelect.Content>
);

// Individual item
export const SelectItem: React.FC<
  React.PropsWithChildren<RadixSelect.SelectItemProps>
> = ({ children, className, ...props }) => (
  <RadixSelect.Item
    className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-blue-100 focus:bg-blue-100 ${
      className || ""
    }`}
    {...props}
  >
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    <RadixSelect.ItemIndicator>
      <Check size={16} />
    </RadixSelect.ItemIndicator>
  </RadixSelect.Item>
);

// Label
export const SelectLabel: React.FC<
  React.PropsWithChildren<RadixSelect.SelectLabelProps>
> = ({ children, className, ...props }) => (
  <RadixSelect.Label
    className={`text-gray-500 px-2 py-1 text-sm ${className || ""}`}
    {...props}
  >
    {children}
  </RadixSelect.Label>
);

// Separator
export const SelectSeparator: React.FC<
  React.PropsWithChildren<RadixSelect.SelectSeparatorProps>
> = ({ className, ...props }) => (
  <RadixSelect.Separator
    className={`h-px bg-gray-200 my-1 ${className || ""}`}
    {...props}
  />
);
