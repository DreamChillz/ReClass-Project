import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';


export default function Index() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <DataTable columns={columns} data={data} />                
            </div>
        </AppLayout>
    );
}
