

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

export function objConvertNullToUndefined(obj: Object) {
    const sanitized = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value])
    )
    return sanitized
}

export function myBaseURL() {
    const prodURL = "https://godoo.vercel.app"
    const devURL = "http://localhost:5173"
    if (process.env.NODE_ENV === "development") {
        return devURL
    }
    return prodURL
}
