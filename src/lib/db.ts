
import prisma from '$lib/prisma'
import type { Prisma, Profile, User } from '@prisma/client';
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

export async function DB_getProfileByID(id: string): Promise<DBReturn<Profile>> {
    const id_num = Number(id)
    return queryDB({
        queryFunc: (id) => prisma.profile.findFirst({
            where: { id: id_num }
        }),
        name: 'profile from id',
        err_msg: `No profile ${id} was found`,
        value: id
    })
}





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










// export async function DB_getUserByUsername(username: string): Promise<DBReturn<User>> {
//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 username: username,
//             },
//         })

//         if (!user) {
//             return { 
//                 db_data: null,
//                 db_error: { 
//                     statusCode: 500,
//                     name: 'get user from username',
//                     message: `No user ${username} was found`,
//                 } 
//             }
//         } 

//         return { db_data: user, db_error: null };
//     } catch (error) {
//         return { 
//             db_data: null,
//             db_error: { 
//                 statusCode: 500,
//                 name: 'get user from username',
//                 message: `get user from username error: ${String(error)}`,
//             } 
//         }
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// export async function DB_getUserByEmail(email: string): Promise<DBReturn<User>> {
//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 email: email,
//             },
//         })

//         if (!user) {
//             return { 
//                 db_data: null,
//                 db_error: { 
//                     statusCode: 500,
//                     name: 'get user from email',
//                     message: `No user ${email} was found`,
//                 } 
//             }
//         } 

//         return { db_data: user, db_error: null }
//     } catch (error) {
//         return { 
//             db_data: null,
//             db_error: { 
//                 statusCode: 500,
//                 name: 'get user from email',
//                 message: `get user from email error: ${String(error)}`,
//             } 
//         }
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// export async function DB_getProfileByHandle(handle: string) {
//     try {
//         const profile = await prisma.profile.findFirst({
//             where: {
//                 handle: handle,
//             },
//         })

//         if (!profile) {
//             return { 
//                 error: { 
//                     statusCode: 500,
//                     name: 'get profile from handle',
//                     message: `No profile ${handle} was found`,
//                 } 
//             }
//         } 

//         return { profile };
//     } catch (error) {
//         return { 
//             error: { 
//                 statusCode: 500,
//                 name: 'get profile from handle',
//                 message: `get profile from handle error: ${String(error)}`,
//             } 
//         }
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// export async function DB_getProfileByID(id: number): Promise<DBReturn<Profile>> {
//     const ret: DBReturn<Profile> = {
//         db_data: null,
//         db_error: null
//     }
//     try {
//         const profile = await prisma.profile.findFirst({
//             where: {
//                 id: id,
//             },
//         })

//         if (!profile) {
//             ret.db_error = { 
//                 statusCode: 500,
//                 name: 'get profile from id',
//                 message: `No profile ${id} was found`,
//             } 
//             return ret
//         } 
//         ret.db_data = profile
//         return ret
//     } catch (error) {
//         ret.db_error = { 
//             statusCode: 500,
//             name: 'get profile from id',
//             message: `get profile from id error: ${String(error)}`,
//         } 
//         return ret
//     } finally {
//         await prisma.$disconnect()
//     }
// }


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