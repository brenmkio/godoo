import type { RequestHandler } from "./$types";
import { DB_checkEventSlug, DB_checkGroupSlug, DB_checkHandle } from "$lib/db_check";

export const GET: RequestHandler = async ({ url }) => {

    let available = false
    const testSlug = url.searchParams.get('slug') || ""
    const testTable = url.searchParams.get('t') || ""

    let result: any = null
    if (testTable === "e") {
        result = await DB_checkEventSlug(testSlug)
    } else if (testTable === "g") {
        result = await DB_checkGroupSlug(testSlug)
    }
    if (result.error) {
        return new Response(result.error?.message, {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
    available = !result.exists
    return new Response(JSON.stringify({ available }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })

}