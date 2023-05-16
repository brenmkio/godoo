import type { PageServerLoad } from './$types';
import { DB_getAllGroups } from '$lib/db';
import type { Group } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {

    const groupReturn = await DB_getAllGroups()
    
    if (groupReturn.db_error) {
        return { error: groupReturn.db_error }
    }

    return { groups: groupReturn.db_data }

}