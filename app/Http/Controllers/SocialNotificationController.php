<?php

namespace App\Http\Controllers;

use App\Models\SocialNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocialNotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = SocialNotification::query()
            ->where('user_id', $request->user()->id)
            ->with('actor')
            ->latest()
            ->paginate(30);

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function readAll(Request $request): RedirectResponse
    {
        SocialNotification::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return redirect()->back();
    }
}
