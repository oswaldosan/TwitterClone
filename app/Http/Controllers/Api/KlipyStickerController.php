<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Klipy\KlipyStickerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KlipyStickerController extends Controller
{
    public function __construct(
        private KlipyStickerService $klipyStickers
    ) {}

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:8', 'max:50'],
        ]);

        $result = $this->klipyStickers->search(
            $validated['q'] ?? null,
            (int) ($validated['page'] ?? 1),
            (int) ($validated['per_page'] ?? 24),
        );

        return response()->json($result);
    }

    public function trending(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:8', 'max:50'],
        ]);

        $result = $this->klipyStickers->trending(
            (int) ($validated['page'] ?? 1),
            (int) ($validated['per_page'] ?? 24),
        );

        return response()->json($result);
    }

    public function categories(): JsonResponse
    {
        return response()->json($this->klipyStickers->categories());
    }
}
