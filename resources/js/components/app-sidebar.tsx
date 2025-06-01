// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { LayoutGrid, GraduationCap, BookA, BookOpenCheck, CalendarDays, ScrollText, NotebookPen, CalendarPlus } from 'lucide-react';
import AppLogo from './app-logo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: '/students',
        icon: GraduationCap,
    },
    {
        title: 'Subjects',
        href: '/subjects',
        icon: BookA,
    },
    {
        title: 'Teachers',
        href: '/teachers',
        icon: BookOpenCheck,
    },
    {
        title: 'Enrollments',
        href: '/enrollments',
        icon: ScrollText,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: CalendarDays,
    },
    {
        title: 'Attendance',
        href: '/attendance',
        icon: NotebookPen,
    },
    {
        title: 'Replacements',
        href: '/replacements',
        icon: CalendarPlus,
    },

];



export function AppSidebar() {
    const { centers, selected_center_id } = usePage().props as unknown as {
        centers: { center_id: string; center_name: string }[];
        selected_center_id: string | null;
    };

    const { data, setData } = useForm({
        center_id: selected_center_id ?? 'all',
    });
    const { state } = useSidebar();

    function handleCenterChange(value: string) {
        setData("center_id", value);
        router.post(
            route('center.set'),
            { center_id: value },      // ← 2nd argument is the “data” payload
            {
                onSuccess: () => {
                    router.reload();
                },
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {state === 'expanded' && (
                    <div className='px-2'>
                        <Select value={data.center_id} onValueChange={handleCenterChange} >
                            <SelectTrigger id="center-select" className='text-sm'>
                                <SelectValue placeholder="Select center" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Centers</SelectItem>
                                {centers.map((c) => (
                                    <SelectItem key={c.center_id} value={c.center_id}>
                                        {c.center_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
