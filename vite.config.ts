/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// Handle __dirname properly in ESM context
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// ✅ Final unified configuration
export default defineConfig({
  plugins: [react()],
  test: {
    // --- Main global test setup ---
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'], // load jest-dom matchers

    // --- Storybook integration project ---
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          // Optional: also reuse setup file here
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
