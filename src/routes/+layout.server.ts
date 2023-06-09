import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.getSession()

    const myUser = locals.user
    const myProfile = locals.profile

    return {
        session, myUser, myProfile
    }
}