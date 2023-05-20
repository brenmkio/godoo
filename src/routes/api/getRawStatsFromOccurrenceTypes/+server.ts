import type { RequestHandler } from "./$types";
import { DB_checkEventSlug, DB_checkGroupSlug, DB_checkHandle } from "$lib/db_check";
import { DB_getAllRawStatTypesFromOccurrenceTypes } from "$lib/db_get";
import { str } from "$lib/utilsClient";

export const POST: RequestHandler = async ({ url, request }) => {

    const occurrenceTypeIds = await request.json()
    const result = await DB_getAllRawStatTypesFromOccurrenceTypes(occurrenceTypeIds);

    if (result.db_error) {
        return new Response(str({ error: result.db_error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }

    // Map rawStatTypes to their ids
    let rawStatTypeIds: bigint[] = []
    if (result.db_data) {
        rawStatTypeIds = result.db_data.map(rawStatType => rawStatType.id)
    }

    return new Response(str(rawStatTypeIds), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })

}