/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
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
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { getFacetedOptions } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTableRowActions } from './data-table-row-actions';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subjects',
        href: '/subjects',
    },
];

export type Subject = {
    subject_id: number;
    subject_name: string;
    tuition_type: string;
    fees: number;
};

const subjectSchema = z.object({
    subject_name: z.string().min(1, 'Subject name is required'),
    tuition_type: z.string().min(1, 'Tuition type is required'),
    fees: z.coerce.number().min(0, 'Fees must be a non-negative number'),
});

export default function Index() {
    const { props } = usePage<{ subjects: Subject[] }>();
    const [subjectsList, setSubjectsList] = useState<Subject[]>(props.subjects);
    useEffect(() => {
        setSubjectsList(props.subjects);
    }, [props.subjects]);

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
                cell: ({ row }) => (
                    <DataTableRowActions
                        row={row}
                        onUpdated={(updated) => {
                            setSubjectsList((list) => list.map((s) => (s.subject_id === updated.subject_id ? updated : s)));
                        }}
                        onDeleted={(id) => {
                            setSubjectsList((list) => list.filter((s) => s.subject_id !== id));
                        }}
                    />
                ),
            },
            {
                accessorKey: 'subject_name',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Subject Name" />,
                cell: ({ row }) => <div>{row.getValue('subject_name')}</div>,
                filterFn: (row, columnId, filterValue) => filterValue.includes(row.getValue(columnId)),
                meta: { label: 'Subject Name' },
            },
            {
                accessorKey: 'tuition_type',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Tuition Type" />,
                cell: ({ row }) => <Badge className="capitalize">{row.getValue('tuition_type')}</Badge>,
                filterFn: (row, columnId, filterValue) => filterValue.includes(row.getValue(columnId)),
                meta: { label: 'Tuition Type' },
            },
            {
                accessorKey: 'fees',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Fees (RM)" />,
                cell: ({ row }) => <div>RM{row.getValue('fees')}</div>,
                meta: { label: 'Fees' },
            },
        ],
        [],
    );

    const table = useReactTable({
        data: subjectsList,
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

    // Dialog state & form
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const addSubjectForm = useForm<z.infer<typeof subjectSchema>>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            subject_name: '',
            tuition_type: '',
            fees: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
        try {
            const { data } = await axios.post('/subjects', values);
            // assuming your controller returns { subject: { … } }
            setSubjectsList((prev) => [data.subject, ...prev]);
            toast.success('Subject added successfully!');
            setIsAddDialogOpen(false);
            addSubjectForm.reset();
        } catch {
            toast.error('Failed to add subject.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subjects List" />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-end gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="ml-auto h-8 lg:flex">
                                <PlusCircle /> Add New Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Subject</DialogTitle>
                                <DialogDescription>Fill out the form to add a new subject.</DialogDescription>
                            </DialogHeader>

                            <Form {...addSubjectForm}>
                                <form onSubmit={addSubjectForm.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={addSubjectForm.control}
                                        name="subject_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="EL Math" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={addSubjectForm.control}
                                        name="tuition_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tuition Type</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="A01 (LL1W) Standard Fee" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={addSubjectForm.control}
                                        name="fees"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fees (RM)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="100.00" min="0" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Submit</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <h6>All Subjects</h6>
                {/* data table toolbar */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-1 items-center space-x-2">
                        {table.getColumn('subject_name') && (
                            <DataTableFacetedFilter
                                column={table.getColumn('subject_name')}
                                title="Subject Name"
                                options={getFacetedOptions(table.getColumn('subject_name'))}
                            />
                        )}
                        {table.getColumn('tuition_type') && (
                            <DataTableFacetedFilter
                                column={table.getColumn('tuition_type')}
                                title="Tuition Type"
                                options={getFacetedOptions(table.getColumn('tuition_type'))}
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
