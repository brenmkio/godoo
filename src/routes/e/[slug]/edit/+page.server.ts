import { editEventSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { objConvertNullToUndefined } from "$lib/utilsClient"
import { DB_getEventById, DB_getEventBySlug } from "$lib/db_get"
import { DB_updateEvent } from "$lib/db_update"
import type { Prisma, Event } from "@prisma/client"
import { updated } from "$app/stores"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:
    // let form: Validation<AnyZodObject, any>

    if (!event.locals.profile) {
        throw redirect(303, "/")
    } 

    // GET EVENT
    const eventSlug = event.params.slug || ""
    let theEvent: Event | null = null
    const { db_data, db_error } = await DB_getEventBySlug(eventSlug)
    if (db_error) {
        throw redirect(300, "/") // these all need to be better
    } else {
        theEvent = db_data
    }

    if (!theEvent) {
        throw redirect(300, "/")
    }

    // CHECK THAT THIS EVENT BELONGS TO YOU
    if (theEvent.creator !== event.locals.profile.id) {
        throw redirect(303, "/")
    }

    const superformEvent = objConvertNullToUndefined(theEvent)
    const form = await superValidate(superformEvent, editEventSchema)

    return { form, eventId: theEvent.id, existingSlug: theEvent.slug }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

export const actions: Actions = {


    default: async (event) => {
        const form = await superValidate(event, editEventSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!event.locals.profile) {
            throw redirect(300, "/")
        }

        // GET EVENT
        const eventId = form.data.event_id || -1
        let theEvent: Event | null = null
        const { db_data, db_error } = await DB_getEventById(eventId)
        if (db_error) {
            throw redirect(300, "/") // these all need to be better
        } else {
            theEvent = db_data
        }

        if (!theEvent) {
            throw redirect(300, "/")
        }

        // CHECK THAT THIS EVENT BELONGS TO YOU
        if (theEvent.creator !== event.locals.profile.id) {
            throw redirect(303, "/")
        }

        // check handle availability
        let slugAvailable = false

        if (form.data.slug === theEvent.slug) {
            slugAvailable = true
        } else {
            const res = await event.fetch('/api/checkSlugAvailability?slug=' + form.data.slug + "&t=e")
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


        const updateData: Prisma.EventUpdateInput = {}

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
        let db_return: DBReturn<Event>
        if (Object.keys(updateData).length > 0) {

            db_return = await DB_updateEvent(theEvent.id, updateData)
    
            if (db_return.db_error) { 
                console.log("DB ERROR: " + db_return.db_error.message)
                setError(form, null, db_return.db_error.message)
                return fail(500, { form });
            }

            console.log("ERRORS: " + JSON.stringify(form.errors))

            if (Object.keys(form.errors).length > 0) {
                setMessage(form, "Your event was updated mostly successfully, but check for errors")
            } else {
                setMessage(form, "Your event was updated successfully")
            }

            console.log("why not: " + db_return.db_data?.slug)
            throw redirect(303, "/e/" + db_return.db_data?.slug)
        }
        console.log("HUH")
        setError(form, null, "Nothing was able to be updated, please check the errors")
        return fail(400, { form })

    },
}