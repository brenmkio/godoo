<script lang="ts">
	import type { Provider } from "@supabase/supabase-js";
    import type { PageData, SubmitFunction } from './$types'
	import { enhance } from "$app/forms";

    export let data: PageData

    const signInWithProvider = async (provider: Provider) => {
        const { data: authData, error } = await data.supabase.auth.signInWithOAuth({
            provider: provider
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
    <form action="?/login" method="POST">
        <label for=""> Email </label>
        <input type="text" name="email" />
        <label for=""> Password </label>
        <input type="password" name="password" />
        <button type="submit">Login</button>
    </form>
    <form method="POST" use:enhance={submitSocialLogin}>
        <button formaction="?/login&provider=google">Google</button>
        <button formaction="?/login&provider=discord">Discord</button>
    </form>
</main>