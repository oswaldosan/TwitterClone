import PostCard from '@/Components/Social/PostCard';
import PostComposer from '@/Components/Social/PostComposer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, InfiniteScroll, router } from '@inertiajs/react';

export default function Timeline({ posts }) {
    const refresh = () => {
        router.reload({ only: ['posts'] });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-writter-indigo">
                            Home
                        </h2>
                        <p className="mt-1 max-w-md text-sm leading-relaxed text-writter-indigo/50">
                            Posts from people you follow and your own writing.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={refresh}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-writter-indigo/12 bg-white px-5 py-2 text-sm font-semibold text-writter-indigo shadow-sm transition hover:border-writter-cyan/35 hover:text-writter-cyan"
                    >
                        Refresh
                    </button>
                </div>
            }
        >
            <Head title="Timeline" />

            <div className="relative mx-auto max-w-2xl px-3 pb-24 pt-2 sm:px-5">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-writter-cyan/[0.09] blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 bottom-32 h-56 w-56 rounded-full bg-writter-gold/[0.14] blur-3xl"
                />

                <section className="relative rounded-[1.75rem] border border-writter-indigo/[0.09] bg-white/95 shadow-[0_16px_56px_-28px_rgba(45,48,71,0.22)] ring-1 ring-writter-indigo/[0.04]">
                    <div className="overflow-hidden rounded-t-[1.75rem] border-b border-writter-indigo/[0.07] bg-gradient-to-r from-writter-gold/[0.14] via-white to-writter-sky/25 px-5 py-4 sm:px-8 sm:py-5">
                        <p className="font-display text-lg font-semibold text-writter-indigo">
                            Compose
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-writter-indigo/40">
                            Share with your network
                        </p>
                    </div>
                    <PostComposer />
                </section>

                <div className="relative mt-10">
                    <div className="mb-5 flex items-center gap-4 px-1">
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-writter-indigo/20 to-transparent" />
                        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-writter-indigo/38">
                            Feed
                        </span>
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-writter-indigo/20 to-transparent" />
                    </div>

                    <div
                        className="rounded-[1.75rem] border border-writter-indigo/[0.07] p-3 sm:p-4"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, rgba(45,48,71,0.05) 1px, transparent 0)',
                            backgroundSize: '22px 22px',
                            backgroundColor: 'rgba(147, 183, 190, 0.12)',
                        }}
                    >
                        <InfiniteScroll
                            data="posts"
                            buffer={400}
                            as="div"
                            className="space-y-4"
                            next={(nextProps) => {
                                if (nextProps.loadingNext) {
                                    return (
                                        <div className="rounded-2xl border border-writter-indigo/[0.06] bg-white/80 px-4 py-6 text-center text-sm text-writter-indigo/50 shadow-sm backdrop-blur-sm">
                                            Loading more…
                                        </div>
                                    );
                                }
                                if (
                                    !nextProps.hasNext &&
                                    posts.data.length > 0
                                ) {
                                    return (
                                        <div className="rounded-2xl border border-dashed border-writter-indigo/15 bg-white/60 px-4 py-10 text-center backdrop-blur-sm">
                                            <p className="font-display text-sm tracking-wide text-writter-indigo/45">
                                                This is the end
                                            </p>
                                            <p className="mt-1 text-xs text-writter-indigo/35">
                                                You&apos;re all caught up.
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        >
                            {posts.data.length === 0 ? (
                                <div className="rounded-2xl border border-writter-indigo/[0.08] bg-white/90 px-8 py-16 text-center shadow-sm">
                                    <p className="font-display text-lg text-writter-indigo/85">
                                        Your timeline is quiet
                                    </p>
                                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-writter-indigo/45">
                                        Follow people or publish the first post
                                        using the composer above.
                                    </p>
                                </div>
                            ) : (
                                posts.data.map((post, i) => (
                                    <div
                                        key={post.id}
                                        className={`animate-fade-up-${Math.min(i + 1, 5)}`}
                                    >
                                        <PostCard post={post} />
                                    </div>
                                ))
                            )}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
