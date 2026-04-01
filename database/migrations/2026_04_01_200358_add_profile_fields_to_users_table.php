<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->text('bio')->nullable()->after('username');
            $table->string('avatar_path')->nullable()->after('bio');
        });

        $rows = DB::table('users')->select('id', 'email', 'name')->get();
        foreach ($rows as $row) {
            $base = Str::slug(Str::before((string) $row->email, '@')) ?: Str::slug(Str::limit((string) $row->name, 20, '')) ?: 'user';
            $base = Str::limit($base, 20, '');
            if ($base === '') {
                $base = 'user';
            }
            $username = $base;
            $suffix = 0;
            while (
                DB::table('users')
                    ->where('username', $username)
                    ->where('id', '!=', $row->id)
                    ->exists()
            ) {
                $suffix++;
                $username = Str::limit($base, 15, '').$suffix;
            }
            DB::table('users')->where('id', $row->id)->update(['username' => $username]);
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY username VARCHAR(255) NOT NULL');
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'bio', 'avatar_path']);
        });
    }
};
