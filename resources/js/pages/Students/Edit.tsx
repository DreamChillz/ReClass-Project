// resources/js/Pages/Students/Edit.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { format, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Venus, Mars } from "lucide-react";
import 'react-phone-number-input/style.css'


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/students' },
    { title: 'Edit Student', href: '#' },
];

const formSchema = z.object({
    center_id: z.string().min(1),
    student_id: z.string().min(1),
    gender: z.enum(["male", "female"]),
    email: z.string().email("Invalid email"),
    contact_number: z.string(),
    date_of_birth: z.date().max(new Date(), "DOB must be in the past"),
    status: z.enum(["study", "dropped"]),
    enrolled_date: z.coerce.date(),
    student_name: z.string().min(1),
    parent_name: z.string().min(1),
});

export default function Edit() {
    // 1) Pull `centers` and `student` from the shared props
    const { props: { centers = [], student } } = usePage() as any;

    // 2) Convert ISO‐string dates into JS Date for defaultValues
    //    (Assuming `student.date_of_birth` and `student.enrolled_date` come in as "YYYY-MM-DD")
    const dobDate = student.date_of_birth
        ? parseISO(student.date_of_birth)
        : new Date();
    const enrolledDate = student.enrolled_date
        ? parseISO(student.enrolled_date)
        : new Date();

    // 3) Setup React Hook Form with Zod, defaulting to `student` values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            center_id: student.center_id || "",
            student_id: student.student_id || "",
            student_name: student.student_name || "",
            gender: student.gender || "",
            email: student.email || "",
            contact_number: student.contact_number || "",
            date_of_birth: dobDate,
            enrolled_date: enrolledDate,
            status: student.status || "study",
            parent_name: student.parent_name || "",
        },
    });

    // 4) On submit, send a PUT to students.update
    function onSubmit(values: z.infer<typeof formSchema>) {
        router.put(
            route('students.update', student.student_id),
            {
                ...values,
                date_of_birth: format(values.date_of_birth, "yyyy-MM-dd"),
                enrolled_date: format(values.enrolled_date, "yyyy-MM-dd"),
            }
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Student" />

            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <h6 className="text-center font-bold">Edit Student</h6>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 max-w-3xl mx-auto py-10"
                    >
                        {/* Row: Center & Student ID */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Center */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="center_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Center</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Center" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {centers.map((center: any) => (
                                                        <SelectItem
                                                            key={center.center_id}
                                                            value={center.center_id}
                                                        >
                                                            {center.center_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Student ID */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="student_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="K30030936"
                                                    type="text"
                                                    disabled
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Row: Student Name & Gender */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Student Name */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="student_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Student Name"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Gender */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="male">
                                                        <Mars size={16} style={{ color: "#007bff" }} />
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        <Venus size={16} style={{ color: "#ff69b4" }} />
                                                        Female
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Row: Email & Contact Number */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Email */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="abc@gmail.com"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Contact Number */}
                            {/* …inside your form’s JSX… */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="contact_number"
                                    render={({ field }) => {
                                        // ─── 1) Map stored digits → E.164 for display ─────────
                                        const e164 = (() => {
                                            const raw = field.value ?? ''
                                            const digs = raw.replace(/\D/g, '')
                                            if (!digs) return ''
                                            if (digs.startsWith('0')) {
                                                // local “0XXX” → “+60XXX”
                                                return '+60' + digs.slice(1)
                                            }
                                            if (raw.startsWith('+')) {
                                                // already E.164
                                                return raw
                                            }
                                            // assume “countryCode+subscriber”
                                            return '+' + digs
                                        })()

                                        return (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel>Contact Number</FormLabel>
                                                <FormControl className="w-full">
                                                    <PhoneInput
                                                        defaultCountry="MY"
                                                        international
                                                        countryCallingCodeEditable={false}

                                                        // ─── 2) feed it a valid +E.164 value so it knows which flag to show
                                                        value={e164}

                                                        // ─── 3) onChange returns +E.164 → strip to digits-only for your form
                                                        onChange={(e164Val) => {
                                                            if (!e164Val) {
                                                                field.onChange('')
                                                                return
                                                            }
                                                            const onlyDigits = e164Val.replace(/\D/g, '')
                                                            field.onChange(onlyDigits)
                                                        }}

                                                        // ─── 4) wire up RHF’s blur and name
                                                        onBlur={field.onBlur}
                                                        name={field.name}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        {/* Row: Date of Birth & Enrolled Date */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Date of Birth */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="date_of_birth"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? format(field.value, "dd/MM/yyyy")
                                                                : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        captionLayout="dropdown-buttons"
                                                        fromYear={new Date().getFullYear() - 100}
                                                        toYear={new Date().getFullYear()}
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Enrolled Date */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="enrolled_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Enrolled Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? format(field.value, "dd/MM/yyyy")
                                                                : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        fromYear={new Date().getFullYear() - 100}
                                                        toYear={new Date().getFullYear()}
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Row: Status & Parent Name */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Status */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="study">Study</SelectItem>
                                                    <SelectItem value="dropped">Dropped</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Parent Name */}
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="parent_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Parent Name"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="grid-cols-12 text-center">
                            <Button type="submit" className="px-20 cursor-pointer">
                                Update
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
