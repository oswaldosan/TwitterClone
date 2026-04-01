import { usePage } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

/** Maps KlipyStickerService `error` codes to user-visible text */
function klipyErrorMessage(code) {
    if (!code || code === 'not_configured') {
        return null;
    }
    const http = /^http_(\d+)$/.exec(code);
    if (http) {
        const status = http[1];
        if (status === '401' || status === '403') {
            return 'Klipy rejected the request (' + status + '). Check KLIPY_API_KEY and run php artisan config:clear if you use config caching.';
        }
        if (status === '429') {
            return 'Klipy rate limit reached. Try again in a moment.';
        }
        return 'Klipy request failed (HTTP ' + status + ').';
    }
    if (code === 'invalid_response') {
        return 'Klipy returned an unexpected response. Try again later.';
    }
    if (code === 'invalid_payload') {
        return 'Could not read sticker data from Klipy.';
    }
    return 'Could not load stickers (' + code + ').';
}

export default function StickerPicker({
    value,
    onChange,
    disabled = false,
    className = '',
}) {
    const { klipyEnabled } = usePage().props;
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const dq = useDebouncedValue(q, 320);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setItems([]);
        setPage(1);
    }, [dq]);
    const [items, setItems] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    const [panelPos, setPanelPos] = useState({
        top: 0,
        left: 0,
        width: 352,
    });

    const canUse = Boolean(klipyEnabled) && !disabled;

    const fetchUrl = useMemo(() => {
        const base = dq.trim()
            ? route('api.klipy.stickers.search')
            : route('api.klipy.stickers.trending');
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('per_page', '20');
        if (dq.trim()) {
            params.set('q', dq.trim());
        }
        return `${base}?${params.toString()}`;
    }, [dq, page]);

    const load = useCallback(async () => {
        if (!canUse || !open) {
            return;
        }
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(fetchUrl, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.message || 'Request failed');
            }
            if (page === 1) {
                setItems(json.items || []);
            } else {
                setItems((prev) => [...prev, ...(json.items || [])]);
            }
            setHasNext(Boolean(json.has_next));
            if (json.error === 'not_configured') {
                setErr('Klipy API key missing on server.');
            } else if (json.error) {
                const msg = klipyErrorMessage(json.error);
                if (msg) {
                    setErr(msg);
                }
            }
        } catch (e) {
            setErr(e.message || 'Could not load stickers');
        } finally {
            setLoading(false);
        }
    }, [canUse, open, fetchUrl, page]);

    useEffect(() => {
        if (open) {
            void load();
        }
    }, [open, fetchUrl, load]);

    const updatePanelPosition = useCallback(() => {
        const btn = buttonRef.current;
        if (!btn) {
            return;
        }
        const r = btn.getBoundingClientRect();
        const maxW = Math.min(window.innerWidth - 16, 352);
        let left = r.left;
        if (left + maxW > window.innerWidth - 8) {
            left = Math.max(8, window.innerWidth - 8 - maxW);
        }
        if (left < 8) {
            left = 8;
        }
        setPanelPos({
            top: r.bottom + 8,
            left,
            width: maxW,
        });
    }, []);

    useEffect(() => {
        if (!open || !klipyEnabled) {
            return undefined;
        }
        updatePanelPosition();
        const onWin = () => updatePanelPosition();
        window.addEventListener('resize', onWin);
        window.addEventListener('scroll', onWin, true);
        return () => {
            window.removeEventListener('resize', onWin);
            window.removeEventListener('scroll', onWin, true);
        };
    }, [open, klipyEnabled, updatePanelPosition]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const onDoc = (e) => {
            const t = e.target;
            if (
                panelRef.current?.contains(t) ||
                buttonRef.current?.contains(t)
            ) {
                return;
            }
            setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    const stickerPreview =
        value ? (
            <div className="mt-2 flex items-center gap-2">
                <img
                    src={value}
                    alt=""
                    className="h-14 w-14 rounded-lg border border-writter-indigo/10 object-contain"
                />
                <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => onChange(null)}
                >
                    Remove sticker
                </button>
            </div>
        ) : null;

    if (!klipyEnabled) {
        return (
            <div className={`relative ${className}`}>
                <div className="inline-flex max-w-sm flex-col gap-1.5 rounded-xl border border-dashed border-writter-indigo/25 bg-writter-sky/15 px-3 py-2.5 text-left text-xs leading-snug text-writter-indigo/60">
                    <span className="font-display text-[13px] font-semibold text-writter-indigo/75">
                        Stickers
                    </span>
                    <span>
                        Set{' '}
                        <code className="rounded bg-white/90 px-1 py-0.5 font-mono text-[11px] text-writter-indigo">
                            KLIPY_API_KEY
                        </code>{' '}
                        in <code className="font-mono text-[11px]">.env</code>{' '}
                        and reload to browse Klipy stickers.
                    </span>
                </div>
                {stickerPreview}
            </div>
        );
    }

    const panel = open ? (
        <div
            ref={panelRef}
            className="fixed z-[300] rounded-2xl border border-writter-indigo/15 bg-white p-3 shadow-2xl ring-1 ring-black/5"
            style={{
                top: panelPos.top,
                left: panelPos.left,
                width: panelPos.width,
            }}
        >
            <input
                type="search"
                value={q}
                onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                }}
                placeholder="Search stickers…"
                className="mb-2 w-full rounded-xl border border-writter-indigo/15 px-3 py-2 text-sm text-writter-indigo placeholder:text-writter-indigo/40 focus:border-writter-cyan focus:outline-none"
            />
            {err ? (
                <p className="mb-2 text-xs text-red-600">{err}</p>
            ) : null}
            <div className="max-h-56 overflow-y-auto overscroll-contain">
                <div className="grid grid-cols-4 gap-1.5">
                    {items.map((it) => (
                        <button
                            key={`${it.id}-${it.preview_url}`}
                            type="button"
                            title={it.title || 'Sticker'}
                            onClick={() => {
                                onChange(it.url);
                                setOpen(false);
                            }}
                            className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-writter-sky/15 hover:ring-2 hover:ring-writter-cyan"
                        >
                            <img
                                src={it.preview_url || it.url}
                                alt=""
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
                {loading ? (
                    <p className="py-2 text-center text-xs text-writter-indigo/50">
                        Loading…
                    </p>
                ) : null}
                {!loading && items.length === 0 && !err ? (
                    <p className="py-4 text-center text-xs text-writter-indigo/45">
                        No stickers
                    </p>
                ) : null}
            </div>
            {hasNext ? (
                <button
                    type="button"
                    className="mt-2 w-full rounded-lg border border-writter-indigo/10 py-1.5 text-xs font-semibold text-writter-cyan hover:bg-writter-sky/20"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Load more
                </button>
            ) : null}
        </div>
    ) : null;

    return (
        <div className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                disabled={!canUse}
                onClick={() => {
                    setOpen((o) => {
                        if (!o) {
                            setPage(1);
                            setItems([]);
                        }
                        return !o;
                    });
                }}
                className="rounded-lg border border-writter-indigo/15 bg-white px-3 py-1.5 text-xs font-bold text-writter-indigo shadow-sm hover:border-writter-cyan/40 disabled:opacity-50"
            >
                Sticker
            </button>
            {panel && typeof document !== 'undefined'
                ? createPortal(panel, document.body)
                : null}
            {stickerPreview}
        </div>
    );
}
