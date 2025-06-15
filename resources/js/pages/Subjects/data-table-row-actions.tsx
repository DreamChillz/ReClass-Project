import { zodResolver } from '@hookform/resolvers/zod';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Subject {
    subject_id: number;
    subject_name: string;
    tuition_type: string;
    fees: number;
}

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    onUpdated?: (newRec: Subject) => void;
    onDeleted?: (deletedId: number) => void;
}

const subjectSchema = z.object({
    subject_name: z.string().min(1, 'Subject name is required'),
    tuition_type: z.string().min(1, 'Tuition type is required'),
    fees: z.coerce.number().min(0, 'Fees must be a non-negative number'),
});
type SubjectForm = z.infer<typeof subjectSchema>;

export function DataTableRowActions<TData extends Subject>({ row, onUpdated, onDeleted }: DataTableRowActionsProps<TData>) {
    const record = row.original;

    const [openDropdown, setOpenDropdown] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    //edit dialog
    const editForm = useForm<SubjectForm>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            subject_name: record.subject_name,
            tuition_type: record.tuition_type,
            fees: record.fees,
        },
    });

    const handleEditOpen = () => {
        editForm.reset({
            subject_name: record.subject_name,
            tuition_type: record.tuition_type,
            fees: record.fees,
        });
        setOpenDropdown(false);
        setOpenEdit(true);
    };

    const onEdit = editForm.handleSubmit(async (values) => {
        try {
            const { data } = await axios.patch<{ subject: Subject }>(`/subjects/${record.subject_id}`, values);
            toast.success('Subject updated successfully!');
            setOpenEdit(false);
            onUpdated?.(data.subject);
        } catch {
            toast.error('Failed to update subject');
        }
    });

    //delete dialog
    const handleDeleteOpen = () => {
        setOpenDropdown(false);
        setOpenDelete(true);
    };

    const onDelete = async () => {
        try {
            await axios.delete(`/subjects/${record.subject_id}`);
            toast.success('Subject deleted successfully!');
            setOpenDelete(false);
            onDeleted?.(record.subject_id);
        } catch {
            toast.error('Failed to delete subject');
        }
    };

    return (
        <>
            <DropdownMenu modal={false} open={openDropdown} onOpenChange={setOpenDropdown}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {/* edit dialog  */}
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            handleEditOpen();
                        }}
                    >
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDeleteOpen();
                        }}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* edit dialog  */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                        <DialogDescription>Modify the fields below</DialogDescription>
                    </DialogHeader>

                    <Form {...editForm}>
                        <form onSubmit={onEdit} className="space-y-4">
                            <FormField
                                control={editForm.control}
                                name="subject_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="EL Math" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="tuition_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuition Type</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="A01 (LL1W) Standard Fee" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="fees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fees (RM)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100.00" min="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* ─── DELETE ───────────────────────────────────────── */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
                        <DialogDescription>Are you sure you want to delete “{record.subject_name}”?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={onDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
