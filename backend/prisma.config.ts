import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    url: process.env.DATABASE_URL, // vem do .env
  },
})