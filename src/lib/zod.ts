import { z } from 'zod'

export const newUserSchema = z.object({
    name: z.string().min(1).default('Hello world!'),
    email: z.string().email(),
})

export const onboardSchema = z.object({
    handle: z.string().min(3),
    display: z.string().min(1),
})