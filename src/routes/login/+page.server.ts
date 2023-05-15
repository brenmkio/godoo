import { AuthApiError, type Provider } from "@supabase/supabase-js"
import type { Actions } from "./$types"
import { fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from './$types';
import { setError, superValidate } from "sveltekit-superforms/server";
import { loginSchema } from "$lib/zod";

export const load: PageServerLoad = async (event) => {
    const backTo = event.url.searchParams.get('backTo') || '/'

    if (event.locals.profile) {
        throw redirect(303, "/")
    }

    const form = await superValidate(event, loginSchema)

    return {
        backTo, form
    }
}

const OAUTH_PROVIDERS = ["google", "discord"]

export const actions: Actions = {

    login: async (event) => {

        const form = await superValidate(event, loginSchema)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj
        if (!form.valid) {
            return fail(400, { form })
        }

        const provider = event.url.searchParams.get('provider') as Provider
        const returnUrl = String(event.url.searchParams.get('returnUrl'))

        if (provider) {
            if (!OAUTH_PROVIDERS.includes(provider)) {
                return fail(400, {
                    error: 'Provider not supported.'
                })
            }
            const { data, error: err } = await event.locals.supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: returnUrl, // this will work better when login is a component, not a route... if it stays a route, gotta do some logic to keep track of where they were before login
                }
            })

            if (err) {
                console.log(err)
                return fail(400, { 
                    message: 'Something went wrong.' + err
                })
            }

            throw redirect(303, data.url)
        }

        const { data, error: err } = await event.locals.supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password,
        })

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                setError(form, null, 'Invalid credentials')
                return fail(400, { form })
            }
            setError(form, null, 'Server error, please try again later.')
            return fail(500, { form })
        }

        throw redirect(303, returnUrl)
    }

}