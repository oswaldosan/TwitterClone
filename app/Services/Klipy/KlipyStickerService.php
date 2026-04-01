<?php

namespace App\Services\Klipy;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Klipy Sticker API — https://docs.klipy.com/stickers-api
 */
class KlipyStickerService
{
    public function isConfigured(): bool
    {
        return filled(config('klipy.api_key'));
    }

    /**
     * @return array{items: array, current_page: int, has_next: bool, error: string|null}
     */
    public function search(?string $query, int $page = 1, int $perPage = 24): array
    {
        return $this->getStickerCollection('stickers/search', [
            'q' => $query ?? '',
            'page' => max(1, $page),
            'per_page' => min(50, max(8, $perPage)),
        ]);
    }

    /**
     * @return array{items: array, current_page: int, has_next: bool, error: string|null}
     */
    public function trending(int $page = 1, int $perPage = 24): array
    {
        return $this->getStickerCollection('stickers/trending', [
            'page' => max(1, $page),
            'per_page' => min(50, max(8, $perPage)),
        ]);
    }

    /**
     * @return array{categories: array, error: string|null}
     */
    public function categories(): array
    {
        if (! $this->isConfigured()) {
            return ['categories' => [], 'error' => 'not_configured'];
        }

        $response = $this->request('stickers/categories', []);

        if (! $response->successful()) {
            return ['categories' => [], 'error' => 'http_'.$response->status()];
        }

        $json = $response->json();
        if (! is_array($json) || empty($json['result'])) {
            return ['categories' => [], 'error' => 'invalid_response'];
        }

        $payload = $json['data'] ?? null;
        $rows = is_array($payload) && isset($payload['data']) && is_array($payload['data'])
            ? $payload['data']
            : (is_array($payload) ? $payload : []);

        $categories = [];
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $categories[] = [
                'id' => isset($row['id']) ? (string) $row['id'] : null,
                'name' => isset($row['name']) ? (string) $row['name'] : null,
                'slug' => isset($row['slug']) ? (string) $row['slug'] : null,
                'image' => $this->extractPreviewFromItem($row),
            ];
        }

        return ['categories' => $categories, 'error' => null];
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array{items: array, current_page: int, has_next: bool, error: string|null}
     */
    private function getStickerCollection(string $path, array $query): array
    {
        if (! $this->isConfigured()) {
            return [
                'items' => [],
                'current_page' => 1,
                'has_next' => false,
                'error' => 'not_configured',
            ];
        }

        $response = $this->request($path, $query);

        if (! $response->successful()) {
            return [
                'items' => [],
                'current_page' => (int) ($query['page'] ?? 1),
                'has_next' => false,
                'error' => 'http_'.$response->status(),
            ];
        }

        $json = $response->json();
        if (! is_array($json) || empty($json['result'])) {
            return [
                'items' => [],
                'current_page' => (int) ($query['page'] ?? 1),
                'has_next' => false,
                'error' => 'invalid_response',
            ];
        }

        $payload = $json['data'] ?? null;
        if (! is_array($payload)) {
            return [
                'items' => [],
                'current_page' => (int) ($query['page'] ?? 1),
                'has_next' => false,
                'error' => 'invalid_payload',
            ];
        }

        $rows = $payload['data'] ?? null;
        if (! is_array($rows)) {
            $rows = [];
        }

        $items = [];
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $url = $this->extractBestUrl($row, false);
            $preview = $this->extractBestUrl($row, true) ?? $url;
            if ($url === null || $url === '') {
                continue;
            }
            $items[] = [
                'id' => isset($row['id']) ? (string) $row['id'] : (isset($row['slug']) ? (string) $row['slug'] : null),
                'url' => $url,
                'preview_url' => $preview ?? $url,
                'title' => isset($row['title']) ? (string) $row['title'] : null,
            ];
        }

        return [
            'items' => $items,
            'current_page' => (int) ($payload['current_page'] ?? $query['page'] ?? 1),
            'has_next' => (bool) ($payload['has_next'] ?? false),
            'error' => null,
        ];
    }

    /**
     * @param  array<string, mixed>  $query
     */
    private function request(string $path, array $query): Response
    {
        $key = config('klipy.api_key');
        $base = config('klipy.base_url');

        $url = $base.'/'.$key.'/'.$path;
        $query = array_filter($query, fn ($v) => $v !== null && $v !== '');

        return Http::timeout(12)
            ->acceptJson()
            ->withHeaders([
                'User-Agent' => 'WritterApp/1.0 (Laravel)',
            ])
            ->get($url, $query);
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function extractPreviewFromItem(array $item): ?string
    {
        return $this->extractBestUrl($item, true)
            ?? $this->extractBestUrl($item, false);
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function extractBestUrl(array $item, bool $preferSmallPreview): ?string
    {
        $files = $item['files'] ?? null;
        if (! is_array($files) || $files === []) {
            $nested = $item['file'] ?? null;
            if (is_array($nested)) {
                $files = $this->flattenNestedFileToLegacyFiles($nested, $preferSmallPreview);
            }
        }
        if (! is_array($files) || $files === []) {
            return null;
        }

        $order = $preferSmallPreview
            ? ['tinygif', 'tiny', 'preview', 'webp', 'png', 'gif', 'webm', 'mp4']
            : ['gif', 'webp', 'png', 'webm', 'mp4', 'tinygif', 'preview'];

        foreach ($order as $fmt) {
            if (! isset($files[$fmt])) {
                continue;
            }
            $node = $files[$fmt];
            if (is_string($node) && Str::startsWith($node, ['http://', 'https://'])) {
                return $node;
            }
            if (is_array($node) && isset($node['url']) && is_string($node['url'])) {
                return $node['url'];
            }
        }

        foreach ($files as $node) {
            if (is_array($node) && isset($node['url']) && is_string($node['url'])) {
                return $node['url'];
            }
        }

        return null;
    }

    /**
     * Current Klipy responses nest assets under `file` → size (hd, md, sm, xs, 240, …) → format → { url }.
     * Legacy responses used a flat `files` map (gif, tinygif, …).
     *
     * @param  array<string, mixed>  $file
     * @return array<string, string>
     */
    private function flattenNestedFileToLegacyFiles(array $file, bool $preferSmallPreview): array
    {
        $legacy = [];
        $formats = ['gif', 'webp', 'png', 'webm'];
        foreach ($this->orderedNestedSizeKeys($file, $preferSmallPreview) as $sizeKey) {
            $bucket = $file[$sizeKey] ?? null;
            if (! is_array($bucket)) {
                continue;
            }
            foreach ($formats as $fmt) {
                if (isset($legacy[$fmt])) {
                    continue;
                }
                $url = $this->mediaNodeToUrl($bucket[$fmt] ?? null);
                if ($url !== null) {
                    $legacy[$fmt] = $url;
                }
            }
        }

        return $legacy;
    }

    /**
     * @param  array<string, mixed>  $file
     * @return list<string>
     */
    private function orderedNestedSizeKeys(array $file, bool $preferSmallPreview): array
    {
        $preferred = $preferSmallPreview
            ? ['xs', 'sm', 'md', 'hd', '400', '320', '240']
            : ['hd', 'md', 'sm', 'xs', '400', '320', '240'];
        $ordered = [];
        foreach ($preferred as $k) {
            if (array_key_exists($k, $file)) {
                $ordered[] = $k;
            }
        }
        foreach (array_keys($file) as $k) {
            if (! in_array($k, $ordered, true)) {
                $ordered[] = $k;
            }
        }

        return $ordered;
    }

    private function mediaNodeToUrl(mixed $node): ?string
    {
        if (is_string($node) && Str::startsWith($node, ['http://', 'https://'])) {
            return $node;
        }
        if (is_array($node) && isset($node['url']) && is_string($node['url'])
            && Str::startsWith($node['url'], ['http://', 'https://'])) {
            return $node['url'];
        }

        return null;
    }
}
