
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

