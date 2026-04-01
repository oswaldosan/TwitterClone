import PostCard from '@/Components/Social/PostCard';
import UserAvatar from '@/Components/Social/UserAvatar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function UserProfile({
    profileUser,
    posts,
    isFollowing,
    followersCount,
    followingCount,
}) {
    const { auth } = usePage().props;
    const isOwn = auth.user?.username === profileUser.username;

    const toggleFollow = () => {
        router.post(
            route('users.follow', profileUser.username),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-display text-xl font-semibold text-writter-indigo">
                    Profile
                </h2>
            }
        >
            <Head title={`@${profileUser.username}`} />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
                <div className="rounded-xl border border-writter-sky/30 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                            <UserAvatar user={profileUser} size="lg" />
                            <div>
                                <h1 className="font-display text-2xl font-semibold text-writter-indigo">
                                    {profileUser.name}
                                </h1>
                                <p className="text-gray-500">@{profileUser.username}</p>
                                {profileUser.bio && (
                                    <p className="mt-2 text-writter-indigo">{profileUser.bio}</p>
                                )}
                                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                    <Link
                                        href={route(
                                            'users.following',
                                            profileUser.username,
                                        )}
                                        className="hover:underline"
                                    >
                                        <strong>{followingCount}</strong>{' '}
                                        <span className="text-gray-600">Following</span>
                                    </Link>
                                    <Link
                                        href={route(
                                            'users.followers',
                                            profileUser.username,
                                        )}
                                        className="hover:underline"
                                    >
                                        <strong>{followersCount}</strong>{' '}
                                        <span className="text-gray-600">Followers</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {!isOwn && (
                        <div className="shrink-0">
                            <button
                                type="button"
                                onClick={toggleFollow}
                                className={
                                    isFollowing
                                        ? 'rounded-full border border-writter-indigo px-5 py-2 text-sm font-semibold text-writter-indigo'
                                        : 'rounded-full bg-writter-cyan px-5 py-2 text-sm font-semibold text-white'
                                }
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                <h2 className="mt-8 font-display text-lg font-semibold text-writter-indigo">
                    Posts
                </h2>
                <div className="mt-2 overflow-hidden rounded-lg border border-writter-sky/30 bg-white">
                    {posts.data.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">No posts yet.</p>
                    ) : (
                        posts.data.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
                {posts.next_page_url && (
                    <div className="mt-6 flex justify-center">
                        <Link
                            href={posts.next_page_url}
                            preserveScroll
                            className="rounded-full border border-writter-cyan px-6 py-2 text-sm text-writter-cyan"
                        >
                            Load more
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
