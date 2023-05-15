<script lang="ts">
	import type { Provider } from "@supabase/supabase-js";
    import type { PageData, SubmitFunction } from './$types'
	import { enhance } from "$app/forms";
    import { sanitizeRoute, myBaseURL } from "$lib/utilsClient";

    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { loginSchema } from '$lib/zod'

    export let data: PageData

    const { backTo } = data

    const returnUrl = myBaseURL() + "/" + sanitizeRoute(backTo)

    const { form, enhance: superEnhance, errors, constraints } = superForm(data.form, {
        taintedMessage: null,
        validators: loginSchema
    })

    const signInWithProvider = async (provider: Provider) => {
        const { data: authData, error } = await data.supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: returnUrl,
            }
        })
    }

    const submitSocialLogin: SubmitFunction = async ({ action, cancel }) => {
        switch (action.searchParams.get('provider')) {
            case 'google':
                await signInWithProvider('google')
                break
            case 'discord':
                await signInWithProvider('discord')
                break
            default:
                break
        }
        cancel() // this is because we don't actually need a server side form submission
    }

</script>

<main>
    <h1>Login</h1>

    <SuperDebug data={$form} />

    <form action="?/login&returnUrl={returnUrl}" method="POST" use:superEnhance class="flex flex-col w-64">
        <label for="email">Email</label>
        <input
            type="text"
            name="email"
            data-invalid={$errors.email}
            bind:value={$form.email}
            {...$constraints.email} />
        {#if $errors.email}
            <p class="text-red-500">{$errors.email}</p>
        {/if}

        <label for="password">Password</label>
        <input
            type="password"
            name="password"
            data-invalid={$errors.password}
            bind:value={$form.password}
            {...$constraints.password} />
        {#if $errors.password}
            <p class="text-red-500">{$errors.password}</p>
        {/if}

        <button type="submit">Login</button>
        {#if $errors._errors}
            <p class="text-red-500">{$errors._errors}</p>
        {/if}
    </form>


    <form method="POST" use:enhance={submitSocialLogin}>
        <button formaction="?/login&provider=google&returnUrl={returnUrl}">Google</button>
        <button formaction="?/login&provider=discord&returnUrl={returnUrl}">Discord</button>
    </form>
</main>