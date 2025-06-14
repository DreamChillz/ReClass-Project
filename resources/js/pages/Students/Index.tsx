/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useMemo, useState } from 'react';

import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Mars, Pickaxe, UserPlus, Venus, X } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// UI components
import { Student, StudentActions } from '@/components/actions/StudentActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getFacetedOptions } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
];

export default function Index() {
    const { props } = usePage<{ students: Student[] }>();
    const students = props.students;

    // Handlers for editing and deleting a student
    const handleEdit = (id: string) => {
        router.visit(route('students.edit', id));
    };
    const handleDelete = (id: string) => {
        router.delete(route('students.destroy', id));
    };

    const columns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                id: 'actions',
                header: () => <span>Actions</span>,
                cell: ({ row }) => {
                    const student = row.original;
                    return (
                        <div className="flex justify-center">
                            <StudentActions student={student} onEdit={handleEdit} onDelete={handleDelete} />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'student_id',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Student ID" />,
                cell: ({ row }) => <div>{row.getValue('student_id')}</div>,
                meta: {
                    label: 'Student ID',
                },
            },
            {
                accessorKey: 'student_name',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Student Name" />,
                cell: ({ row }) => <div>{row.getValue('student_name')}</div>,
                meta: {
                    label: 'Student Name',
                },
            },
            {
                accessorKey: 'gender',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
                cell: ({ row }) => {
                    const rawGender = row.getValue('gender');
                    const gender = (typeof rawGender === 'string' ? rawGender : '').toLowerCase();

                    if (gender === 'female') {
                        return (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Venus size={16} style={{ color: '#ff69b4' }} />
                                Female
                            </span>
                        );
                    } else if (gender === 'male') {
                        return (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mars size={16} style={{ color: '#007bff' }} />
                                Male
                            </span>
                        );
                    } else {
                        return <span>{row.getValue('gender') || 'Unknown'}</span>;
                    }
                },
                filterFn: (row, columnId, filterValue) => {
                    return filterValue.includes(row.getValue(columnId));
                },
                meta: {
                    label: 'Gender',
                },
            },
            {
                accessorKey: 'email',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
                cell: ({ row }) => <div>{row.getValue('email')}</div>,
                meta: {
                    label: 'Email',
                },
            },
            {
                accessorKey: 'contact_number',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Contact Number" />,
                cell: ({ row }) => <div>{row.getValue('contact_number')}</div>,
                meta: {
                    label: 'Contact Number',
                },
            },
            {
                accessorKey: 'status',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
                cell: ({ row }) =>
                    row.getValue('status') === 'study' ? (
                        <Badge variant="default" className="bg-green-600 text-white capitalize">
                            {row.getValue('status')}
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="capitalize">
                            {row.getValue('status')}
                        </Badge>
                    ),
                filterFn: (row, columnId, filterValue) => {
                    return filterValue.includes(row.getValue(columnId));
                },
                meta: {
                    label: 'Status',
                },
            },
            {
                accessorKey: 'enrolled_date',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Enrolled Date" />,
                cell: ({ row }) => <div>{format(row.getValue('enrolled_date'), 'yyyy-MM-dd')}</div>,
                meta: {
                    label: 'Enrolled Date',
                },
            },
            {
                accessorKey: 'date_of_birth',
                header: ({ column }) => <DataTableColumnHeader column={column} title="DOB" />,
                cell: ({ row }) => <div>{format(row.getValue('date_of_birth'), 'yyyy-MM-dd')}</div>,
                meta: {
                    label: 'DOB',
                },
            },
            {
                accessorKey: 'parent_name',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Parent Name" />,
                cell: ({ row }) => <div>{row.getValue('parent_name')}</div>,
                meta: {
                    label: 'Parent Name',
                },
            },
        ],
        [],
    );

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });
    const isFiltered = table.getState().columnFilters.length > 0;

    //set status as study by default
    useEffect(() => {
        table.getColumn('status')?.setFilterValue(['study']);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [opendropdown, setOpenDropdown] = useState(false);
    const closeDropdown = (v) => setOpenDropdown(v);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students List" />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <DropdownMenu
                        modal={false}
                        open={opendropdown}
                        onOpenChange={(v) => {
                            closeDropdown(v);
                        }}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Pickaxe />
                                Actions
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start">
                            {/* import student dialog */}
                            <Dialog onOpenChange={closeDropdown}>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        Import Students
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-center">Import New Students</DialogTitle>
                                        <DialogDescription>Download the template, then upload your filled-in CSV.</DialogDescription>
                                    </DialogHeader>

                                    <div className="flex flex-col gap-4 py-4">
                                        {/* 1️⃣ Download template */}
                                        <Label>1. Download the template to ensure correct field</Label>
                                        <Button variant="secondary" asChild>
                                            <a href="/assets/student-template.csv" download>
                                                Download CSV Template
                                            </a>
                                        </Button>

                                        <Separator />

                                        <Label htmlFor="importFile">2. Upload CSV File</Label>
                                        <Input id="importFile" type="file" accept=".csv" className="file-input cursor-pointer" />
                                        <p className="text-destructive text-sm">Allow file types: .csv</p>
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button>Upload</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href={route('students.create')}>
                        <Button size="sm" className="ml-auto hidden h-8 lg:flex">
                            <UserPlus /> Add New Student
                        </Button>
                    </Link>
                </div>

                <h6>All Students</h6>

                {/* data table toolbar */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder="Filter student name..."
                            value={(table.getColumn('student_name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('student_name')?.setFilterValue(event.target.value)}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                        {table.getColumn('status') && (
                            <DataTableFacetedFilter
                                column={table.getColumn('status')}
                                title="Status"
                                options={getFacetedOptions(table.getColumn('status'))}
                            />
                        )}
                        {table.getColumn('gender') && (
                            <DataTableFacetedFilter
                                column={table.getColumn('gender')}
                                title="Gender"
                                options={getFacetedOptions(table.getColumn('gender'))}
                            />
                        )}
                        {isFiltered && (
                            <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                                Reset
                                <X />
                            </Button>
                        )}
                    </div>
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
