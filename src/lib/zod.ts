import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
})

export const onboardSchema = z.object({
    handle: z.string().min(3).max(20),
    name: z.string().min(1).max(20),
})

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirm: z.string().min(6),
    handle: z.string().min(3).max(20),
    name: z.string().min(1),
}).superRefine(({ confirm, password }, ctx) => {
    if (confirm !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords must match"
        })
    }
})

export const editProfileSchema = z.object({
    handle: z.string().max(30).optional(),
    name: z.string().max(30).optional(),
    pronouns: z.string().max(30).optional(),
    bio: z.string().max(220).optional(),
    location: z.string().max(50).optional(),
    birthday: z.date().optional(),
})