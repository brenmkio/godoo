import { z } from 'zod'

export const newUserSchema = z.object({
    name: z.string().min(1).default('Hello world!'),
    email: z.string().email(),
})