<?php

use App\Http\Controllers\Api\KlipyStickerController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SocialNotificationController;
use App\Http\Controllers\TimelineController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

/*
 * Serve public disk files when the `public/storage` symlink is missing.
 */
Route::get('/storage/{path}', function (string $path) {
    $path = str_replace('\\', '/', $path);
    if (Str::contains($path, '..')) {
        abort(404);
    }
    if (! Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return Storage::disk('public')->response($path);
})->where('path', '.*');

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('timeline');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return redirect()->route('timeline');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/timeline', [TimelineController::class, 'index'])->name('timeline');


    Route::prefix('api/klipy')->name('api.klipy.')->group(function () {
        Route::get('/stickers/search', [KlipyStickerController::class, 'search'])->name('stickers.search');
        Route::get('/stickers/trending', [KlipyStickerController::class, 'trending'])->name('stickers.trending');
        Route::get('/stickers/categories', [KlipyStickerController::class, 'categories'])->name('stickers.categories');
    });

    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/posts/{post}/replies', [PostController::class, 'reply'])->name('posts.reply');

    Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');

    Route::post('/users/{user}/follow', [FollowController::class, 'toggle'])->name('users.follow');
    Route::get('/users/{user:username}', [UserProfileController::class, 'show'])->name('users.show');
    Route::get('/users/{user:username}/followers', [UserProfileController::class, 'followers'])->name('users.followers');
    Route::get('/users/{user:username}/following', [UserProfileController::class, 'following'])->name('users.following');

    Route::get('/search', [SearchController::class, 'index'])->name('search');

    Route::get('/notifications', [SocialNotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [SocialNotificationController::class, 'readAll'])->name('notifications.readAll');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
