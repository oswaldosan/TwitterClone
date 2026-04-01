<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    protected $appends = [
        'image_url',
    ];

    protected $fillable = [
        'user_id',
        'parent_id',
        'body',
        'image_path',
        'sticker_url',
    ];

    /**
     * Public URL for uploaded post images (relative so it works with any APP_URL / port).
     */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        $path = str_replace('\\', '/', $this->image_path);

        return '/storage/'.ltrim($path, '/');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('created_at');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function isRootPost(): bool
    {
        return $this->parent_id === null;
    }

    public function threadRoot(): self
    {
        $p = $this;
        while ($p->parent_id) {
            $p = $p->parent()->firstOrFail();
        }

        return $p;
    }
}
