import UserAvatar from '@/Components/Social/UserAvatar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function UserList({ title, user, members }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-display text-xl font-semibold text-writter-indigo">
                    {title}
                </h2>
            }
        >
            <Head title={title} />
            <div className="mx-auto max-w-2xl px-4 py-6">
                <p className="mb-4 text-gray-600">
                    <Link
                        href={route('users.show', user.username)}
                        className="font-semibold text-writter-cyan hover:underline"
                    >
                        @{user.username}
                    </Link>
                </p>
                <ul className="space-y-2">
                    {members.data.map((m) => (
                        <li
                            key={m.id}
                            className="flex items-center justify-between rounded-lg border border-writter-sky/30 bg-white p-3"
                        >
                            <Link
                                href={route('users.show', m.username)}
                                className="flex items-center gap-3"
                            >
                                <UserAvatar user={m} />
                                <div>
                                    <div className="font-medium">{m.name}</div>
                                    <div className="text-sm text-gray-500">
                                        @{m.username}
                                    </div>
                                </div>
                            </Link>
                            {auth.user?.username !== m.username && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            route('users.follow', m.username),
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                    className={
                                        m.is_following
                                            ? 'rounded-full border px-3 py-1 text-sm'
                                            : 'rounded-full bg-writter-cyan px-3 py-1 text-sm text-white'
                                    }
                                >
                                    {m.is_following ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                {members.next_page_url && (
                    <div className="mt-6 flex justify-center">
                        <Link
                            href={members.next_page_url}
                            preserveScroll
                            className="text-writter-cyan"
                        >
                            Load more
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
