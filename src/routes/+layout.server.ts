import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { getSession }}) => {
    console.log("LAYOUT.SERVER.TS")
    return {
        session: await getSession(),
    }
}