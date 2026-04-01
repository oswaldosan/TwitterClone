<?php

namespace App\Http\Controllers;

use App\Models\SocialNotification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function toggle(Request $request, User $user): RedirectResponse
    {
        $auth = $request->user();

        if ($auth->id === $user->id) {
            return redirect()->back();
        }

        if ($auth->isFollowing($user)) {
            $auth->followees()->detach($user->id);
        } else {
            $auth->followees()->attach($user->id);

            SocialNotification::create([
                'user_id' => $user->id,
                'actor_id' => $auth->id,
                'type' => 'new_follow',
                'data' => [],
            ]);
        }

        return redirect()->back();
    }
}
