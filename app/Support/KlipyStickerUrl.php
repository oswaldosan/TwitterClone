<?php

namespace App\Support;

use Illuminate\Validation\ValidationException;

class KlipyStickerUrl
{
    /**
     * @throws ValidationException
     */
    public static function validate(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return null;
        }

        if (strlen($url) > 2048) {
            throw ValidationException::withMessages([
                'sticker_url' => __('The sticker URL is too long.'),
            ]);
        }

        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            throw ValidationException::withMessages([
                'sticker_url' => __('Invalid sticker URL.'),
            ]);
        }

        if (! str_starts_with($url, 'https://')) {
            throw ValidationException::withMessages([
                'sticker_url' => __('Sticker URLs must use HTTPS.'),
            ]);
        }

        $host = parse_url($url, PHP_URL_HOST);
        if (! is_string($host) || $host === '') {
            throw ValidationException::withMessages([
                'sticker_url' => __('Invalid sticker URL.'),
            ]);
        }

        $host = strtolower($host);
        $suffix = strtolower((string) config('klipy.allowed_sticker_host_suffix', 'klipy.com'));

        if (! str_ends_with($host, $suffix)) {
            throw ValidationException::withMessages([
                'sticker_url' => __('Only Klipy sticker URLs are allowed.'),
            ]);
        }

        return $url;
    }
}
