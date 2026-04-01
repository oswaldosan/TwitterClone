import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                writter: {
                    indigo: '#2D3047',
                    sky: '#93B7BE',
                    gold: '#E0CA3C',
                    cyan: '#048A81',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Fraunces', 'Georgia', 'serif'],
                post: ['"Source Serif 4"', 'Georgia', 'serif'],
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(1rem)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.65s ease-out both',
                'fade-up-1': 'fade-up 0.65s ease-out 0.05s both',
                'fade-up-2': 'fade-up 0.7s ease-out 0.14s both',
                'fade-up-3': 'fade-up 0.72s ease-out 0.22s both',
                'fade-up-4': 'fade-up 0.75s ease-out 0.32s both',
                'fade-up-5': 'fade-up 0.8s ease-out 0.42s both',
            },
        },
    },

    plugins: [forms, typography],
};
