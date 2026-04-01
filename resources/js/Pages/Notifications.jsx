import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function label(n) {
    const actor = n.actor?.username || 'Someone';
    if (n.type === 'new_follow') {
        return (
            <>
                <span className="font-semibold">@{actor}</span> followed you
            </>
        );
    }
    if (n.type === 'post_liked') {
        return (
            <>
                <span className="font-semibold">@{actor}</span> liked your post
            </>
        );
    }
    if (n.type === 'post_replied') {
        return (
            <>
                <span className="font-semibold">@{actor}</span> replied to your
                post
            </>
        );
    }
    return n.type;
}

export default function Notifications({ notifications }) {
    const markAll = () => {
        router.post(route('notifications.readAll'), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-display text-xl font-semibold text-writter-indigo">
                        Notifications
                    </h2>
                    <button
                        type="button"
                        onClick={markAll}
                        className="text-sm text-writter-cyan hover:underline"
                    >
                        Mark all read
                    </button>
                </div>
            }
        >
            <Head title="Notifications" />
            <div className="mx-auto max-w-2xl px-4 py-4">
                <ul className="divide-y divide-writter-sky/30 rounded-lg border border-writter-sky/30 bg-white">
                    {notifications.data.length === 0 && (
                        <li className="p-8 text-center text-gray-500">
                            No notifications yet.
                        </li>
                    )}
                    {notifications.data.map((n) => (
                        <li
                            key={n.id}
                            className={
                                n.read_at
                                    ? 'px-4 py-3'
                                    : 'bg-writter-sky/10 px-4 py-3'
                            }
                        >
                            <p className="text-writter-indigo">{label(n)}</p>
                            {n.data?.post_id && (
                                <Link
                                    href={route('posts.show', n.data.post_id)}
                                    className="mt-1 inline-block text-sm text-writter-cyan hover:underline"
                                >
                                    View post
                                </Link>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                {new Date(n.created_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
