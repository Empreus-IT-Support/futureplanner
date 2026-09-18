import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    restoreMocks: true,
    unstubEnvs: true,
  },
  resolve: {
    alias: { '@': resolve(import.meta.dirname, '.') },
  },
})
