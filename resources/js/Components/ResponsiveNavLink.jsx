import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-writter-gold bg-white/10 text-white focus:border-writter-gold focus:bg-white/15 focus:text-white'
                    : 'border-transparent text-writter-sky hover:border-writter-sky/50 hover:bg-white/5 hover:text-white focus:border-writter-sky/40 focus:bg-white/5 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
