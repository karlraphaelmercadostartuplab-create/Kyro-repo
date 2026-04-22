import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';

const workdoBasePath = 'packages/workdo';
const workdoPackages = existsSync(workdoBasePath)
    ? readdirSync(workdoBasePath, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => `${workdoBasePath}/${entry.name}/src/Resources/js/app.tsx`)
          .filter((entryPath) => existsSync(entryPath))
    : [];

export default defineConfig({
    
    plugins: [
        laravel({
            input:
            [
                'resources/css/app.css',
                'resources/js/app.tsx',
                ...workdoPackages
            ],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: 'localhost',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
        watch: {
            ignored: ['**/vendor/**', '**/node_modules/**']
        },
        fs: {
            allow: ['..', 'packages']
        }
    },

    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
                    utils: ['date-fns', 'clsx']
                }
            },
        },
        assetsDir: 'assets',
    }
});
