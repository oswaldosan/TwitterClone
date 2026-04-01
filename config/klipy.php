<?php

return [

    'api_key' => env('KLIPY_API_KEY'),

    'base_url' => rtrim(env('KLIPY_BASE_URL', 'https://api.klipy.com/api/v1'), '/'),

    'allowed_sticker_host_suffix' => 'klipy.com',

];
