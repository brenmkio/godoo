
import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { Group, OccurrenceType, RawStatType, StatType } from "@prisma/client"
import { DB_getAllOccurrenceTypesFromActivity, DB_getAllRawStatTypesFromActivity, DB_getAllStatTypesFromActivity, DB_getGroupBySlug } from "$lib/db_get"
import type { DBError } from "$lib/types"




export const load: PageServerLoad = async (event) => {

    let dbErrors: DBError[] = []

    if (!event.locals.profile) {
        throw redirect(303, "/")
    } 

    // GET GROUP
    const groupSlug = event.params.slug || ""
    let theGroup: Group | null = null
    const { db_data, db_error } = await DB_getGroupBySlug(groupSlug)
    if (db_error) {
        throw redirect(300, "/") // these all need to be better
    } else {
        theGroup = db_data
    }

    if (!theGroup) {
        throw redirect(300, "/")
    }

    const occurrenceTypeReturn = await DB_getAllOccurrenceTypesFromActivity("hockey")

    if (occurrenceTypeReturn.db_error) {
        dbErrors.push(occurrenceTypeReturn.db_error)
    }

    const statTypeReturn = await DB_getAllStatTypesFromActivity("hockey")

    if (statTypeReturn.db_error) {
        dbErrors.push(statTypeReturn.db_error)
    }

    const rawStatTypeReturn = await DB_getAllRawStatTypesFromActivity("hockey")

    if (rawStatTypeReturn.db_error) {
        dbErrors.push(rawStatTypeReturn.db_error)
    }

    let occurrenceTypes: Record<number, OccurrenceType> = {}
    if (occurrenceTypeReturn.db_data) {
        occurrenceTypes = occurrenceTypeReturn.db_data.reduce((record, item) => {
            const itemId = Number(item.id)
            record[itemId] = item
            return record
          }, {} as Record<number, OccurrenceType>)
    }

    let statTypes: Record<number, StatType> = {}
    if (statTypeReturn.db_data) {
        statTypes = statTypeReturn.db_data.reduce((record, item) => {
            const itemId = Number(item.id)
            record[itemId] = item
            return record
          }, {} as Record<number, StatType>)
    }

    let rawStatTypes: Record<number, RawStatType> = {}
    if (rawStatTypeReturn.db_data) {
        rawStatTypes = rawStatTypeReturn.db_data.reduce((record, item) => {
            const itemId = Number(item.id)
            record[itemId] = item
            return record
          }, {} as Record<number, RawStatType>)
    }
    

    // CHECK THAT THIS GROUP BELONGS TO YOU
    // if (theGroup.creator !== event.locals.profile.id) {
    //     throw redirect(303, "/")
    // } // groups don't have creators yet


    return { 
        theGroup, 
        statTypes, 
        rawStatTypes,
        occurrenceTypes, 
        dbErrors
    }

}





export const actions: Actions = {


    default: async (event) => {
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!event.locals.profile) {
            throw redirect(300, "/")
        }

       throw redirect(300, '/')

    }
}