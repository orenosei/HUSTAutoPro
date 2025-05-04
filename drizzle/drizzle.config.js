import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  dbCredentials: {
    url:'postgresql://admin:npg_D7t9UAvKruTO@ep-sweet-sound-a1rrjll5-pooler.ap-southeast-1.aws.neon.tech/hust-auto-pro?sslmode=require'
  },
});
