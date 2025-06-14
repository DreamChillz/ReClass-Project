// resources/js/Components/StudentActions.tsx
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

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
};

interface StudentActionsProps {
    student: Student;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function StudentActions({
    student,
    onEdit,
    onDelete,
}: StudentActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => onEdit(student.student_id)}>
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
                        Delete
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* View Details */}
                    <DropdownMenuItem>
                        View details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Only render dialog when confirmOpen is true */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50 animate-in fade-in-0" onClick={() => setConfirmOpen(false)} />

                    {/* Modal panel */}
                    <div className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-[50%] -translate-y-[50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg animate-in fade-in-0 zoom-in-95">
                        {/* Title/Description */}
                        <div className="flex flex-col gap-2 text-center sm:text-left">
                            <h2 className="text-lg font-semibold">
                                Delete {student.student_name}?
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                This action cannot be undone. This will permanently delete this
                                student.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                className="rounded border border-gray-300 text-black bg-white px-4 py-2 text-sm font-medium hover:bg-gray-200"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                onClick={() => {
                                    setConfirmOpen(false)
                                    onDelete(student.student_id)
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
