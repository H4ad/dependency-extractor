import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
});
