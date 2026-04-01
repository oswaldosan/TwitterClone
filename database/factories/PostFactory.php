<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $plain = fake()->realText(rand(40, 200));

        return [
            'user_id' => User::factory(),
            'parent_id' => null,
            'body' => '<p>'.htmlspecialchars($plain, ENT_QUOTES, 'UTF-8').'</p>',
            'image_path' => null,
        ];
    }

    public function reply(Post $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
            'user_id' => User::factory(),
        ]);
    }
}
