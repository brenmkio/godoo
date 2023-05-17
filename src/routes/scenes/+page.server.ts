import type { PageServerLoad } from './$types';
import { DB_getAllScenes } from '$lib/db_get';

export const load: PageServerLoad = async ({ params, locals }) => {

    const sceneReturn = await DB_getAllScenes()
    
    if (sceneReturn.db_error) {
        return { error: sceneReturn.db_error }
    }

    return { scenes: sceneReturn.db_data }

}