<?php

namespace Database\Factories;

use App\Models\SocialNotification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SocialNotification>
 */
class SocialNotificationFactory extends Factory
{
    protected $model = SocialNotification::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'actor_id' => User::factory(),
            'type' => 'new_follow',
            'data' => [],
            'read_at' => null,
        ];
    }
}
