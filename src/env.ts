import { z } from "zod"

const envSchema = z.object({
  VITE_ENVIRONMENT: z
    .enum(["development", "production", "test"])
    .default("development"),
  VITE_API_URL: z.url(),
  VITE_MAX_FILE_SIZE: z
    .string()
    .transform((val) => {
      const size = Number.parseInt(val, 10)
      if (Number.isNaN(size)) {
        throw new Error("Invalid file size")
      }
      return size
    })
    .default(104_857_600), // 100 MB
  VITE_MAX_FILE_COUNT: z.number().min(1).default(5),
  VITE_ALLOWED_EXTENSIONS: z.string().default(".zip"),
})

export const env = envSchema.parse(import.meta.env)
