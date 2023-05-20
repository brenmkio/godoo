import { z } from 'zod'
import type { EventType } from '$lib/types'

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
    event_type: z.enum(["GeneralEvent", "Tournament", "Bracket", "Match", "Game", "null"]),
    continuation_of: z.number(),
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

export const rawStatTypeSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    activity: z.string().default("hockey"),
    higher_is_better: z.boolean().optional(),
})


export const occurrenceTypeSchema = z.object({
    name: z.string(),
    description: z.string(),
    activity: z.string().default("hockey"),
    s1: z.number(),
    v1: z.number(),
    s2: z.number().optional(),
    v2: z.number().optional(),
    s3: z.number().optional(),
    v3: z.number().optional(),
    s4: z.number().optional(),
    v4: z.number().optional(),
    s5: z.number().optional(),
    v5: z.number().optional(),
    s6: z.number().optional(),
    v6: z.number().optional(),
    s7: z.number().optional(),
    v7: z.number().optional(),
    s8: z.number().optional(),
    v8: z.number().optional(),
    s9: z.number().optional(),
    v9: z.number().optional(),
    s10: z.number().optional(),
    v10: z.number().optional(),
    s11: z.number().optional(),
    v11: z.number().optional(),
    s12: z.number().optional(),
    v12: z.number().optional(),
    s13: z.number().optional(),
    v13: z.number().optional(),
    s14: z.number().optional(),
    v14: z.number().optional(),
    s15: z.number().optional(),
    v15: z.number().optional(),
})

export const statTypeSchema = z.object({
    name: z.string(),
    shortform: z.string(),
    description: z.string(),
    category: z.string(),
    activity: z.string().default("hockey"),
    higher_is_better: z.boolean().optional(),
    s1: z.number().optional(),
    s2: z.number().optional(),
    s3: z.number().optional(),
    agg1: z.number().optional(),
    agg2: z.number().optional(),
    expression: z.string(),
})