/**
 * Inertia FormData: omit non-file image and empty sticker so Laravel receives a real upload.
 */
export function transformPostPayload(data) {
    const next = { ...data };
    if (!(next.image instanceof File)) {
        delete next.image;
    }
    if (!next.sticker_url?.trim()) {
        delete next.sticker_url;
    }
    return next;
}
