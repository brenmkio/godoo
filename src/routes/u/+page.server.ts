import { editUserSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { objConvertNullToUndefined } from "$lib/utilsClient"
import { DB_getAllProfilesForUserId } from "$lib/db_get"
import { DB_updateUser } from "$lib/db_update"
import type { Prisma, User } from "@prisma/client"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:
    // let form: Validation<AnyZodObject, any>

    if (!event.locals.user) {
        throw redirect(303, "/")
    } 


    const profileReturn = await DB_getAllProfilesForUserId(event.locals.user.id)
    
    if (profileReturn.db_error) {
        return { error: profileReturn.db_error }
    }


    const superformUser = objConvertNullToUndefined(event.locals.user)
    const form = await superValidate(superformUser, editUserSchema)

    return { form, profiles: profileReturn.db_data }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

export const actions: Actions = {


    editUser: async (event) => {
        const form = await superValidate(event, editUserSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        // check handle availability
        let usernameAvailable = false

        if (form.data.username === event.locals.user?.username) {
            usernameAvailable = true
        } else {
            const res = await event.fetch('/api/checkUsernameAvailability?username=' + form.data.username)
            const usernameRes = await res.json()
            if (!usernameRes.available) {
                // chatgpt, how do I add an error that the username is taken?
                setError(form, 'username', 'This username is already taken')
                // return fail(400, { form })
            } else {
                usernameAvailable = true
            }
        }


        const usernameMax = 20
        const usernameMin = 3

        const updateData: Prisma.UserUpdateInput = {}

        if (form.data.username) {
            if (form.data.username.length > usernameMax) {
                setError(form, 'username', "not updated: too long")
            } else if (form.data.username.length < usernameMin) {
                setError(form, 'username', "not updated: short")
            } else {
                updateData.username = form.data.username
            }
        } else {
            setError(form, 'username', "not updated: can't be empty")
        }


        // update database
        let db_return: DBReturn<User>
        if (event.locals.user && Object.keys(updateData).length > 0) {

            db_return = await DB_updateUser(event.locals.user.id as number, updateData)
    
            if (db_return.db_error) {
                setError(form, null, db_return.db_error.message)
                return fail(500, { form });
            }

            console.log("ERRORS: " + JSON.stringify(form.errors))

            if (Object.keys(form.errors).length > 0) {
                setMessage(form, "Your user data was updated mostly successfully, but check for errors")
            } else {
                setMessage(form, "Your user data was updated successfully")
            }
            return { form }
        }

        setError(form, null, "Nothing was able to be updated, please check the errors")
        return fail(400, { form })

    },
}