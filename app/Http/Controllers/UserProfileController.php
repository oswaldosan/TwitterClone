<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
class UserProfileController extends Controller
{
    public function show(Request $request, User $user): Response
    {
        $auth = $request->user();

        $posts = Post::query()
            ->where('user_id', $user->id)
            ->whereNull('parent_id')
            ->with(['user'])
            ->withCount(['likes', 'replies'])
            ->latest()
            ->cursorPaginate(15);

        $posts->getCollection()->transform(function ($post) use ($auth) {
            $post->setAttribute('liked', $auth->hasLiked($post));

            return $post;
        });

        return Inertia::render('UserProfile', [
            'profileUser' => array_merge($user->only(['id', 'name', 'username', 'bio']), [
                'avatar_url' => $user->avatar_url,
            ]),
            'posts' => $posts,
            'isFollowing' => $auth->isFollowing($user),
            'followersCount' => $user->followers()->count(),
            'followingCount' => $user->followees()->count(),
        ]);
    }

    public function followers(Request $request, User $user): Response
    {
        $followers = $user->followers()
            ->select('users.id', 'users.name', 'users.username', 'users.avatar_path')
            ->orderBy('name')
            ->paginate(30);

        $followers->getCollection()->transform(function ($u) use ($request) {
            $u->setAttribute('is_following', $request->user()->isFollowing($u));
            $u->setAttribute('avatar_url', $u->avatar_path
                ? Storage::disk('public')->url($u->avatar_path)
                : null);

            return $u;
        });

        return Inertia::render('UserList', [
            'title' => 'Followers',
            'user' => $user->only(['id', 'username', 'name']),
            'members' => $followers,
        ]);
    }

    public function following(Request $request, User $user): Response
    {
        $following = $user->followees()
            ->select('users.id', 'users.name', 'users.username', 'users.avatar_path')
            ->orderBy('name')
            ->paginate(30);

        $following->getCollection()->transform(function ($u) use ($request) {
            $u->setAttribute('is_following', $request->user()->isFollowing($u));
            $u->setAttribute('avatar_url', $u->avatar_path
                ? Storage::disk('public')->url($u->avatar_path)
                : null);

            return $u;
        });

        return Inertia::render('UserList', [
            'title' => 'Following',
            'user' => $user->only(['id', 'username', 'name']),
            'members' => $following,
        ]);
    }
}
