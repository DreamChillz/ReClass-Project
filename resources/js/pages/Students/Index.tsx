import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Mars, Venus, X, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Head, Link, usePage } from "@inertiajs/react"
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/react-table"
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { Input } from '@/components/ui/input';
import { getFacetedOptions } from "@/lib/utils"
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Students',
    href: '/students',
  }
];

export type Student = {
  student_id: string
  student_name: string
  gender: string
  email: string
  enrolled_date: Date
  status: "study" | "dropped"
  contact_number: string
  date_of_birth: Date
  center_id: string
  parent_name: string
}

export const columns: ColumnDef<Student>[] = [
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
    accessorKey: "student_id",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Student ID" />),
    cell: ({ row }) => (
      <div>{row.getValue("student_id")}</div>
    ),
    meta: {
      label: "Student ID"
    }
  },
  {
    accessorKey: "student_name",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Student Name" />),
    cell: ({ row }) => (
      <div>{row.getValue("student_name")}</div>
    ),
    meta: {
      label: "Student Name"
    }
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Gender" />),
    cell: ({ row }) => {
      const rawGender = row.getValue("gender");
      const gender = (typeof rawGender === "string" ? rawGender : "").toLowerCase();

      if (gender === "female") {
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Venus size={16} style={{ color: "#ff69b4", }} />
            Female
          </span>
        );
      } else if (gender === "male") {
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Mars size={16} style={{ color: "#007bff" }} />
            Male
          </span>
        );
      } else {
        return <span>{row.getValue("gender") || "Unknown"}</span>;
      }
    },
    filterFn:
      (row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId));
      },
    meta: {
      label: "Gender"
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Email" />),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    meta: {
      label: "Email"
    }
  },
  {
    accessorKey: "contact_number",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Contact Number" />),
    cell: ({ row }) => (
      <div>{row.getValue("contact_number")}</div>
    ),
    meta: {
      label: "Contact Number"
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Status" />),
    cell: ({ row }) => (
      row.getValue("status") === "study" ?
        <Badge variant="default" className='bg-[#3b4f48] rounded-xl text-[#72e128] capitalize'>{row.getValue("status")}</Badge>
        : <Badge variant="default" className='bg-[#473232] rounded-xl text-[#db181f] capitalize'>{row.getValue("status")}</Badge>
    ),
    filterFn:
      (row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId));
      },
    meta: {
      label: "Status"
    }
  },
  {
    accessorKey: "enrolled_date",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Enrolled Date" />),
    cell: ({ row }) => (
      <div>{row.getValue("enrolled_date")}</div>
    ),
    meta: {
      label: "Enrolled Date"
    }
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="DOB" />),
    cell: ({ row }) => (
      <div>{row.getValue("date_of_birth")}</div>
    ),
    meta: {
      label: "DOB"
    }
  },
  {
    accessorKey: "parent_name",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Parent Name" />),
    cell: ({ row }) => (
      <div>{row.getValue("parent_name")}</div>
    ),
    meta: {
      label: "Parent Name"
    }
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const students = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(students.student_id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]



export default function Index() {
  const { props } = usePage<{ students: Student[] }>()
  const students = props.students

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {},
  })
  const isFiltered = table.getState().columnFilters.length > 0


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Students List" />
      <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
        <h6>All Students</h6>
        {/* data table toolbar */}
        <div className="flex items-center justify-between gap-2">

          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filter student name..."
              value={(table.getColumn("student_name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("student_name")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={getFacetedOptions(table.getColumn("status"))}
              />
            )}
            {table.getColumn("gender") && (
              <DataTableFacetedFilter
                column={table.getColumn("gender")}
                title="Gender"
                options={getFacetedOptions(table.getColumn("gender"))}
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
          <Link href={route('students.create')}>
          <Button size="sm" className="ml-auto hidden h-8 lg:flex">
            <UserPlus /> Add New Student
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
  )
}
