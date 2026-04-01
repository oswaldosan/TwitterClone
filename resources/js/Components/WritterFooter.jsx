import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function WritterFooter() {
    return (
        <footer className="mt-auto border-t border-writter-indigo/10 bg-white/90 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
                <Link
                    href={route('timeline')}
                    className="inline-flex opacity-90 transition hover:opacity-100"
                >
                    <ApplicationLogo className="h-10 w-auto" />
                </Link>
            </div>
        </footer>
    );
}
