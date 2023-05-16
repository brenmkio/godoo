import type { RequestHandler } from "./$types";
import { DB_checkUsername } from "$lib/db";

export const GET: RequestHandler = async ({ url }) => {

    let available = false
    const testUsername = url.searchParams.get('username') || ""

    const result = await DB_checkUsername(testUsername);
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