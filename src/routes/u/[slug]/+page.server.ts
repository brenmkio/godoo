
import type { PageServerLoad } from './$types';
import { DB_getUserByUsername } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {

    const result = await DB_getUserByUsername(params.slug)
    if (result.db_error) {
        return { error: result.db_error }
    }
    return { user: result.db_data }

}