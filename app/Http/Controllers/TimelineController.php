<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $followeeIds = $user->followees()->pluck('users.id');
        $authorIds = $followeeIds->push($user->id)->unique()->values();

        $posts = Post::query()
            ->whereNull('parent_id')
            ->whereIn('user_id', $authorIds)
            ->with(['user'])
            ->withCount(['likes', 'replies'])
            ->latest()
            ->cursorPaginate(15);

        $posts->getCollection()->transform(function ($post) use ($user) {
            $post->setAttribute('liked', $user->hasLiked($post));

            return $post;
        });

        return Inertia::render('Timeline', [
            'posts' => Inertia::scroll($posts),
        ]);
    }
}
