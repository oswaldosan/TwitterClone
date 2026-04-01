import PostCard from '@/Components/Social/PostCard';
import ImageAttachField from '@/Components/Social/ImageAttachField';
import RichPostEditor from '@/Components/Social/RichPostEditor';
import StickerPicker from '@/Components/Social/StickerPicker';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { transformPostPayload } from '@/lib/postFormTransform';
import { Head, useForm } from '@inertiajs/react';
import { useCallback, useMemo, useRef, useState } from 'react';

export default function PostShow({ post }) {
    const fileRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [richEmpty, setRichEmpty] = useState(true);
    const [charCount, setCharCount] = useState(0);

    const { data, setData, post: submitPost, processing, errors, reset } =
        useForm({
            body: '',
            image: null,
            sticker_url: '',
        });

    const handleRichChange = useCallback(
        (html, meta) => {
            setData('body', html);
            setRichEmpty(meta.isEmpty);
            setCharCount(meta.characters ?? 0);
        },
        [setData],
    );

    const hasSticker = Boolean(data.sticker_url?.trim());
    const hasImage = Boolean(data.image);
    const canSubmit = useMemo(
        () => !richEmpty || hasSticker || hasImage,
        [richEmpty, hasSticker, hasImage],
    );

    const sendReply = (e) => {
        e.preventDefault();
        submitPost(route('posts.reply', post.id), {
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
        <AuthenticatedLayout
            header={
                <h2 className="font-display text-xl font-semibold text-writter-indigo">
                    Thread
                </h2>
            }
        >
            <Head title="Thread" />
            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-writter-indigo/10 bg-white/95 shadow-[0_20px_50px_-24px_rgba(45,48,71,0.35)] ring-1 ring-writter-indigo/[0.06]">
                    <PostCard post={post} showReply={false} />
                    <div className="border-t border-writter-indigo/[0.08] bg-writter-sky/[0.06] p-4">
                        <form onSubmit={sendReply} className="space-y-3">
                            <RichPostEditor
                                key={editorKey}
                                placeholder="Post your reply"
                                minHeightClass="min-h-[5rem]"
                                onChange={handleRichChange}
                            />
                            <ImageAttachField
                                file={data.image}
                                onFileChange={(f) => setData('image', f)}
                                disabled={processing}
                                inputRef={fileRef}
                                compact
                            />
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <StickerPicker
                                    value={data.sticker_url}
                                    onChange={(url) =>
                                        setData('sticker_url', url || '')
                                    }
                                    disabled={processing}
                                />
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`font-mono text-sm ${
                                            left < 20
                                                ? 'text-amber-700'
                                                : 'text-writter-indigo/50'
                                        }`}
                                    >
                                        {left}
                                    </span>
                                    <PrimaryButton
                                        disabled={processing || !canSubmit}
                                    >
                                        Reply
                                    </PrimaryButton>
                                </div>
                            </div>
                            <InputError message={errors.body} />
                            <InputError message={errors.image} />
                            <InputError message={errors.sticker_url} />
                        </form>
                    </div>
                    {post.replies?.length > 0 && (
                        <div className="border-t border-writter-indigo/[0.08]">
                            {post.replies.map((reply) => (
                                <PostCard key={reply.id} post={reply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
