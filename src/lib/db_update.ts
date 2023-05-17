import prisma from '$lib/prisma'
import type { Event, Group, Prisma, Profile, User } from '@prisma/client';
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





// update user
// update profile
// update event
// update group








export async function DB_updateUser(
    id: number,
    data: Prisma.UserUpdateInput
  ): Promise<DBReturn<User>> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      })
  
      return { db_data: updatedUser, db_error: null }
    } catch (error) {
      return {
        db_data: null,
        db_error: {
          statusCode: 500,
          name: `update user error`,
          message: `update user error: ${String(error)}`,
        },
      }
    }
}

export async function DB_updateProfile(
      id: number,
      data: Prisma.ProfileUpdateInput
    ): Promise<DBReturn<Profile>> {
      try {
        const updatedProfile = await prisma.profile.update({
          where: { id },
          data,
        })
    
        return { db_data: updatedProfile, db_error: null }
      } catch (error) {
        return {
          db_data: null,
          db_error: {
            statusCode: 500,
            name: `update profile error`,
            message: `update profile error: ${String(error)}`,
          },
        }
      }
  } 



  export async function DB_updateEvent(
      id: number,
      data: Prisma.EventUpdateInput
    ): Promise<DBReturn<Event>> {
      try {
        const updatedEvent = await prisma.event.update({
          where: { id },
          data,
        })
    
        return { db_data: updatedEvent, db_error: null }
      } catch (error) {
        return {
          db_data: null,
          db_error: {
            statusCode: 500,
            name: `update event error`,
            message: `update event error: ${String(error)}`,
          },
        }
      }
  } 



  export async function DB_updateGroup(
      id: number,
      data: Prisma.GroupUpdateInput
    ): Promise<DBReturn<Group>> {
      try {
        const updatedGroup = await prisma.group.update({
          where: { id },
          data,
        })
    
        return { db_data: updatedGroup, db_error: null }
      } catch (error) {
        return {
          db_data: null,
          db_error: {
            statusCode: 500,
            name: `update group error`,
            message: `update group error: ${String(error)}`,
          },
        }
      }
    } 

