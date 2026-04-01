<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'unreadNotificationsCount' => $user
                ? $user->socialNotifications()->whereNull('read_at')->count()
                : 0,
            'klipyEnabled' => (bool) config('klipy.api_key'),
        ];
    }
}
