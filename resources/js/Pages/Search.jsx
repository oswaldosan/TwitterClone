import UserAvatar from '@/Components/Social/UserAvatar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Search({ q, users }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-display text-xl font-semibold text-writter-indigo">
                    Search
                </h2>
            }
        >
            <Head title="Search" />
            <div className="mx-auto max-w-2xl px-4 py-6">
                <form
                    method="get"
                    action={route('search')}
                    className="flex gap-2"
                >
                    <input
                        type="search"
                        name="q"
                        defaultValue={q}
                        placeholder="Search by name or username"
                        className="flex-1 rounded-lg border border-writter-sky/40 px-4 py-2"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-writter-cyan px-4 py-2 text-sm font-semibold text-white"
                    >
                        Search
                    </button>
                </form>
                <ul className="mt-6 space-y-3">
                    {users.length === 0 && q && (
                        <li className="text-gray-500">No users found.</li>
                    )}
                    {users.map((u) => (
                        <li
                            key={u.id}
                            className="flex items-center justify-between rounded-lg border border-writter-sky/30 bg-white p-4"
                        >
                            <Link
                                href={route('users.show', u.username)}
                                className="flex min-w-0 flex-1 items-center gap-3"
                            >
                                <UserAvatar user={u} />
                                <div className="min-w-0">
                                    <div className="font-semibold text-writter-indigo">
                                        {u.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        @{u.username}
                                    </div>
                                    {u.bio && (
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                            {u.bio}
                                        </p>
                                    )}
                                </div>
                            </Link>
                            {auth.user?.username !== u.username && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            route('users.follow', u.username),
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                    className={
                                        u.is_following
                                            ? 'shrink-0 rounded-full border px-3 py-1 text-sm'
                                            : 'shrink-0 rounded-full bg-writter-cyan px-3 py-1 text-sm text-white'
                                    }
                                >
                                    {u.is_following ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
