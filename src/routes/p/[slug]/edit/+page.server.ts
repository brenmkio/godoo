import { editProfileSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { objConvertNullToUndefined } from "$lib/utilsClient"
import { DB_updateProfile } from "$lib/db_update"
import type { Prisma, Profile } from "@prisma/client"
import { updated } from "$app/stores"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:
    // let form: Validation<AnyZodObject, any>

    if (!event.locals.profile) {
        throw redirect(303, "/")
    } 

    const superformProfile = objConvertNullToUndefined(event.locals.profile)
    const form = await superValidate(superformProfile, editProfileSchema)

    return { form }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

export const actions: Actions = {


    editProfile: async (event) => {
        const form = await superValidate(event, editProfileSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        // check handle availability
        let handleAvailable = false

        if (form.data.handle === event.locals.profile?.handle) {
            handleAvailable = true
        } else {
            const res = await event.fetch('/api/checkHandleAvailability?handle=' + form.data.handle)
            const handleRes = await res.json()
            if (!handleRes.available) {
                // chatgpt, how do I add an error that the handle is taken?
                setError(form, 'handle', 'This handle is already taken')
                // return fail(400, { form })
            } else {
                handleAvailable = true
            }
        }


        const handleMax = 20
        const handleMin = 3
        const nameMax = 20
        const nameMin = 1
        const pronounsMax = 20
        const bioMax = 200
        const locationMax = 40

        const updateData: Prisma.ProfileUpdateInput = {}

        if (form.data.name) {
            if (form.data.name.length > nameMax) {
                setError(form, 'name', "not updated: too long")
            } else if (form.data.name.length < nameMin) {
                setError(form, 'name', "not updated: short")
            } else {
                updateData.name = form.data.name
            }
        } else {
            setError(form, 'name', "not updated: can't be empty")
        }

        if (form.data.handle && handleAvailable) {
            if (form.data.handle.length > handleMax) {
                setError(form, 'handle', "not updated: too long")
            } else if (form.data.handle.length < handleMin) {
                setError(form, 'handle', "not updated: too short")
            } else {
                updateData.handle = form.data.handle
            }
        } else if (!handleAvailable) {
            setError(form, 'handle', "not updated: handle wasn't available")
        } else {
            setError(form, 'handle', "not updated: can't be empty")
        }

        if (form.data.pronouns) {
            if (form.data.pronouns.length <= pronounsMax) {
                updateData.pronouns = form.data.pronouns
            } else {
                setError(form, 'pronouns', "not updated: too long")
            }
        }

        if (form.data.bio) {
            if (form.data.bio.length <= bioMax) {
                updateData.bio = form.data.bio
            } else {
                setError(form, 'bio', "not updated: too long")
            }
        }

        if (form.data.location) {
            if (form.data.location.length <= locationMax) {
                updateData.location = form.data.location
            } else {
                setError(form, 'location', "not updated: too long")
            }
        }

        // update database
        let db_return: DBReturn<Profile>
        if (event.locals.profile && Object.keys(updateData).length > 0) {

            db_return = await DB_updateProfile(event.locals.profile.id as number, updateData)
    
            if (db_return.db_error) {
                setError(form, null, db_return.db_error.message)
                return fail(500, { form });
            }

            console.log("ERRORS: " + JSON.stringify(form.errors))

            if (Object.keys(form.errors).length > 0) {
                setMessage(form, "Your profile was updated mostly successfully, but check for errors")
            } else {
                setMessage(form, "Your profile was updated successfully")
            }
            return { form }
        }

        setError(form, null, "Nothing was able to be updated, please check the errors")
        return fail(400, { form })

    },
}