import { rawStatTypeSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_addRawStatType } from "$lib/db_add"
import type { Prisma, RawStatType } from "@prisma/client"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:

    if (!event.locals.user || event.locals.user.id !== 3) {
        throw redirect(303, "/")
    } 

    const form = await superValidate(event, rawStatTypeSchema)

    return { form }

}

export const actions: Actions = {


    default: async (event) => {

        const form = await superValidate(event, rawStatTypeSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        const rawStatData: Prisma.RawStatTypeCreateInput = {
        }

        rawStatData.name = form.data.name
        rawStatData.description = form.data.description
        rawStatData.category = form.data.category
        rawStatData.activity = form.data.activity
        rawStatData.higher_is_better = !form.data.higher_is_better
        // opposite because it was acting weird. this works.

        // add to database
        let rawStat: DBReturn<RawStatType>
        if (Object.keys(rawStatData).length > 0) {

            rawStat = await DB_addRawStatType(rawStatData)
    
            if (rawStat.db_error) {
                setError(form, null, rawStat.db_error.message)
                return fail(500, { form });
            }

            if (rawStat.db_data) {
                throw redirect(303, "/admin/input/rawStatTypes")
            }
        }

        setError(form, null, "There was a problem loading your profile data.")
        return fail(400, { form })

    },
}