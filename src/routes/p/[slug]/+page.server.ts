
import type { PageServerLoad } from './$types';
import { DB_getProfileByHandle } from '$lib/db_get';
import type { Profile } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {

    let profileToReturn: Profile | null = null

    if (params.slug === "me") {
        if (!locals.profile) {
            return redirect(303, "/")
        }
        profileToReturn = locals.profile
    } else {
        const result = await DB_getProfileByHandle(params.slug)
        if (result.db_error) {
            return { error: result.db_error }
        }
        profileToReturn = result.db_data
    }



    return { profile: profileToReturn }

}