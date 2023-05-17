
import type { PageServerLoad } from './$types';
import { DB_getEventBySlug } from '$lib/db_get';
import type { Event } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {

    let eventToReturn: Event | null = null

    const result = await DB_getEventBySlug(params.slug)
    if (result.db_error) {
        return { error: result.db_error }
    }
    eventToReturn = result.db_data



    return { theEvent: eventToReturn }

}