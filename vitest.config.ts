import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@seeding': path.resolve(__dirname, './src/prisma/seeding'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
    },
  },
})
