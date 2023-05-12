import { onboardSchema } from "$lib/zod.js"
import { setError, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async (event) => {

    // Server API:
    const form = await superValidate(event, onboardSchema)

    return { form }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const actions: Actions = {

    onboard: async (event) => {
        const form = await superValidate(event, onboardSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!form.valid) {
            return fail(400, { form })
        }

        // do something with the validated data
        console.log("VALID! " + form)

       throw redirect (303, "/choice")
    },
}