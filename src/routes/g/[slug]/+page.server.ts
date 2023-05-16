
import type { PageServerLoad } from './$types';
import { DB_getGroupBySlug } from '$lib/db';
import type { Group } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {

    let groupToReturn: Group | null = null

    const result = await DB_getGroupBySlug(params.slug)
    if (result.db_error) {
        return { error: result.db_error }
    }
    groupToReturn = result.db_data



    return { group: groupToReturn }

}