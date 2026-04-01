import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

const motionEnter =
    'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Writter" />
            <div className="relative min-h-screen overflow-hidden bg-writter-indigo text-writter-sky">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(4,138,129,0.28),transparent_55%)]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_80%,rgba(224,202,60,0.07),transparent_45%)]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(147,183,190,0.55)_1px,transparent_1px)] [background-size:22px_22px]"
                    aria-hidden
                />

                <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-12">
                    <div className="flex w-full max-w-lg flex-col items-center text-center">
                        <div
                            className={`animate-fade-up ${motionEnter}`}
                        >
                            <ApplicationLogo
                                onDark
                                className="h-28 w-auto sm:h-32"
                            />
                        </div>

                        <div
                            className={`mt-8 h-px w-16 bg-gradient-to-r from-transparent via-writter-gold/80 to-transparent sm:mt-10 ${motionEnter} animate-fade-up-1`}
                            aria-hidden
                        />

                        <h1
                            className={`font-display mt-8 max-w-[18ch] text-balance text-4xl font-semibold tracking-tight text-white sm:mt-10 sm:text-5xl ${motionEnter} animate-fade-up-2`}
                        >
                            Short posts.{' '}
                            <span className="text-writter-sky/95">Lasting echoes.</span>
                        </h1>

                        <p
                            className={`mt-5 max-w-md text-pretty text-base leading-relaxed text-writter-sky sm:text-lg ${motionEnter} animate-fade-up-3`}
                        >
                            Writter is a lightweight social network: post, follow,
                            and discover conversations without the noise of an
                            endless timeline.
                        </p>

                        <div
                            className={`mt-12 flex w-full flex-col items-stretch gap-3 sm:mt-14 sm:flex-row sm:justify-center sm:gap-4 ${motionEnter} animate-fade-up-4`}
                        >
                            {auth.user ? (
                                <Link
                                    href={route('timeline')}
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-writter-gold px-8 py-3 text-sm font-semibold text-writter-indigo shadow-lg shadow-black/20 transition hover:bg-writter-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-writter-gold active:scale-[0.98]"
                                >
                                    Go to home
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-writter-gold px-8 py-3 text-sm font-semibold text-writter-indigo shadow-lg shadow-black/25 transition hover:bg-writter-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-writter-gold active:scale-[0.98]"
                                    >
                                        Create account
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-writter-cyan/90 bg-transparent px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-writter-sky hover:bg-writter-cyan/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-writter-cyan active:scale-[0.98]"
                                    >
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <footer
                        className={`absolute bottom-8 left-0 right-0 text-center ${motionEnter} animate-fade-up-5`}
                    >
                        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-writter-sky/50">
                            Laravel {laravelVersion} · PHP {phpVersion}
                        </p>
                    </footer>
                </main>
            </div>
        </>
    );
}
