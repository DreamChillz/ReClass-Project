import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Column } from "@tanstack/react-table"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFacetedOptions<TData, TValue>(
    column: Column<TData, TValue> | undefined
  ): { label: string; value: string }[] {
    if (!column) return []
  
    return Array.from(column.getFacetedUniqueValues().entries())
    .filter(([value]) => value !== null)
    .map(([value]) => {
      const val = String(value).trim();
      return {
        label: val.charAt(0).toUpperCase() + val.slice(1), // e.g. "male" → "Male"
        value: val, // must match what's in the data
      };
    });
  }
