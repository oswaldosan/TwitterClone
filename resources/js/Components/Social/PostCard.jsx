import PostBody from '@/Components/Social/PostBody';
import UserAvatar from '@/Components/Social/UserAvatar';
import { Link, router, usePage } from '@inertiajs/react';

function formatPostTime(iso) {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(iso));
    } catch {
        return new Date(iso).toLocaleString();
    }
}

export default function PostCard({ post, showReply = true }) {
    const { auth } = usePage().props;
    const me = auth.user;

    const profileHref = route('users.show', post.user.username);
    const postHref = route('posts.show', post.id);

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(
            route('posts.like', post.id),
            {},
            { preserveScroll: true },
        );
    };

    const remove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this post?')) return;
        router.delete(route('posts.destroy', post.id), { preserveScroll: true });
    };

    return (
        <article
            className="group relative overflow-hidden rounded-2xl border border-writter-indigo/[0.07] bg-white/90 px-5 py-5 shadow-[0_2px_16px_-6px_rgba(45,48,71,0.12)] ring-1 ring-writter-indigo/[0.04] transition-[box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-[0_8px_28px_-8px_rgba(45,48,71,0.18)] sm:px-6 sm:py-6"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-writter-gold/90 via-writter-cyan/50 to-writter-sky/40 opacity-80"
            />
            <div className="flex gap-4 ps-1">
                <div className="shrink-0 pt-0.5">
                    <UserAvatar user={post.user} href={profileHref} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                        <Link
                            href={profileHref}
                            className="truncate text-[15px] font-semibold tracking-tight text-writter-indigo hover:underline"
                        >
                            {post.user.name}
                        </Link>
                        <span className="text-sm text-writter-indigo/50">
                            @{post.user.username}
                        </span>
                        <span className="hidden text-writter-indigo/30 sm:inline">
                            ·
                        </span>
                        <Link
                            href={postHref}
                            className="text-xs font-medium text-writter-indigo/45 hover:text-writter-cyan sm:text-sm"
                        >
                            <time dateTime={post.created_at}>
                                {formatPostTime(post.created_at)}
                            </time>
                        </Link>
                    </div>
                    <div className="mt-3">
                        <PostBody html={post.body} />
                    </div>
                    {post.sticker_url && (
                        <div className="mt-4 inline-block max-w-full rounded-xl border border-writter-indigo/10 bg-writter-sky/10 p-2">
                            <img
                                src={post.sticker_url}
                                alt=""
                                className="max-h-52 max-w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    )}
                    {post.image_url && (
                        <Link
                            href={postHref}
                            className="mt-4 block overflow-hidden rounded-xl border border-writter-indigo/10 shadow-sm ring-1 ring-black/[0.04]"
                        >
                            <img
                                src={post.image_url}
                                alt=""
                                className="max-h-96 w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                            />
                        </Link>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-writter-indigo/[0.06] pt-4 text-sm">
                        <button
                            type="button"
                            onClick={toggleLike}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                                post.liked
                                    ? 'bg-writter-cyan/15 text-writter-cyan'
                                    : 'text-writter-indigo/65 hover:bg-writter-sky/25 hover:text-writter-cyan'
                            }`}
                        >
                            <span aria-hidden>{post.liked ? '♥' : '♡'}</span>
                            <span>{post.liked ? 'Liked' : 'Like'}</span>
                            <span className="tabular-nums text-writter-indigo/50">
                                {post.likes_count ?? 0}
                            </span>
                        </button>
                        {showReply && (
                            <Link
                                href={postHref}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-writter-indigo/65 transition hover:bg-writter-sky/25 hover:text-writter-indigo"
                            >
                                <span aria-hidden>💬</span>
                                <span className="tabular-nums">
                                    {post.replies_count ?? 0}
                                </span>
                            </Link>
                        )}
                        <Link
                            href={postHref}
                            className="rounded-full px-2 py-1.5 text-xs font-medium text-writter-cyan/90 opacity-0 transition group-hover:opacity-100 hover:underline"
                        >
                            Open thread
                        </Link>
                        {me?.id === post.user_id && (
                            <button
                                type="button"
                                onClick={remove}
                                className="ms-auto rounded-full px-2 py-1.5 text-sm text-red-600/85 hover:bg-red-50 hover:underline"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
