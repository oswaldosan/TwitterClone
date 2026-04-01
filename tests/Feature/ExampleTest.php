<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_application_returns_a_successful_response_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_home_redirects_to_timeline_when_authenticated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/')
            ->assertRedirect(route('timeline'));
    }
}
