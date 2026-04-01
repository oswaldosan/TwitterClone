import ApplicationLogo from '@/Components/ApplicationLogo';
import NotificationNavButton from '@/Components/NotificationNavButton';
import WritterFooter from '@/Components/WritterFooter';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, unreadNotificationsCount } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [searchQ, setSearchQ] = useState('');

    return (
        <div className="flex min-h-screen flex-col bg-writter-sky/15">
            <nav className="border-b border-writter-indigo/20 bg-writter-indigo">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('timeline')}>
                                    <ApplicationLogo
                                        className="h-9 w-auto"
                                        onDark
                                    />
                                </Link>
                            </div>

                            <form
                                method="get"
                                action={route('search')}
                                className="hidden max-w-xs flex-1 md:block"
                            >
                                <input
                                    type="search"
                                    name="q"
                                    value={searchQ}
                                    onChange={(e) => setSearchQ(e.target.value)}
                                    placeholder="Search users"
                                    className="w-full rounded-full border border-writter-sky/40 bg-writter-indigo/50 px-4 py-1.5 text-sm text-white placeholder:text-writter-sky focus:border-writter-gold focus:outline-none"
                                />
                            </form>

                            <div className="hidden space-x-4 sm:-my-px sm:ms-2 sm:flex lg:space-x-8">
                                <NavLink
                                    href={route('timeline')}
                                    active={route().current('timeline')}
                                >
                                    Home
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden items-center gap-2 sm:ms-6 sm:flex">
                            <NotificationNavButton
                                unreadCount={unreadNotificationsCount}
                            />

                            <div className="relative ms-1">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-writter-sky/40 bg-writter-indigo/50 px-3 py-2 text-sm font-medium leading-4 text-writter-sky transition duration-150 ease-in-out hover:border-writter-gold/60 hover:text-white focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('users.show', user.username)}
                                        >
                                            My profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center gap-0.5 sm:hidden">
                            <NotificationNavButton
                                unreadCount={unreadNotificationsCount}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-writter-sky transition duration-150 ease-in-out hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="border-t border-writter-sky/20 px-4 py-3">
                        <form method="get" action={route('search')} className="flex gap-2">
                            <input
                                type="search"
                                name="q"
                                placeholder="Search users"
                                className="flex-1 rounded-lg border border-writter-sky/40 bg-writter-indigo/50 px-3 py-2 text-sm text-white"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-writter-cyan px-3 py-2 text-sm text-white"
                            >
                                Go
                            </button>
                        </form>
                    </div>
                    <div className="space-y-1 border-t border-writter-sky/20 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('timeline')}
                            active={route().current('timeline')}
                        >
                            Home
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('notifications.index')}
                            active={route().current('notifications.index')}
                        >
                            Notifications
                            {unreadNotificationsCount > 0
                                ? ` (${unreadNotificationsCount})`
                                : ''}
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-writter-sky/20 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-writter-sky">
                                @{user.username}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route('users.show', user.username)}
                            >
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-writter-sky/30 bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1">{children}</main>
            <WritterFooter />
        </div>
    );
}
