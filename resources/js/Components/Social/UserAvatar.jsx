import { Link } from '@inertiajs/react';

export default function UserAvatar({ user, size = 'md', href }) {
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
    };
    const ring = sizes[size] || sizes.md;
    const initial = (user?.name || user?.username || '?').slice(0, 1).toUpperCase();

    const inner = (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-full bg-writter-cyan font-semibold text-white shadow-md ring-2 ring-white/90 ${ring}`}
        >
            {user?.avatar_url ? (
                <img
                    src={user.avatar_url}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                />
            ) : (
                initial
            )}
        </span>
    );

    if (href) {
        return (
            <Link href={href} className="shrink-0">
                {inner}
            </Link>
        );
    }

    return inner;
}
