import { newEventSchema } from "$lib/zod.js"
import { setError, setMessage, superValidate } from "sveltekit-superforms/server"
import type { PageServerLoad } from "./$types"
import { fail, type Actions, redirect } from "@sveltejs/kit"
import { DB_getAllEventsProfileCanContinue, DB_getSceneBySlug } from "$lib/db_get"
import { DB_addEvent } from "$lib/db_add"
import type { Event, Prisma, Scene } from "@prisma/client"
import type { DBReturn } from "$lib/types"

export const load: PageServerLoad = async (event) => {

    // Server API:

    if (!event.locals.profile) {
        throw redirect(303, "/")
    } 

    const sceneSlug = event.url.searchParams.get('s') || ""
    const sceneReturn = await DB_getSceneBySlug(sceneSlug)

    const form = await superValidate(event, newEventSchema)

    const eventReturn = await DB_getAllEventsProfileCanContinue(event.locals.profile.id)
    if (eventReturn.db_error) {
        return { form, error: eventReturn.db_error }
    }

    return { form, events: eventReturn.db_data, scene: sceneReturn.db_data }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

export const actions: Actions = {


    default: async (event) => {

        const form = await superValidate(event, newEventSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!event.locals.profile) {
            return fail(400, { form })
        }

        // check handle availability
        let slugAvailable = false

        const res = await event.fetch('/api/checkSlugAvailability?slug=' + form.data.slug + "&t=e")
        const slugRes = await res.json()
        if (!slugRes.available) {
            setError(form, 'slug', 'This slug is already taken')
            return fail(400, { form })
        } else {
            slugAvailable = true
        }


        const slugMax = 15
        const slugMin = 3
        const nameMax = 50
        const nameMin = 1


        const profileId = event.locals.profile.id
        const newEventData: Prisma.EventCreateInput = { 
            slug: "",
            name: "",
            Profile: {
                connect: { id: profileId },
            },
        }

        if (form.data.name) {
            if (form.data.name.length > nameMax) {
                setError(form, 'name', "name too long")
            } else if (form.data.name.length < nameMin) {
                setError(form, 'name', "name too short")
            } else {
                newEventData.name = form.data.name
            }
        } else {
            setError(form, 'name', "name can't be empty")
        }

        if (form.data.slug && slugAvailable) {
            if (form.data.slug.length > slugMax) {
                setError(form, 'slug', "slug too long")
            } else if (form.data.slug.length < slugMin) {
                setError(form, 'slug', "slug too short")
            } else {
                newEventData.slug = form.data.slug
            }
        } else if (!slugAvailable) {
            setError(form, 'slug', "slug not available")
        } else {
            setError(form, 'slug', "slug can't be empty")
        }

        newEventData.start_time = form.data.start_time

        if (Object.keys(form.errors).length > 0) {
            return fail(400, { form })
        }

        if (!form.data.event_type || form.data.event_type === "null") {
            newEventData.event_type = "GeneralEvent"
        } else {
            newEventData.event_type = form.data.event_type
        }

        // update database
        let newEvent: DBReturn<Event>
        if (event.locals.profile && Object.keys(newEventData).length > 0) {

            newEvent = await DB_addEvent(newEventData)
    
            if (newEvent.db_error) {
                setError(form, null, newEvent.db_error.message)
                return fail(500, { form });
            }

            if (newEvent.db_data) {
                throw redirect(303, "/e/" + newEvent.db_data.slug)
            }
        }

        setError(form, null, "There was a problem loading your profile data.")
        return fail(400, { form })

    },
}