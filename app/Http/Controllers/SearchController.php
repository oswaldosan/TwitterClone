<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class SearchController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->get('q', ''));

        $users = collect();

        if ($q !== '') {
            $users = User::query()
                ->where(function ($query) use ($q) {
                    $query->where('name', 'like', '%'.$q.'%')
                        ->orWhere('username', 'like', '%'.$q.'%');
                })
                ->orderBy('username')
                ->limit(30)
                ->get(['id', 'name', 'username', 'bio', 'avatar_path']);
        }

        $users = $users->map(function (User $user) use ($request) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'bio' => $user->bio,
                'avatar_url' => $user->avatar_path
                    ? Storage::disk('public')->url($user->avatar_path)
                    : null,
                'is_following' => $request->user()->isFollowing($user),
            ];
        });

        return Inertia::render('Search', [
            'q' => $q,
            'users' => $users,
        ]);
    }
}
