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







// check handle
// check username
// check event slug
// check group slug








export async function DB_checkHandle(testHandle: string) {
    try {
        const handle = await prisma.profile.findFirst({
            where: {
                handle: testHandle,
            },
        })

        if (!handle) {
            return { exists: false }
        } 

        return { exists: true }
    } catch (error) {
        return { 
            error: { 
                statusCode: 500,
                name: 'checking handle',
                message: `checking handle error: ${String(error)}`,
            } 
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function DB_checkUsername(testUsername: string) {
  try {
      const username = await prisma.user.findFirst({
          where: {
              username: testUsername,
          },
      })

      if (!username) {
          return { exists: false }
      } 

      return { exists: true }
  } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'checking username',
              message: `checking username error: ${String(error)}`,
          } 
      }
  } finally {
      await prisma.$disconnect()
  }
}

export async function DB_checkEventSlug(testSlug: string) {
  try {
      const slug = await prisma.event.findFirst({
          where: {
              slug: testSlug,
          },
      })

      if (!slug) {
          return { exists: false }
      } 

      return { exists: true }
  } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'checking slug',
              message: `checking slug error: ${String(error)}`,
          } 
      }
  } finally {
      await prisma.$disconnect()
  }
}

export async function DB_checkGroupSlug(testSlug: string) {
  try {
      const slug = await prisma.group.findFirst({
          where: {
              slug: testSlug,
          },
      })

      if (!slug) {
          return { exists: false }
      } 

      return { exists: true }
  } catch (error) {
      return { 
          error: { 
              statusCode: 500,
              name: 'checking slug',
              message: `checking slug error: ${String(error)}`,
          } 
      }
  } finally {
      await prisma.$disconnect()
  }
}

