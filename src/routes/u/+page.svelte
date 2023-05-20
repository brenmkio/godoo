<script lang="ts">

    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { editUserSchema } from '$lib/zod';

    export let data: PageData

    let usernameAvailable: boolean | null = null
    let inputElement: HTMLInputElement

    let hasBeenTouched = false
    let hasBeenSubmitted = false

    const usernameMax = 20
    const usernameMin = 3

    const { form, enhance, errors, constraints, message } = superForm(data.form, {
        taintedMessage: null,
        validators: editUserSchema,
        validationMethod: 'oninput',
        delayMs: 100,
        invalidateAll: true,
    })

    let warningRequired: boolean | null = null

    $: {
        warningRequired = false

        if ($form.username) {
            if ($form.username.length > usernameMax) warningRequired = true
            if ($form.username.length < usernameMin) warningRequired = true
        } else warningRequired = true

    }

    let loading = false

    const { myUser, profiles, myProfile } = data
   

    const usernameInput = async () => { 
        hasBeenTouched = true
        usernameAvailable = false
        if (!$errors.username && $form.username && $form.username.length >= usernameMin && $form.username.length <= usernameMax) {
            usernameAvailable = null

            const res = await fetch('/api/checkUsernameAvailability?username=' + $form.username)
            const usernameRes = await res.json()
            usernameAvailable = usernameRes.available

        }

        if (inputElement && document.activeElement === inputElement) {
            inputElement.blur()
            inputElement.focus()
        }
    }

    const otherInput = async () => {
        hasBeenTouched = true
    }

    const receiveSubmit = async () => {
        hasBeenTouched = false
        hasBeenSubmitted = true
        $message = null
    }


</script>





<h1>Edit Profile</h1>
<p>Welcome {myUser?.username}</p>

<SuperDebug data={$form} />


<form method="POST" action="?/editUser" class="flex flex-col w-64">
    <label for="name">Username</label>
    <input
        type="text"
        name="username"
        data-invalid={$errors.username}
        bind:this={inputElement}
        bind:value={$form.username}
        on:input={usernameInput}
        {...$constraints.username} />
    {#if $form.username}
        {#if $form.username.length > usernameMax}
            <p class="text-red-500 ml-2">+{$form.username.length - usernameMax}</p>
        {:else if $form.username.length === usernameMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.username.length > usernameMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{usernameMax - $form.username.length}</p>
        {:else if $form.username.length > usernameMax / 2}
            <p class="text-yellow-600 ml-2">{usernameMax - $form.username.length}</p>
        {/if}
    {/if}
    {#if $form.username !== myUser?.username}
        {#if $errors.username}
            <p class="text-yellow-600">{$errors.username}</p>
        {:else if !$form.username}
            <p class="text-yellow-600">username must be {usernameMin} characters or more</p>
        {:else if $form.username && $form.username.length < usernameMin}
            <p class="text-yellow-600">username must be {usernameMin} characters or more</p>
        {:else if $form.username && $form.username.length > usernameMax}
            <p class="text-yellow-600">username must be {usernameMax} characters or fewer</p>
        {:else if usernameAvailable === false}
            <p class="text-yellow-600">username unavailable!</p>
        {:else if usernameAvailable}
            <p class="text-green-500">username available!</p>
        {:else if $form.username && $form.username.length > 0}
            <p class="text-yellow-600">checking username...</p>
        {:else }
            <p class="text-yellow-600">username will not be updated</p>
        {/if}
    {/if}

    
    <div>
        {#if usernameAvailable === null && $form.username !== myUser?.username}
            <button disabled>Submit</button>
        {:else}
            <button on:click={receiveSubmit}>Submit</button>
        {/if}
    </div>

    {#if $message && !hasBeenTouched}
        <p class="text-green-500">{$message}</p>
    {:else if hasBeenSubmitted}
        <p class="text-yellow-600">Updating user data...</p>
    {/if}
    {#if $errors._errors}
        <p class="text-red-500">{$errors._errors}</p>
    {:else if warningRequired && hasBeenTouched}
        <p class="text-yellow-600">Any fields with errors won't be updated</p>
    {/if}
</form>

{#if profiles}
    {#each profiles as profile }
        <div class="flex space-x-2">
            <p>#{profile.id}: </p>
            <a href="/p/{profile.handle}">@{profile.handle}</a>
            <p> - {profile.name}</p>
            {#if profile.id === myProfile?.id}
                <p>CURRENT PROFILE</p>
            {:else}
                <form action="/api/profileLogin?p={profile.handle}" method="POST">
                    <button>Log in</button>
                </form>
            {/if}
        </div>
        
    {/each}
{:else}
    <p>{myUser?.username} has no profiles</p>
{/if}

