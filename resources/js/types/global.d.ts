/* eslint-disable @typescript-eslint/no-unused-vars */
import type { route as routeFn } from 'ziggy-js';
import "@tanstack/react-table";

declare global {
    const route: typeof routeFn;
}

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData> {
      label?: string;
    }
  }
