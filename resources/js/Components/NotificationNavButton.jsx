import { Link } from '@inertiajs/react';

export default function NotificationNavButton({ unreadCount, className = '' }) {
    return (
        <Link
            href={route('notifications.index')}
            className={`relative rounded-full p-2 text-writter-sky hover:bg-white/10 hover:text-white ${className}`}
            aria-label="Notifications"
        >
            <span className="sr-only">Notifications</span>
            <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9c0-5.591-3.824-10.417-9-11.874-5.176 1.457-9 6.283-9 11.874 0 1.31.28 2.55.777 3.678m6.59-12.54a8.967 8.967 0 012.45 4.776m0 0a23.91 23.91 0 014.55 4.776m-4.55-4.776v-.001zm0 0A8.968 8.968 0 0112 21c-2.296 0-4.39-.864-5.976-2.284"
                />
            </svg>
            {unreadCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-writter-gold px-1 text-[10px] font-bold text-writter-indigo">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Link>
    );
}
