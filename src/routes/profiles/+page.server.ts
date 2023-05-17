import type { PageServerLoad } from './$types';
import { DB_getAllProfiles } from '$lib/db_get';

export const load: PageServerLoad = async ({ params, locals }) => {

    const profileReturn = await DB_getAllProfiles()
    
    if (profileReturn.db_error) {
        return { error: profileReturn.db_error }
    }

    return { profiles: profileReturn.db_data }

}