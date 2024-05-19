import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
