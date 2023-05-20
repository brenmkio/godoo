import { occurrenceTypeSchema } from "$lib/zod.js"
import { setError, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_addOccurrenceType, DB_addStatModifier } from "$lib/db_add"
import type { OccurrenceType, Prisma, StatModifier } from "@prisma/client"
import type { DBReturn } from "$lib/types"
import { DB_getAllRawStatTypesFromActivity } from "$lib/db_get"

export const load: PageServerLoad = async (event) => {

    // Server API:

    if (!event.locals.user || event.locals.user.id !== 3) {
        throw redirect(303, "/")
    } 

    const form = await superValidate(event, occurrenceTypeSchema)

    const rawStatTypeReturn = await DB_getAllRawStatTypesFromActivity("hockey")

    if (rawStatTypeReturn.db_error) {
        return { error: rawStatTypeReturn.db_error }
    }

    return { form, rawStatTypes: rawStatTypeReturn.db_data }

}

export const actions: Actions = {


    default: async (event) => {

        const form = await superValidate(event, occurrenceTypeSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        let occurrenceTypeData: Prisma.OccurrenceTypeCreateInput = {
        }

        occurrenceTypeData.name = form.data.name
        occurrenceTypeData.description = form.data.description
        occurrenceTypeData.activity = form.data.activity

        // add to database
        let occurrenceType: DBReturn<OccurrenceType> = { db_data: null, db_error: null }
        if (Object.keys(occurrenceTypeData).length > 0) {
            occurrenceType = await DB_addOccurrenceType(occurrenceTypeData)
        }




        if (occurrenceType.db_data) {


            let statModifier1_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s1}
                }
            }
            statModifier1_data.modifier_value = form.data.v1

            // add to database
            let statModifier1: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier1_data).length > 0) {
                statModifier1 = await DB_addStatModifier(statModifier1_data)
            }









            if (!form.data.v2) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier2_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s2}
                }
            }
            statModifier2_data.modifier_value = form.data.v2

            // add to database
            let statModifier2: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier2_data).length > 0) {
                statModifier2 = await DB_addStatModifier(statModifier2_data)
            }












            if (!form.data.v3) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier3_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s3}
                }
            }
            statModifier3_data.modifier_value = form.data.v3

            // add to database
            let statModifier3: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier3_data).length > 0) {
                statModifier3 = await DB_addStatModifier(statModifier3_data)
            }












            if (!form.data.v4) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier4_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s4}
                }
            }
            statModifier4_data.modifier_value = form.data.v4

            // add to database
            let statModifier4: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier4_data).length > 0) {
                statModifier4 = await DB_addStatModifier(statModifier4_data)
            }












            if (!form.data.v5) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier5_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s5}
                }
            }
            statModifier5_data.modifier_value = form.data.v5

            // add to database
            let statModifier5: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier5_data).length > 0) {
                statModifier5 = await DB_addStatModifier(statModifier5_data)
            }












            if (!form.data.v6) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier6_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s6}
                }
            }
            statModifier6_data.modifier_value = form.data.v6

            // add to database
            let statModifier6: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier6_data).length > 0) {
                statModifier6 = await DB_addStatModifier(statModifier6_data)
            }












            if (!form.data.v7) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier7_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s7}
                }
            }
            statModifier7_data.modifier_value = form.data.v7

            // add to database
            let statModifier7: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier7_data).length > 0) {
                statModifier7 = await DB_addStatModifier(statModifier7_data)
            }












            if (!form.data.v8) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier8_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s8}
                }
            }
            statModifier8_data.modifier_value = form.data.v8

            // add to database
            let statModifier8: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier8_data).length > 0) {
                statModifier8 = await DB_addStatModifier(statModifier8_data)
            }












            if (!form.data.v9) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier9_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s9}
                }
            }
            statModifier9_data.modifier_value = form.data.v9

            // add to database
            let statModifier9: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier9_data).length > 0) {
                statModifier9 = await DB_addStatModifier(statModifier9_data)
            }












            if (!form.data.v10) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier10_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s10}
                }
            }
            statModifier10_data.modifier_value = form.data.v10

            // add to database
            let statModifier10: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier10_data).length > 0) {
                statModifier10 = await DB_addStatModifier(statModifier10_data)
            }












            if (!form.data.v11) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier11_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s11}
                }
            }
            statModifier11_data.modifier_value = form.data.v11

            // add to database
            let statModifier11: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier11_data).length > 0) {
                statModifier11 = await DB_addStatModifier(statModifier11_data)
            }












            if (!form.data.v12) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier12_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s12}
                }
            }
            statModifier12_data.modifier_value = form.data.v12

            // add to database
            let statModifier12: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier12_data).length > 0) {
                statModifier12 = await DB_addStatModifier(statModifier12_data)
            }












            if (!form.data.v13) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier13_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s13}
                }
            }
            statModifier13_data.modifier_value = form.data.v13

            // add to database
            let statModifier13: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier13_data).length > 0) {
                statModifier13 = await DB_addStatModifier(statModifier13_data)
            }












            if (!form.data.v14) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier14_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s14}
                }
            }
            statModifier14_data.modifier_value = form.data.v14

            // add to database
            let statModifier14: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier14_data).length > 0) {
                statModifier14 = await DB_addStatModifier(statModifier14_data)
            }












            if (!form.data.v15) {
                throw redirect(303, "/admin/input/occurrenceTypes")
            }

            let statModifier15_data: Prisma.StatModifierCreateInput = {
                OccurrenceType: {
                    connect: { id: occurrenceType.db_data.id }
                },
                RawStatType: {
                    connect: { id: form.data.s15}
                }
            }
            statModifier15_data.modifier_value = form.data.v15

            // add to database
            let statModifier15: DBReturn<StatModifier> = { db_data: null, db_error: null }
            if (Object.keys(statModifier15_data).length > 0) {
                statModifier15 = await DB_addStatModifier(statModifier15_data)
            }
        }


        
        throw redirect(303, "/admin/input/occurrenceTypes")

    },
}