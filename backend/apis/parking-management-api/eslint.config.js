import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        ignores: ['dist/**', 'node_modules/**']
    },
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended'],
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType:  'module',
            globals: {
                console: 'readonly',
                fetch:   'readonly',
                process: 'readonly'
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'off'
        }
    }
];
