<?php

namespace Tests\Unit\Services;

use App\Services\Klipy\KlipyStickerService;
use PHPUnit\Framework\Attributes\Test;
use ReflectionClass;
use Tests\TestCase;

class KlipyStickerServiceTest extends TestCase
{
    #[Test]
    public function extract_best_url_prefers_hd_gif_for_full_and_xs_webp_for_preview(): void
    {
        $service = new KlipyStickerService;
        $ref = new ReflectionClass($service);
        $method = $ref->getMethod('extractBestUrl');
        $method->setAccessible(true);

        $item = [
            'file' => [
                'hd' => [
                    'gif' => ['url' => 'https://static.klipy.com/hd.gif'],
                    'webp' => ['url' => 'https://static.klipy.com/hd.webp'],
                ],
                'xs' => [
                    'gif' => ['url' => 'https://static.klipy.com/xs.gif'],
                    'webp' => ['url' => 'https://static.klipy.com/xs.webp'],
                ],
            ],
        ];

        $this->assertSame('https://static.klipy.com/hd.gif', $method->invoke($service, $item, false));
        // Preview order prefers webp before gif (smaller / faster in grid).
        $this->assertSame('https://static.klipy.com/xs.webp', $method->invoke($service, $item, true));
    }

    #[Test]
    public function legacy_flat_files_still_take_precedence_over_nested_file(): void
    {
        $service = new KlipyStickerService;
        $ref = new ReflectionClass($service);
        $method = $ref->getMethod('extractBestUrl');
        $method->setAccessible(true);

        $item = [
            'files' => [
                'gif' => ['url' => 'https://cdn.klipy.com/legacy.gif'],
            ],
            'file' => [
                'hd' => [
                    'gif' => ['url' => 'https://static.klipy.com/nested.gif'],
                ],
            ],
        ];

        $this->assertSame('https://cdn.klipy.com/legacy.gif', $method->invoke($service, $item, false));
    }
}
