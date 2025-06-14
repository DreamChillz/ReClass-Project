// resources/js/Pages/Subjects/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Head, Link, usePage } from "@inertiajs/react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { getFacetedOptions } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Subjects',
    href: '/subjects',
  }
];

export type Subject = {
  subject_id: number;
  subject_name: string;
  tuition_type: string;
  fees: number;
};

export const columns: ColumnDef<Subject>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "subject_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("subject_id")}</div>,
    meta: {
      label: "Subject ID",
    },
  },
  {
    accessorKey: "subject_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("subject_name")}</div>,
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
    meta: {
      label: "Subject Name",
    },
  },
  {
    accessorKey: "tuition_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tuition Type" />
    ),
    cell: ({ row }) => {
      const tt = row.getValue("tuition_type") as string;
      return (<Badge>{tt}</Badge>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
    meta: {
      label: "Tuition Type",
    },
  },
  {
    accessorKey: "fees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees" />
    ),
    cell: ({ row }) => <div>RM{row.getValue("fees")}</div>,
    meta: {
      label: "Fees",
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              // example: navigate to edit page
              window.location.href = route('subjects.edit', subject.subject_id);
            }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              // example: send a delete request
              if (confirm(`Delete subject ${subject.subject_name}?`)) {
                window.location.href = route('subjects.destroy', subject.subject_id);
              }
            }}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              window.location.href = route('subjects.show', subject.subject_id);
            }}>
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Index() {
  const { props } = usePage<{ subjects: Subject[] }>();
  const subjects = props.subjects;

  const table = useReactTable({
    data: subjects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {},
  });
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Subjects List" />
      <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
        <h6>All Subjects</h6>
        {/* data table toolbar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center space-x-2">

            {table.getColumn("subject_name") && (
              <DataTableFacetedFilter
                column={table.getColumn("subject_name")}
                title="Subject Name"
                options={getFacetedOptions(table.getColumn("subject_name"))}
              />
            )}
            {table.getColumn("tuition_type") && (
              <DataTableFacetedFilter
                column={table.getColumn("tuition_type")}
                title="Tuition Type"
                options={getFacetedOptions(table.getColumn("tuition_type"))}
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <X />
              </Button>
            )}
          </div>

          <Link href={route('subjects.create')}>
            <Button size="sm" className="ml-auto hidden h-8 lg:flex">
              <PlusCircle /> Add New Subject
            </Button>
          </Link>

          <DataTableViewOptions table={table} />
        </div>

        <div className="flex-1 rounded-md border">
          <DataTable table={table} />
        </div>

        <DataTablePagination table={table} />
      </div>
    </AppLayout>
  );
}
