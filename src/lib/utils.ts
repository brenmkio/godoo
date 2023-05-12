

import { DB_getUserByUsername } from './db';

export function sanitizeRoute(route: string) {
    const acceptableRoutes: string[] = [
        'new-p',
        'u',
    ]
    const routeArr = route.split("/")
    if (acceptableRoutes.includes(routeArr[0])) {
        return route
    }
    return ''
}

export async function generateTempUsername(email: string): Promise<string> {
    let baseName = email.split('@')[0].replace(/\W/g, '').slice(0, 12)
    let baseName7 = baseName.slice(0, 7)
    let username = baseName
    let suffix = 0

    while (true) {
        const { db_data: user } = await DB_getUserByUsername(username)

        if (!user) {
            break
        }

        suffix += 1
        username = `${baseName7}${suffix}`
    }

    return username
}