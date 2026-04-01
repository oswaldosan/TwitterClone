import ImageAttachField from '@/Components/Social/ImageAttachField';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import RichPostEditor from '@/Components/Social/RichPostEditor';
import StickerPicker from '@/Components/Social/StickerPicker';
import { transformPostPayload } from '@/lib/postFormTransform';
import { useForm } from '@inertiajs/react';
import { useCallback, useMemo, useRef, useState } from 'react';

export default function PostComposer() {
    const fileRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [richEmpty, setRichEmpty] = useState(true);
    const [charCount, setCharCount] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        image: null,
        sticker_url: '',
    });

    const handleRichChange = useCallback((html, meta) => {
        setData('body', html);
        setRichEmpty(meta.isEmpty);
        setCharCount(meta.characters ?? 0);
    }, [setData]);

    const hasSticker = Boolean(data.sticker_url?.trim());
    const hasImage = Boolean(data.image);
    const canSubmit = useMemo(
        () => !richEmpty || hasSticker || hasImage,
        [richEmpty, hasSticker, hasImage],
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('posts.store'), {
            forceFormData: true,
            preserveScroll: true,
            transform: transformPostPayload,
            onSuccess: () => {
                reset();
                setEditorKey((k) => k + 1);
                setRichEmpty(true);
                setCharCount(0);
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    };

    const left = 280 - charCount;

    return (
        <form onSubmit={submit} className="space-y-5 px-5 pb-6 pt-1 sm:px-7 sm:pb-7">
            <label className="sr-only" htmlFor="tweet-body">
                What is happening?
            </label>
            <div id="tweet-body">
                <RichPostEditor
                    key={editorKey}
                    placeholder="What is happening?"
                    onChange={handleRichChange}
                />
            </div>
            <ImageAttachField
                file={data.image}
                onFileChange={(f) => setData('image', f)}
                disabled={processing}
                inputRef={fileRef}
            />
            <div className="flex flex-col gap-4 border-t border-writter-indigo/[0.06] pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <StickerPicker
                        value={data.sticker_url}
                        onChange={(url) => setData('sticker_url', url || '')}
                        disabled={processing}
                    />
                </div>
                <div className="flex items-center gap-4 sm:ms-auto">
                    <span
                        className={
                            left < 20
                                ? 'font-mono text-sm tabular-nums text-amber-700'
                                : 'font-mono text-sm tabular-nums text-writter-indigo/45'
                        }
                    >
                        {left}
                    </span>
                    <PrimaryButton disabled={processing || !canSubmit}>
                        Post
                    </PrimaryButton>
                </div>
            </div>
            <InputError message={errors.body} className="mt-1" />
            <InputError message={errors.image} className="mt-1" />
            <InputError message={errors.sticker_url} className="mt-1" />
        </form>
    );
}
