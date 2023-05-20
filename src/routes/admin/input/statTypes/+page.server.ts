import { statTypeSchema } from "$lib/zod.js"
import { setError, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_addStatType } from "$lib/db_add"
import type { Prisma, StatType } from "@prisma/client"
import type { DBReturn } from "$lib/types"
import { DB_getAllRawStatTypesFromActivity, DB_getAllStatTypesFromActivity } from "$lib/db_get"

export const load: PageServerLoad = async (event) => {

    // Server API:

    if (!event.locals.user || event.locals.user.id !== 3) {
        throw redirect(303, "/")
    } 

    const form = await superValidate(event, statTypeSchema)

    const rawStatTypeReturn = await DB_getAllRawStatTypesFromActivity("hockey")

    if (rawStatTypeReturn.db_error) {
        return { error: rawStatTypeReturn.db_error }
    }

    const aggStatTypeReturn = await DB_getAllStatTypesFromActivity("hockey")

    if (aggStatTypeReturn.db_error) {
        return { error: aggStatTypeReturn.db_error }
    }

    return { form, rawStatTypes: rawStatTypeReturn.db_data, aggStatTypes: aggStatTypeReturn.db_data }

}

export const actions: Actions = {


    default: async (event) => {

        const form = await superValidate(event, statTypeSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj



        let statTypeData: Prisma.StatTypeCreateInput = {}

        if (form.data.s1) {
            statTypeData.RawStatType_StatType_raw_stat_1ToRawStatType = {
                connect: { id: form.data.s1 }
            }
        }

        if (form.data.s2) {
            statTypeData.RawStatType_StatType_raw_stat_2ToRawStatType = {
                connect: { id: form.data.s2 }
            }
        }

        if (form.data.s3) {
            statTypeData.RawStatType_StatType_raw_stat_3ToRawStatType = {
                connect: { id: form.data.s3 }
            }
        }

        if (form.data.agg1) {
            statTypeData.StatType_StatType_agg_stat_1ToStatType = {
                connect: { id: form.data.agg1 }
            }
        }

        if (form.data.agg2) {
            statTypeData.StatType_StatType_agg_stat_2ToStatType = {
                connect: { id: form.data.agg2 }
            }
        }

        statTypeData.name = form.data.name
        statTypeData.shortform = form.data.shortform
        statTypeData.description = form.data.description
        statTypeData.category = form.data.category
        statTypeData.activity = form.data.activity
        statTypeData.higher_is_better = !form.data.higher_is_better
        statTypeData.expression = form.data.expression
        statTypeData.shortform = form.data.shortform
        // opposite because it was acting weird. this works.

        // add to database
        let statType: DBReturn<StatType> = { db_data: null, db_error: null }
        if (Object.keys(statTypeData).length > 0) {
            statType = await DB_addStatType(statTypeData)
        }

        if (statType.db_error) {
            // console.log("db error: " + JSON.stringify(statType.db_error.message))
        }

        if (statType.db_data) {
            // console.log("db data: " + JSON.stringify(statType.db_data))
        }


        


        
        throw redirect(303, "/admin/input/statTypes")

    },
}