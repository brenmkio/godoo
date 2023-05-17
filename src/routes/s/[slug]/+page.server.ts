
import type { PageServerLoad } from './$types';
import { DB_getSceneBySlug } from '$lib/db_get';
import type { Scene } from '@prisma/client';

export const load: PageServerLoad = async ({ params, locals }) => {

    let sceneToReturn: Scene | null = null

    
    const result = await DB_getSceneBySlug(params.slug)
    if (result.db_error) {
        return { error: result.db_error }
    }
    sceneToReturn = result.db_data



    return { scene: sceneToReturn }

}