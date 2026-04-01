<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class KlipyStickerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_trending_returns_normalized_items_when_klipy_configured(): void
    {
        config(['klipy.api_key' => 'test-key']);

        Http::fake([
            'api.klipy.com/*' => Http::response([
                'result' => true,
                'data' => [
                    'data' => [
                        [
                            'id' => 'abc',
                            'title' => 'Wave',
                            'files' => [
                                'gif' => ['url' => 'https://cdn.klipy.com/a.gif'],
                                'tinygif' => ['url' => 'https://cdn.klipy.com/a-tiny.gif'],
                            ],
                        ],
                    ],
                    'current_page' => 1,
                    'has_next' => false,
                ],
            ], 200),
        ]);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('api.klipy.stickers.trending'));

        $response->assertOk();
        $response->assertJsonPath('items.0.url', 'https://cdn.klipy.com/a.gif');
        $response->assertJsonPath('error', null);
    }

    public function test_trending_normalizes_nested_file_field_from_current_klipy_api(): void
    {
        config(['klipy.api_key' => 'test-key']);

        Http::fake([
            'api.klipy.com/*' => Http::response([
                'result' => true,
                'data' => [
                    'data' => [
                        [
                            'id' => '8803053178531783',
                            'title' => 'Sparkly Excited Cat Sticker',
                            'file' => [
                                'hd' => [
                                    'gif' => ['url' => 'https://static.klipy.com/ii/cat/hd.gif'],
                                    'webp' => ['url' => 'https://static.klipy.com/ii/cat/hd.webp'],
                                ],
                                'xs' => [
                                    'gif' => ['url' => 'https://static.klipy.com/ii/cat/xs.gif'],
                                    'webp' => ['url' => 'https://static.klipy.com/ii/cat/xs.webp'],
                                ],
                            ],
                        ],
                    ],
                    'current_page' => 3,
                    'has_next' => true,
                ],
            ], 200),
        ]);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('api.klipy.stickers.trending'));

        $response->assertOk();
        $response->assertJsonPath('items.0.url', 'https://static.klipy.com/ii/cat/hd.gif');
        $response->assertJsonPath('items.0.preview_url', 'https://static.klipy.com/ii/cat/xs.webp');
        $response->assertJsonPath('current_page', 3);
        $response->assertJsonPath('has_next', true);
        $response->assertJsonPath('error', null);
    }

    public function test_sticker_endpoints_return_empty_when_not_configured(): void
    {
        config(['klipy.api_key' => null]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson(route('api.klipy.stickers.trending'))
            ->assertOk()
            ->assertJsonPath('error', 'not_configured');
    }
}
