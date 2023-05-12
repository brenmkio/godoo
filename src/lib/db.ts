
import prisma from '$lib/prisma'
import type { Profile, User } from '@prisma/client';
import type { DBReturn } from './types';

export async function DB_getUserByUsername(username: string): Promise<DBReturn<User>> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })

        if (!user) {
            return { 
                db_data: null,
                db_error: { 
                    statusCode: 500,
                    name: 'get user from username',
                    message: `No user ${username} was found`,
                } 
            }
        } 

        return { db_data: user, db_error: null };
    } catch (error) {
        return { 
            db_data: null,
            db_error: { 
                statusCode: 500,
                name: 'get user from username',
                message: `get user from username error: ${String(error)}`,
            } 
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function DB_getUserByEmail(email: string): Promise<DBReturn<User>> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })

        if (!user) {
            return { 
                db_data: null,
                db_error: { 
                    statusCode: 500,
                    name: 'get user from email',
                    message: `No user ${email} was found`,
                } 
            }
        } 

        return { db_data: user, db_error: null }
    } catch (error) {
        return { 
            db_data: null,
            db_error: { 
                statusCode: 500,
                name: 'get user from email',
                message: `get user from email error: ${String(error)}`,
            } 
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function DB_getProfileByHandle(handle: string) {
    try {
        const profile = await prisma.profile.findFirst({
            where: {
                handle: handle,
            },
        })

        if (!profile) {
            return { 
                error: { 
                    statusCode: 500,
                    name: 'get profile from handle',
                    message: `No profile ${handle} was found`,
                } 
            }
        } 

        return { profile };
    } catch (error) {
        return { 
            error: { 
                statusCode: 500,
                name: 'get profile from handle',
                message: `get profile from handle error: ${String(error)}`,
            } 
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function DB_getProfileByID(id: number): Promise<DBReturn<Profile>> {
    const ret: DBReturn<Profile> = {
        db_data: null,
        db_error: null
    }
    try {
        const profile = await prisma.profile.findFirst({
            where: {
                id: id,
            },
        })

        if (!profile) {
            ret.db_error = { 
                statusCode: 500,
                name: 'get profile from id',
                message: `No profile ${id} was found`,
            } 
            return ret
        } 
        ret.db_data = profile
        return ret
    } catch (error) {
        ret.db_error = { 
            statusCode: 500,
            name: 'get profile from id',
            message: `get profile from id error: ${String(error)}`,
        } 
        return ret
    } finally {
        await prisma.$disconnect()
    }
}


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