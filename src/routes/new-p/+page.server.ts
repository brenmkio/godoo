import { editProfileSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_addProfile, DB_getProfilesByUserId } from "$lib/db"
import type { Prisma, Profile } from "@prisma/client"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:

    if (!event.locals.user) {
        throw redirect(303, "/")
    } 

    const profileReturn = await DB_getProfilesByUserId(event.locals.user.id)
    
    if (profileReturn.db_error) {
        // huh
    }

    let profileCount = -1
    if (profileReturn.db_data) {
        profileCount = profileReturn.db_data.length
    }

    const form = await superValidate(event, editProfileSchema)

    return { form, profileCount }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

export const actions: Actions = {


    submitProfile: async (event) => {

        const form = await superValidate(event, editProfileSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!event.locals.user) {
            return fail(400, { form })
        }

        // check handle availability
        let handleAvailable = false

        if (form.data.handle === event.locals.profile?.handle) {
            handleAvailable = true
        } else {
            const res = await event.fetch('/api/checkHandleAvailability?handle=' + form.data.handle)
            const handleRes = await res.json()
            if (!handleRes.available) {
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

        // this needs to be insert
        const userId = event.locals.user.id
        const newProfileData: Prisma.ProfileCreateInput = { 
            handle: "", 
            name: "",
            User_Profile_parent_idToUser: {
              connect: { id: userId }
            },
        }

        if (form.data.name) {
            if (form.data.name.length > nameMax) {
                setError(form, 'name', "name too long")
            } else if (form.data.name.length < nameMin) {
                setError(form, 'name', "name too short")
            } else {
                newProfileData.name = form.data.name
            }
        } else {
            setError(form, 'name', "name can't be empty")
        }

        if (form.data.handle && handleAvailable) {
            if (form.data.handle.length > handleMax) {
                setError(form, 'handle', "handle too long")
            } else if (form.data.handle.length < handleMin) {
                setError(form, 'handle', "handle too short")
            } else {
                newProfileData.handle = form.data.handle
            }
        } else if (!handleAvailable) {
            setError(form, 'handle', "handle not available")
        } else {
            setError(form, 'handle', "handle can't be empty")
        }

        if (form.data.pronouns) {
            if (form.data.pronouns.length <= pronounsMax) {
                newProfileData.pronouns = form.data.pronouns
            } else {
                setError(form, 'pronouns', "pronouns too long")
            }
        }

        if (form.data.bio) {
            if (form.data.bio.length <= bioMax) {
                newProfileData.bio = form.data.bio
            } else {
                setError(form, 'bio', "bio too long")
            }
        }

        if (form.data.location) {
            if (form.data.location.length <= locationMax) {
                newProfileData.location = form.data.location
            } else {
                setError(form, 'location', "location too long")
            }
        }

        newProfileData.birthday = form.data.birthday

        if (Object.keys(form.errors).length > 0) {
            return fail(400, { form })
        }

        // update database
        let newProfile: DBReturn<Profile>
        if (event.locals.user && Object.keys(newProfileData).length > 0) {

            newProfile = await DB_addProfile(newProfileData)
    
            if (newProfile.db_error) {
                setError(form, null, newProfile.db_error.message)
                return fail(500, { form });
            }

            if (newProfile.db_data) {
                throw redirect(303, "/p/" + newProfile.db_data.handle)
            }
        }

        setError(form, null, "There was a problem loading your user data.")
        return fail(400, { form })

    },
}