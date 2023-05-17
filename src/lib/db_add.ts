import prisma from '$lib/prisma'
import type { Event, Group, Prisma, Profile, Scene, User } from '@prisma/client';
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