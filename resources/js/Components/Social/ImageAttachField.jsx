import { useEffect, useId, useState } from 'react';

export default function ImageAttachField({
    file,
    onFileChange,
    disabled = false,
    inputRef,
    compact = false,
}) {
    const id = useId();
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file || !(file instanceof File)) {
            setPreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    const clear = () => {
        onFileChange(null);
        if (inputRef?.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                    className="sr-only"
                    disabled={disabled}
                    onChange={(e) =>
                        onFileChange(e.target.files?.[0] ?? null)
                    }
                />
                <label
                    htmlFor={id}
                    className={`inline-flex cursor-pointer items-center rounded-lg border border-writter-indigo/20 bg-writter-gold/20 px-3 py-1.5 text-xs font-bold text-writter-indigo transition hover:bg-writter-gold/35 ${
                        disabled ? 'pointer-events-none opacity-50' : ''
                    }`}
                >
                    {file ? 'Change photo' : 'Add photo'}
                </label>
                {file ? (
                    <button
                        type="button"
                        className="text-xs font-semibold text-red-600 hover:underline"
                        onClick={clear}
                    >
                        Remove photo
                    </button>
                ) : null}
            </div>
            {preview ? (
                <div
                    className={`relative overflow-hidden rounded-xl border border-writter-indigo/15 bg-writter-sky/10 ${
                        compact ? 'max-h-36' : 'max-h-72'
                    }`}
                >
                    <img
                        src={preview}
                        alt="Selected attachment preview"
                        className="mx-auto max-h-72 w-full object-contain"
                    />
                </div>
            ) : null}
        </div>
    );
}
