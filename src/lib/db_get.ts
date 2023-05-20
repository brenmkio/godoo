import prisma from '$lib/prisma'
import type { Event, Group, OccurrenceType, Prisma, Profile, RawStatType, Scene, StatType, User } from '@prisma/client';
import type { DBReturn, DBError } from './types';


async function queryDB<T>({ queryFunc, name, err_msg, value }: { 
    queryFunc: (value: string) => Promise<T | null>, 
    name: string, 
    err_msg: string,
    value: string

}): Promise<DBReturn<T>> {
    try {
        const result = await queryFunc(value)
        if (!result) {
            return {
                db_data: null,
                db_error: {
                    statusCode: 500,
                    name: name,
                    message: err_msg,
                }
            }
        }
        return { db_data: result, db_error: null }
    } catch (error) {
        return {
            db_data: null,
            db_error: {
                statusCode: 500,
                name: name,
                message: `${name} error: ${error}`
            }
        }
    } finally {
        await prisma.$disconnect()
    }
}





// USER
// PROFILE
// EVENT
// GROUP
// SCENE

// RAW STAT TYPES 
// STAT TYPES








// USER


export async function DB_getUserByUsername(username: string): Promise<DBReturn<User>> {
    return queryDB({
        queryFunc: (username) => prisma.user.findFirst({
            where: { username }
        }),
        name: 'user from username',
        err_msg: `No user ${username} was found`,
        value: username
    })
}

export async function DB_getUserByEmail(email: string): Promise<DBReturn<User>> {
    return queryDB({
        queryFunc: (email) => prisma.user.findFirst({
            where: { email }
        }),
        name: 'user from email',
        err_msg: `No user ${email} was found`,
        value: email
    })
}
















// PROFILE


export async function DB_getProfileByHandle(handle: string): Promise<DBReturn<Profile>> {
    return queryDB({
        queryFunc: (handle) => prisma.profile.findFirst({
            where: { handle }
        }),
        name: 'profile from handle',
        err_msg: `No profile ${handle} was found`,
        value: handle
    })
}

export async function DB_getProfileByID(profileId: number): Promise<DBReturn<Profile>> {
    return queryDB({
        queryFunc: (id) => prisma.profile.findFirst({
            where: { id: profileId }
        }),
        name: 'profile from id',
        err_msg: `No profile ${profileId} was found`,
        value: profileId.toString()
    })
}
  

export async function DB_getProfilesByUserId(
    userId: number
  ): Promise<DBReturn<Profile[]>> {
    try {
      const profiles = await prisma.profile.findMany({
        where: { parent_id: userId }
      })
  
      return { db_data: profiles, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get profiles error`,
          message: `There was a problem getting profiles: ${String(error)}`,
        },
      }
    }
}   
  

export async function DB_getAllProfiles(): Promise<DBReturn<Profile[]>> {
    try {
      const profiles = await prisma.profile.findMany({
        // where: { parent_id: userId }
      })
  
      return { db_data: profiles, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get profiles error`,
          message: `There was a problem getting all profiles: ${String(error)}`,
        },
      }
    }
}   

export async function DB_getAllProfilesForUserId(userId: number): Promise<DBReturn<Profile[]>> {
    try {
      const profiles = await prisma.profile.findMany({
        where: { parent_id: userId }
      })
  
      return { db_data: profiles, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get profiles error`,
          message: `There was a problem getting all user's profiles: ${String(error)}`,
        },
      }
    }
}   










// EVENT


export async function DB_getEventBySlug(slug: string): Promise<DBReturn<Event>> {
    return queryDB({
        queryFunc: (id) => prisma.event.findFirst({
            where: { slug: slug }
        }),
        name: 'event from slug',
        err_msg: `No event ${slug} was found`,
        value: slug
    })
}

export async function DB_getEventById(eventId: number): Promise<DBReturn<Event>> {
    return queryDB({
        queryFunc: (id) => prisma.event.findFirst({
            where: { id: eventId }
        }),
        name: 'event from eventId',
        err_msg: `No event ${eventId} was found`,
        value: eventId.toString()
    })
}

export async function DB_getAllEvents(): Promise<DBReturn<Event[]>> {
  try {
    const events = await prisma.event.findMany({
      // where: { parent_id: userId }
    })

    return { db_data: events, db_error: null }
  } catch (error) {
    return {
      db_data: null,
      db_error: {
        statusCode: 500,
        name: `get events error`,
        message: `There was a problem getting all events: ${String(error)}`,
      },
    }
  }
}   

export async function DB_getAllEventsProfileCanContinue(profileId: number): Promise<DBReturn<Event[]>> {
  try {
    const events = await prisma.event.findMany({
      where: { creator: profileId }
    })

    return { db_data: events, db_error: null }
  } catch (error) {
    return {
      db_data: null,
      db_error: {
        statusCode: 500,
        name: `get continuation events error`,
        message: `There was a problem getting all continuable events: ${String(error)}`,
      },
    }
  }
}   














// GROUP
 
export async function DB_getGroupBySlug(slug: string): Promise<DBReturn<Group>> {
  return queryDB({
      queryFunc: (id) => prisma.group.findFirst({
          where: { slug: slug }
      }),
      name: 'group from slug',
      err_msg: `No group ${slug} was found`,
      value: slug
  })
}  
 
export async function DB_getGroupById(groupId: number): Promise<DBReturn<Group>> {
  return queryDB({
      queryFunc: (id) => prisma.group.findFirst({
          where: { id: groupId }
      }),
      name: 'group from groupId',
      err_msg: `No group ${groupId} was found`,
      value: groupId.toString()
  })
}

export async function DB_getAllGroups(): Promise<DBReturn<Group[]>> {
  try {
    const groups = await prisma.group.findMany({
      // where: { parent_id: userId }
    })

    return { db_data: groups, db_error: null }
  } catch (error) {
    return {
      db_data: null,
      db_error: {
        statusCode: 500,
        name: `get groups error`,
        message: `There was a problem getting all groups: ${String(error)}`,
      },
    }
  }
}   










// SCENE

 
export async function DB_getSceneBySlug(slug: string): Promise<DBReturn<Scene>> {
    return queryDB({
        queryFunc: (id) => prisma.scene.findFirst({
            where: { slug: slug }
        }),
        name: 'scene from slug',
        err_msg: `No scene ${slug} was found`,
        value: slug
    })
  }  


export async function DB_getAllScenes(): Promise<DBReturn<Scene[]>> {
    try {
      const scenes = await prisma.scene.findMany({
        // where: { parent_id: userId }
      })
  
      return { db_data: scenes, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `get scenes error`,
          message: `There was a problem getting all scenes: ${String(error)}`,
        },
      }
    }
  }   







// RAW STAT TYPES


export async function DB_getAllRawStatTypesFromActivity(activity: string): Promise<DBReturn<RawStatType[]>> {
    return queryDB({
        queryFunc: (activity) => prisma.rawStatType.findMany({
            where: { activity }
        }),
        name: 'all raw stat types from activity',
        err_msg: `No raw stat type from activity ${activity} was found`,
        value: activity
    })
}


export async function DB_getAllRawStatTypesFromOccurrenceTypes(occurrenceTypeIdStrs: string[]): Promise<DBReturn<RawStatType[]>> {

    const occurrenceTypeIds = occurrenceTypeIdStrs.map(Number)

    try {
        const statModifiers = await prisma.statModifier.findMany({
            where: {
                occurrence_type_id: {
                    in: occurrenceTypeIds
                }
            },
            include: {
                RawStatType: true
            }
        })
        
        const rawStatTypes: RawStatType[] = statModifiers.map(modifier => modifier.RawStatType).filter((rawStatType): rawStatType is RawStatType => rawStatType !== null)

        return { db_data: rawStatTypes, db_error: null }
    } catch (error) {
        return { 
            db_data: null, 
            db_error: { 
              statusCode: 500,
              name: `get raw stat types from occurrence types error`,
              message: `There was a problem getting raw stat types from occurrence types: ${String(error)}`,
            } 
        }
    }
}



// STAT TYPES


export async function DB_getAllStatTypesFromActivity(activity: string): Promise<DBReturn<StatType[]>> {
    return queryDB({
        queryFunc: (activity) => prisma.statType.findMany({
            where: { activity }
        }),
        name: 'all stat types from activity',
        err_msg: `No stat type from activity ${activity} was found`,
        value: activity
    })
}



// OCCURRENCE TYPES


export async function DB_getAllOccurrenceTypesFromActivity(activity: string): Promise<DBReturn<OccurrenceType[]>> {
    return queryDB({
        queryFunc: (activity) => prisma.occurrenceType.findMany({
            where: { activity }
        }),
        name: 'all occurrence types from activity',
        err_msg: `No occurrence type from activity ${activity} was found`,
        value: activity
    })
}


