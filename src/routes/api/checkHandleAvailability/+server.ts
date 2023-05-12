import type { RequestHandler } from "./$types";
import prisma from '$lib/prisma'
import { DB_checkHandle } from "$lib/db";

export const GET: RequestHandler = async ({ url }) => {

    let available = false
    const testHandle = url.searchParams.get('handle') || ""

    const result = await DB_checkHandle(testHandle);
    console.log("CHECK HANDLE: " + JSON.stringify(result))
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