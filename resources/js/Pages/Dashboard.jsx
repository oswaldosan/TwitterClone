import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-writter-indigo">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden border border-writter-sky/30 bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-writter-indigo">
                            {"You're signed in. Your feed will appear here soon."}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
