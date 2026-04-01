<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class PostBodySanitizer
{
    public static function make(): HtmlSanitizer
    {
        $config = (new HtmlSanitizerConfig())
            ->allowElement('p')
            ->allowElement('br')
            ->allowElement('strong')
            ->allowElement('b')
            ->allowElement('em')
            ->allowElement('i')
            ->allowElement('u')
            ->allowElement('s')
            ->allowElement('strike')
            ->allowElement('del')
            ->allowElement('a', ['href', 'title', 'rel', 'target'])
            ->allowLinkSchemes(['http', 'https', 'mailto'])
            ->forceAttribute('a', 'rel', 'noopener noreferrer');

        return new HtmlSanitizer($config);
    }

    public static function sanitize(string $html): string
    {
        return self::make()->sanitize($html);
    }

    public static function plainTextLength(string $html): int
    {
        $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\s+/u', ' ', trim($text)) ?? '';

        return mb_strlen($text);
    }

    public static function isEffectivelyEmpty(string $html): bool
    {
        return self::plainTextLength($html) === 0;
    }
}
