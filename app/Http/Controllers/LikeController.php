<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\SocialNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Post $post): RedirectResponse
    {
        $user = $request->user();

        $existing = $user->likes()->where('post_id', $post->id)->first();

        if ($existing) {
            $existing->delete();
        } else {
            $user->likes()->create(['post_id' => $post->id]);

            if ($post->user_id !== $user->id) {
                SocialNotification::create([
                    'user_id' => $post->user_id,
                    'actor_id' => $user->id,
                    'type' => 'post_liked',
                    'data' => [
                        'post_id' => $post->id,
                    ],
                ]);
            }
        }

        return redirect()->back();
    }
}
