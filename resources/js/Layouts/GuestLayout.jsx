import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-writter-indigo pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo
                        onDark
                        className="h-20 w-auto sm:h-24"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-xl border border-writter-sky/30 bg-white px-6 py-6 shadow-xl shadow-black/20 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
