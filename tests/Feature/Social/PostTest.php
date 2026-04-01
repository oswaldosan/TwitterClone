<?php

namespace Tests\Feature\Social;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('posts.store'), [
            'body' => '<p>Hello world from test</p>',
        ]);

        $response->assertRedirect(route('timeline'));
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'parent_id' => null,
        ]);
        $post = Post::where('user_id', $user->id)->latest()->first();
        $this->assertNotNull($post);
        $this->assertStringContainsString('Hello world from test', $post->body);
    }

    public function test_post_body_max_280_plain_characters(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('posts.store'), [
            'body' => '<p>'.str_repeat('a', 281).'</p>',
        ]);

        $response->assertSessionHasErrors('body');
    }

    public function test_user_can_delete_own_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('posts.destroy', $post));

        $response->assertRedirect();
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_post_sticker_only_without_text(): void
    {
        $user = User::factory()->create();
        $sticker = 'https://cdn.klipy.com/example/sticker.gif';

        $response = $this->actingAs($user)->post(route('posts.store'), [
            'body' => '<p></p>',
            'sticker_url' => $sticker,
        ]);

        $response->assertRedirect(route('timeline'));
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'sticker_url' => $sticker,
        ]);
    }

    public function test_rejects_non_klipy_sticker_url(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('posts.store'), [
            'body' => '<p>Hi</p>',
            'sticker_url' => 'https://evil.example.com/x.gif',
        ]);

        $response->assertSessionHasErrors('sticker_url');
    }

    public function test_user_cannot_delete_others_post(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->delete(route('posts.destroy', $post));

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }
}
