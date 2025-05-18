import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, LayoutGrid, GraduationCap, BookA, BookOpenCheck, CalendarDays, ScrollText, NotebookPen, CalendarPlus } from 'lucide-react';
import AppLogo from './app-logo';

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

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
