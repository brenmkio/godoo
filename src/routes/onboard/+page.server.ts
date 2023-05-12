import { onboardSchema } from "$lib/zod.js"
import { setError, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_addProfile, DB_addUser, DB_updateUser } from "$lib/db"
import { generateTempUsername } from "$lib/utils"

export const load: PageServerLoad = async (event) => {

    // Server API:
    const form = await superValidate(event, onboardSchema)

    if (event.locals.profile) {
        throw redirect(303, "/")
    }

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

        // check handle availability
        const res = await event.fetch('/api/checkHandleAvailability?handle=' + form.data.handle)
        const handleRes = await res.json()
        if (!handleRes.available) {
            // chatgpt, how do I add an error that the handle is taken?
            setError(form, 'handle', 'This handle is already taken')
            return fail(400, { form })
        }

        // add to User
        const session = await event.locals.getSession()
        if (!session) {
            throw redirect(303, "/")
        }
        const authEmail = session?.user.email || ''
        const user_username = await generateTempUsername(session?.user.email || '')

        const returnedUser = await DB_addUser({
            email: authEmail,
            username: user_username
        })
        
        if (returnedUser.db_error) {
            return fail(500, { db_error: returnedUser.db_error })
        }
        
        const userId = returnedUser.db_data?.id

        const returnedProfile = await DB_addProfile({
            handle: form.data.handle,
            name: form.data.display,
            User_Profile_user_idToUser: {
                connect: { id: userId },
            },
        })

        if (returnedProfile.db_error) {
            return fail(500, { db_error: returnedProfile.db_error })
        }

        const profileId = returnedProfile.db_data?.id || -1

        // UPDATE CURRENT PROFILE ID OF USER
        const updateUserResult = await DB_updateUser(userId as number, {
            Profile_User_current_profile_idToProfile: {
                connect: { id: profileId }
            }
        })

        if (updateUserResult.db_error) {
            return fail(500, { db_error: updateUserResult.db_error });
        }

       throw redirect (303, "/choice")
    },
}