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

export const newEventSchema = z.object({
    name: z.string().min(3).max(60),
    slug: z.string().min(3).max(20),
    start_time: z.date(),
})

export const editEventSchema = z.object({
    description: z.string().max(200).optional(),
    name: z.string().min(3).max(60).optional(),
    slug: z.string().min(3).max(20).optional(),
    location: z.string().max(50).optional(),
    start_time: z.date().optional(),
    end_time: z.date().optional(),
    minimum_attendance: z.number().optional(),
    maximum_attendance: z.number().optional(),
    optimal_attendance: z.number().optional(),
    event_id: z.number(),
})

export const editUserSchema = z.object({
    username: z.string().min(3).max(20)
})

export const newGroupSchema = z.object({
    name: z.string().min(3).max(60),
    slug: z.string().min(3).max(20),
})

export const editGroupSchema = z.object({
    name: z.string().min(3).max(50).optional(),
    slug: z.string().min(3).max(15).optional(),
    description: z.string().max(200).optional(),
    location: z.string().max(50).optional(),
    group_id: z.number(),
})