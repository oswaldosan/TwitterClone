<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\SocialNotification;
use App\Support\KlipyStickerUrl;
use App\Support\PostBodySanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'body' => ['nullable', 'string', 'max:65535'],
            'sticker_url' => ['nullable', 'string', 'max:2048'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,gif,webp'],
        ]);

        $stickerUrl = KlipyStickerUrl::validate($request->input('sticker_url'));
        $hasImage = $request->hasFile('image');
        $allowEmptyBody = $stickerUrl !== null || $hasImage;

        $body = $this->validatedRichBody((string) $request->input('body', ''), $allowEmptyBody);

        $path = null;
        if ($hasImage) {
            $path = $request->file('image')->store('posts', 'public');
        }

        Post::create([
            'user_id' => $request->user()->id,
            'body' => $body,
            'image_path' => $path,
            'sticker_url' => $stickerUrl,
        ]);

        return redirect()->route('timeline');
    }

    public function show(Request $request, Post $post): Response
    {
        $root = $post->threadRoot();

        $root->load(['user']);
        $root->load(['replies' => function ($q) {
            $q->with('user')->withCount('likes')->latest();
        }]);

        $root->setAttribute('liked', $request->user()->hasLiked($root));

        foreach ($root->replies as $reply) {
            $reply->setAttribute('liked', $request->user()->hasLiked($reply));
        }

        return Inertia::render('PostShow', [
            'post' => $root,
        ]);
    }

    public function reply(Request $request, Post $post): RedirectResponse
    {
        if ($post->parent_id !== null) {
            abort(404);
        }

        $request->validate([
            'body' => ['nullable', 'string', 'max:65535'],
            'sticker_url' => ['nullable', 'string', 'max:2048'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,gif,webp'],
        ]);

        $stickerUrl = KlipyStickerUrl::validate($request->input('sticker_url'));
        $hasImage = $request->hasFile('image');
        $allowEmptyBody = $stickerUrl !== null || $hasImage;

        $body = $this->validatedRichBody((string) $request->input('body', ''), $allowEmptyBody);

        $path = null;
        if ($hasImage) {
            $path = $request->file('image')->store('posts', 'public');
        }

        $reply = Post::create([
            'user_id' => $request->user()->id,
            'parent_id' => $post->id,
            'body' => $body,
            'image_path' => $path,
            'sticker_url' => $stickerUrl,
        ]);

        if ($post->user_id !== $request->user()->id) {
            SocialNotification::create([
                'user_id' => $post->user_id,
                'actor_id' => $request->user()->id,
                'type' => 'post_replied',
                'data' => [
                    'post_id' => $post->id,
                    'reply_id' => $reply->id,
                ],
            ]);
        }

        return redirect()->route('posts.show', $post);
    }

    public function destroy(Request $request, Post $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return redirect()->back();
    }

    /**
     * @throws ValidationException
     */
    private function validatedRichBody(string $raw, bool $allowEmptyBody): string
    {
        $body = PostBodySanitizer::sanitize($raw);

        if (PostBodySanitizer::isEffectivelyEmpty($body)) {
            if ($allowEmptyBody) {
                return '<p></p>';
            }
            throw ValidationException::withMessages([
                'body' => __('Add text, an image, or a sticker.'),
            ]);
        }

        if (PostBodySanitizer::plainTextLength($body) > 280) {
            throw ValidationException::withMessages([
                'body' => __('The post may not be greater than 280 characters.'),
            ]);
        }

        return $body;
    }
}
