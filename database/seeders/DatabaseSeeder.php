<?php

namespace Database\Seeders;

use App\Models\Follow;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory()->count(12)->create();

        $posts = collect();
        foreach ($users as $user) {
            foreach (range(1, random_int(3, 8)) as $_) {
                $posts->push(
                    Post::factory()->create([
                        'user_id' => $user->id,
                        'parent_id' => null,
                    ])
                );
            }
        }

        foreach ($users as $follower) {
            $others = $users->filter(fn (User $u) => $u->id !== $follower->id)->values();
            if ($others->isEmpty()) {
                continue;
            }
            $n = min(6, $others->count());
            $targets = $n === 1 ? collect([$others->first()]) : $others->random($n);
            foreach ($targets as $followee) {
                Follow::query()->firstOrCreate([
                    'follower_id' => $follower->id,
                    'followee_id' => $followee->id,
                ]);
            }
        }

        $nLike = min(40, $posts->count());
        if ($nLike > 0) {
            foreach ($posts->random($nLike) as $post) {
                $likers = $users->random(min(5, $users->count()));
                if (! is_iterable($likers)) {
                    $likers = collect([$likers]);
                }
                foreach ($likers as $liker) {
                    if ($liker->id === $post->user_id) {
                        continue;
                    }
                    Like::query()->firstOrCreate([
                        'user_id' => $liker->id,
                        'post_id' => $post->id,
                    ]);
                }
            }
        }

        $roots = $posts->filter(fn (Post $p) => $p->parent_id === null)->values();
        $nRep = min(15, $roots->count());
        if ($nRep > 0) {
            foreach ($roots->random($nRep) as $parent) {
                $plain = fake()->realText(random_int(20, 200));
                Post::factory()->create([
                    'user_id' => $users->random()->id,
                    'parent_id' => $parent->id,
                    'body' => '<p>'.htmlspecialchars($plain, ENT_QUOTES, 'UTF-8').'</p>',
                ]);
            }
        }
    }
}
