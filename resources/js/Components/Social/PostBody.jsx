import DOMPurify from 'dompurify';
import { useMemo } from 'react';

const PURIFY = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'a'],
    ALLOWED_ATTR: ['href', 'title', 'rel', 'target'],
    ADD_ATTR: ['target'],
};

function normalizeLegacyBody(raw) {
    if (raw == null || raw === '') {
        return '';
    }
    const t = String(raw).trim();
    if (t.startsWith('<')) {
        return raw;
    }
    const escaped = t
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return `<p>${escaped.replace(/\n/g, '<br />')}</p>`;
}

export default function PostBody({ html, className = '' }) {
    const safe = useMemo(() => {
        const normalized = normalizeLegacyBody(html);
        return DOMPurify.sanitize(normalized, PURIFY);
    }, [html]);

    return (
        <div
            className={`prose prose-sm max-w-none font-sans text-[15px] leading-[1.65] text-writter-indigo/95 prose-p:my-1 prose-p:leading-relaxed prose-a:break-words prose-a:font-medium prose-a:text-writter-cyan prose-a:underline-offset-2 hover:prose-a:text-writter-indigo md:text-base ${className}`}
            dangerouslySetInnerHTML={{ __html: safe }}
        />
    );
}
