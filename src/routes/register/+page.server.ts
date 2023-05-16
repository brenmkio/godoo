import { AuthApiError } from "@supabase/supabase-js"
import { registerSchema } from "$lib/zod.js"
import { setError, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_addProfile, DB_addUser, DB_updateUser } from "$lib/db"
import { generateTempUsername } from "$lib/utilsServer"

export const load: PageServerLoad = async (event) => {

    // Server API:
    const form = await superValidate(event, registerSchema)


    if (event.locals.profile) {
        throw redirect(303, "/")
    }

    return { form }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

export const actions: Actions = {


    register: async (event) => {
        const form = await superValidate(event, registerSchema)
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

        const newEmail = form.data.email
        const { error: err } = await event.locals.supabase.auth.signUp({
            email: newEmail,
            password: form.data.password,
        })

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                return fail(400, {
                    error: 'Invalid email or password'
                })
            }
            return fail(500, {
                error: 'Server error. Please try again later.'
            })
        }




        // add to User
        const user_username = await generateTempUsername(newEmail)

        const returnedUser = await DB_addUser({
            email: newEmail,
            username: user_username
        })
        
        if (returnedUser.db_error) {
            return fail(500, { db_error: returnedUser.db_error })
        }
        
        const userId = returnedUser.db_data?.id

        const returnedProfile = await DB_addProfile({
            handle: form.data.handle,
            name: form.data.name,
            User_Profile_parent_idToUser: {
              connect: { id: userId }
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

        // log in
        const { error: loginErr } = await event.locals.supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password,
        })

        if (loginErr) {
            if (loginErr instanceof AuthApiError && loginErr.status === 400) {
                setError(form, null, 'Something unexpected went wrong, sorry.')
                return fail(400, { form })
            }
            setError(form, null, 'Server error, please try again later.')
            return fail(500, { form })
        }

       throw redirect (303, "/choice")
    },
}