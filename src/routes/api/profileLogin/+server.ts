import { error, fail, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { DB_getProfileByHandle } from "$lib/db_get"
import { DB_updateUser } from "$lib/db_update"
import type { Profile } from "@prisma/client";

export const POST: RequestHandler = async ({ locals, url }) => {

    if (!locals.user || !locals.profile) {
        throw redirect(303, '/')
    }
    
    const profileHandle = url.searchParams.get("p") || ""
    const userId = locals.user.id

    let theProfile: Profile | null = null

    const result = await DB_getProfileByHandle(profileHandle)
    if (result.db_error) {
        throw error(500, result.db_error.message ) 
    }
    theProfile = result.db_data

    if (!theProfile) {
        throw error(500, "No profile was found")
    }

    if (theProfile.parent_id !== locals.user.id) {
        throw error(500, "That profile doesn't belong to you")
    }
    
    // UPDATE CURRENT PROFILE ID OF USER
    const updateUserResult = await DB_updateUser(userId as number, {
        Profile_User_current_profile_idToProfile: {
            connect: { id: theProfile.id }
        }
    })

    if (updateUserResult.db_error) {
        throw error(500, updateUserResult.db_error.message)
    }



    throw redirect(303, '/')
}