import type { PageServerLoad } from './$types';
import { DB_getAllEvents } from '$lib/db_get';
import type { Event } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {

    const eventReturn = await DB_getAllEvents()
    
    if (eventReturn.db_error) {
        return { error: eventReturn.db_error }
    }

    return { events: eventReturn.db_data }

}