
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