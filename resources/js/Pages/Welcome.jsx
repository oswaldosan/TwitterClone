import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Inicio" />
            <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        Writter
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Red social ligera — Laravel, Inertia y React
                    </h1>
                    <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                        Las URLs las define <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-sm dark:bg-zinc-800">routes/web.php</code>
                        . Cada respuesta puede ser{' '}
                        <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                            Inertia::render(&apos;NombrePagina&apos;)
                        </code>{' '}
                        y el componente vive en{' '}
                        <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
                            resources/js/Pages/NombrePagina.jsx
                        </code>
                        .
                    </p>
                    <ul className="mt-8 list-disc space-y-2 pl-5 text-zinc-700 dark:text-zinc-300">
                        <li>
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-red-600 underline-offset-4 hover:underline dark:text-red-400"
                            >
                                Documentación de Laravel
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://inertiajs.com"
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-red-600 underline-offset-4 hover:underline dark:text-red-400"
                            >
                                Documentación de Inertia
                            </a>
                        </li>
                    </ul>
                </main>
            </div>
        </>
    );
}
