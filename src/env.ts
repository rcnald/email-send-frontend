import { z } from "zod"
import { fromZodError } from "zod-validation-error"

const envSchema = z.object({
  VITE_ENVIRONMENT: z
    .enum(["development", "production", "test"])
    .default("development"),
  VITE_API_URL: z.url(),
  VITE_MAX_FILE_SIZE: z
    .string()
    .transform((val) => {
      // biome-ignore lint/security/noGlobalEval: <mathematic expression>
      const size = eval(val)

      if (Number.isNaN(size)) {
        throw new Error("Invalid file size")
      }
      return size
    })
    .default(104_857_600), // 100 MB
  VITE_MAX_FILE_COUNT: z.coerce.number().min(1).default(5),
  VITE_ALLOWED_EXTENSIONS: z.string().default(".zip"),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
  console.error("Invalid environment variables:", fromZodError(_env.error))

  throw new Error("Invalid environment variables", {
    cause: fromZodError(_env.error),
  })
}

export const env = _env.data
