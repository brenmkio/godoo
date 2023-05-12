import { AuthApiError, type Provider } from "@supabase/supabase-js"
import type { Actions } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const backTo = url.searchParams.get('backTo') || '/'

    return {
        backTo
    }
}

const OAUTH_PROVIDERS = ["google", "discord"]

export const actions: Actions = {

    login: async ({ request, locals, url }) => {

        const provider = url.searchParams.get('provider') as Provider
        const returnUrl = String(url.searchParams.get('returnUrl'))

        if (provider) {
            if (!OAUTH_PROVIDERS.includes(provider)) {
                return fail(400, {
                    error: 'Provider not supported.'
                })
            }
            const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: returnUrl, // this will work better when login is a component, not a route... if it stays a route, gotta do some logic to keep track of where they were before login
                }

            })

            if (err) {
                console.log(err)
                return fail(400, {
                    message: 'Something went wrong.'
                })
            }

            // all good up to here
            console.log("should i page refresh manually here?")

            throw redirect(303, data.url)
        }

        const body = Object.fromEntries(await request.formData())

        const { data, error: err } = await locals.supabase.auth.signInWithPassword({
            email: body.email as string,
            password: body.password as string,
        })

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                return fail(400, {
                    error: 'Invalid credentials'
                })
            }
            return fail(500, {
                message: 'Server error. Try again later.'
            })
        }

        throw redirect(303, returnUrl)
    }

}