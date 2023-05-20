import { editGroupSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { objConvertNullToUndefined } from "$lib/utilsClient"
import { DB_getGroupById, DB_getGroupBySlug } from "$lib/db_get"
import { DB_updateGroup } from "$lib/db_update"
import type { Group, Prisma, Profile } from "@prisma/client"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:
    // let form: Validation<AnyZodObject, any>

    if (!event.locals.profile) {
        throw redirect(303, "/")
    } 

    // GET GROUP
    const groupSlug = event.params.slug || ""
    let theGroup: Group | null = null
    const { db_data, db_error } = await DB_getGroupBySlug(groupSlug)
    if (db_error) {
        console.log("db error because slug: " + groupSlug)
        throw redirect(300, "/") // these all need to be better
    } else {
        theGroup = db_data
    }

    if (!theGroup) {
        console.log("no group")
        throw redirect(300, "/")
    }

    // CHECK THAT THIS GROUP BELONGS TO YOU
    // if (theGroup.creator !== event.locals.profile.id) {
    //     throw redirect(303, "/")
    // } // groups don't have creators yet

    const superformEvent = objConvertNullToUndefined(theGroup)
    const form = await superValidate(superformEvent, editGroupSchema)

    return { form, groupId: theGroup.id, existingSlug: theGroup.slug }

}

export const actions: Actions = {


    default: async (event) => {
        const form = await superValidate(event, editGroupSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!event.locals.profile) {
            throw redirect(300, "/")
        }

        // GET EVENT
        const groupId = form.data.group_id || -1
        let theGroup: Group | null = null
        const { db_data, db_error } = await DB_getGroupById(groupId)
        if (db_error) {
            throw redirect(300, "/") // these all need to be better
        } else {
            theGroup = db_data
        }

        if (!theGroup) {
            throw redirect(300, "/")
        }

        // CHECK THAT THIS Group BELONGS TO YOU
        // if (theGroup.creator !== event.locals.profile.id) {
        //     throw redirect(303, "/")
        // }

        // check handle availability
        let slugAvailable = false

        if (form.data.slug === theGroup.slug) {
            slugAvailable = true
        } else {
            const res = await event.fetch('/api/checkSlugAvailability?slug=' + form.data.slug + "&t=g")
            const slugRes = await res.json()
            if (!slugRes.available) {
                setError(form, 'slug', 'This slug is already taken')
                // return fail(400, { form })
            } else {
                slugAvailable = true
            }
        }


        const slugMax = 15
        const slugMin = 3
        const nameMax = 50
        const nameMin = 1
        const locationMax = 40
        const descriptionMax = 200


        const updateData: Prisma.GroupUpdateInput = {}

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

        if (form.data.slug && slugAvailable) {
            if (form.data.slug.length > slugMax) {
                setError(form, 'slug', "not updated: too long")
            } else if (form.data.slug.length < slugMin) {
                setError(form, 'slug', "not updated: too short")
            } else {
                updateData.slug = form.data.slug
            }
        } else if (!slugAvailable) {
            setError(form, 'slug', "not updated: slug wasn't available")
        } else {
            setError(form, 'slug', "not updated: can't be empty")
        }

        if (form.data.location) {
            if (form.data.location.length <= locationMax) {
                updateData.location = form.data.location
            } else {
                setError(form, 'location', "not updated: too long")
            }
        }

        if (form.data.description) {
            if (form.data.description.length <= descriptionMax) {
                updateData.description = form.data.description
            } else {
                setError(form, 'description', "not updated: too long")
            }
        }

        // update database
        let db_return: DBReturn<Group>
        if (Object.keys(updateData).length > 0) {

            db_return = await DB_updateGroup(theGroup.id, updateData)
    
            if (db_return.db_error) {
                setError(form, null, db_return.db_error.message)
                return fail(500, { form });
            }

            console.log("ERRORS: " + JSON.stringify(form.errors))

            if (Object.keys(form.errors).length > 0) {
                setMessage(form, "Your group was updated mostly successfully, but check for errors")
            } else {
                setMessage(form, "Your group was updated successfully")
            }
            return { form }
        }

        setError(form, null, "Nothing was able to be updated, please check the errors")
        return fail(400, { form })

    },
}