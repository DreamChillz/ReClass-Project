/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from "@inertiajs/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input";
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Venus, Mars } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
    {
        title: 'Add New Student',
        href: '/students/create'
    }
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
    parent_name: z.string().min(1)
});

export default function Create() {

    const { props: { centers = [] } } = usePage() as any;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "student_id": "",
            "student_name": "",
            "gender": "",
            "email": "",
            "contact_number": "",
            "date_of_birth": new Date(),
            "enrolled_date": new Date(),
            "status": "study",
            "parent_name": "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route('students.store'), {
            ...values,
            date_of_birth: format(values.date_of_birth, "yyyy-MM-dd"),
            enrolled_date: format(values.enrolled_date, "yyyy-MM-dd"),
        },)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Student" />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <h6 className='text-center font-bold'>Add New Student</h6>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField control={form.control} name="center_id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Center</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Center" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {centers.map(center => (
                                                    <SelectItem key={center.center_id} value={center.center_id}>{center.center_name}</SelectItem>
                                                ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control} name="student_id" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student ID</FormLabel>
                                            <FormControl><Input placeholder="K30030936" type="text" {...field} /></FormControl>
                                        </FormItem>)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField control={form.control} name="student_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Student Name" type="text"{...field} />
                                        </FormControl>
                                    </FormItem>)}
                                />
                            </div>
                            <div className="col-span-6">
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male"><Mars size={16} style={{ color: "#007bff" }} />Male</SelectItem>
                                                <SelectItem value="female"><Venus size={16} style={{ color: "#ff69b4", }} />Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>)} />
                            </div>



                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input placeholder="abc@gmail.com" type="email" {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-6">
                                <FormField control={form.control} name="contact_number" render={({ field }) => (
                                    <FormItem className="flex flex-col items-start">
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl className="w-full">
                                            <PhoneInput placeholder="Contact Number" {...field} defaultCountry="MY" international
                                                countryCallingCodeEditable={false}
                                                value={field.value ? "+" + field.value.replace(/\D/g, "") : ""}

                                                onChange={(e164Value) => {
                                                    if (!e164Value) {
                                                        field.onChange("");
                                                        return;
                                                    }
                                                    const digitsOnly = e164Value.replace(/\D/g, "");

                                                    let international = digitsOnly;
                                                    if (digitsOnly.startsWith("0")) {
                                                        international = "6" + digitsOnly;
                                                    }
                                                    field.onChange(international);
                                                }} />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>


                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control} name="date_of_birth" render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                        >
                                                            {field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Pick a date</span>)}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar captionLayout="dropdown-buttons"
                                                        fromYear={new Date().getFullYear() - 100}
                                                        toYear={new Date().getFullYear()}
                                                        mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField control={form.control} name="enrolled_date" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Enrolled Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Pick a date</span>)}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" captionLayout="dropdown-buttons"
                                                    fromYear={new Date().getFullYear() - 100}
                                                    toYear={new Date().getFullYear()} selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>)} />
                            </div>

                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="study" >Study</SelectItem>
                                                <SelectItem value="dropped">Dropped</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField control={form.control} name="parent_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Parent Name" type="text"{...field} />
                                        </FormControl>
                                    </FormItem>)}
                                />
                            </div>
                        </div>
                        <div className="grid-cols-12 text-center">
                            <Button type="submit" className="px-20 cursor-pointer">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    )
}
