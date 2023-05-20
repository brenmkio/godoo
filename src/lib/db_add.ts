import prisma from '$lib/prisma'
import type { Event, Group, OccurrenceType, Prisma, Profile, RawStatType, Scene, StatModifier, StatType, User } from '@prisma/client';
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









// add user
// add profile
// add event
// add group
// add scene

// add raw stat type
// add occurrence type
// add stat type







export async function DB_addUser(data: Prisma.UserCreateInput): Promise<DBReturn<User>> {
    try {
      const newUser = await prisma.user.create({ data });
  
      return { db_data: newUser, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add user error`,
          message: `add user error: ${String(error)}`,
        } 
      }
    }
}

export async function DB_addProfile(data: Prisma.ProfileCreateInput): Promise<DBReturn<Profile>> {
    try {
      const newProfile = await prisma.profile.create({ data });
  
      return { db_data: newProfile, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add profile error`,
          message: `add profile error: ${String(error)}`,
        } 
      }
    }
  }

  export async function DB_addEvent(data: Prisma.EventCreateInput): Promise<DBReturn<Event>> {
    try {
      const newEvent = await prisma.event.create({ data });
  
      return { db_data: newEvent, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add event error`,
          message: `add event error: ${String(error)}`,
        } 
      }
    }
  }

  export async function DB_addGroup(data: Prisma.GroupCreateInput): Promise<DBReturn<Group>> {
    try {
      const newGroup = await prisma.group.create({ data });
  
      return { db_data: newGroup, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add group error`,
          message: `add group error: ${String(error)}`,
        } 
      }
    }
  }

  export async function DB_addScene(data: Prisma.SceneCreateInput): Promise<DBReturn<Scene>> {
    try {
      const newScene = await prisma.scene.create({ data });
  
      return { db_data: newScene, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add scene error`,
          message: `add scene error: ${String(error)}`,
        } 
      }
    }
  }




  export async function DB_addRawStatType(data: Prisma.RawStatTypeCreateInput): Promise<DBReturn<RawStatType>> {
    try {
      const newRawStat = await prisma.rawStatType.create({ data });
  
      return { db_data: newRawStat, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add rawStat error`,
          message: `add rawStat error: ${String(error)}`,
        } 
      }
    }
  }


  export async function DB_addOccurrenceType(data: Prisma.OccurrenceTypeCreateInput): Promise<DBReturn<OccurrenceType>> {
    try {
      const newOccurrenceType = await prisma.occurrenceType.create({ data });
  
      return { db_data: newOccurrenceType, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add occurrenceType error`,
          message: `add occurrenceType error: ${String(error)}`,
        } 
      }
    }
  }



  export async function DB_addStatModifier(data: Prisma.StatModifierCreateInput): Promise<DBReturn<StatModifier>> {
    try {
      const newstatModifier = await prisma.statModifier.create({ data });
  
      return { db_data: newstatModifier, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add statModifier error`,
          message: `add statModifier error: ${String(error)}`,
        } 
      }
    }
  }




  export async function DB_addStatType(data: Prisma.StatTypeCreateInput): Promise<DBReturn<StatType>> {
    try {
      const newStatType = await prisma.statType.create({ data });
  
      return { db_data: newStatType, db_error: null };
    } catch (error) {
      return { 
        db_data: null,
        db_error: { 
          statusCode: 500,
          name: `add StatType error`,
          message: `add StatType error: ${String(error)}`,
        } 
      }
    }
  }