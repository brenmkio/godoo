<script lang="ts">

    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { editProfileSchema } from '$lib/zod';

    export let data: PageData

    const { profileCount } = data

    let handleAvailable: boolean | null = null
    let inputElement: HTMLInputElement

    let hasBeenTouched = false
    let hasBeenSubmitted = false

    const handleMax = 20
    const handleMin = 3
    const nameMax = 20
    const nameMin = 1
    const pronounsMax = 20
    const bioMax = 200
    const locationMax = 40

    const { form, enhance, errors, constraints, message } = superForm(data.form, {
        taintedMessage: null,
        validators: editProfileSchema,
        validationMethod: 'oninput',
        delayMs: 100,
        invalidateAll: true,
    })

    let warningRequired: boolean | null = null

    $: {
        warningRequired = false

        if ($form.name) {
            if ($form.name.length > nameMax) warningRequired = true
            if ($form.name.length < nameMin) warningRequired = true
        } else warningRequired = true

        if ($form.handle) {
            if ($form.handle.length > handleMax) warningRequired = true
            if ($form.handle.length < handleMin) warningRequired = true
        } else warningRequired = true

        if ($form.pronouns && $form.pronouns.length > pronounsMax) warningRequired = true

        if ($form.bio && $form.bio.length > bioMax) warningRequired = true

        if ($form.location && $form.location.length > locationMax) warningRequired = true
    }

    let loading = false

    const { myUser, myProfile, session } = data
   

    const handleInput = async () => { 
        hasBeenTouched = true
        handleAvailable = false
        if (!$errors.handle && $form.handle && $form.handle.length >= handleMin && $form.handle.length <= handleMax) {
            handleAvailable = null

            const res = await fetch('/api/checkHandleAvailability?handle=' + $form.handle)
            const handleRes = await res.json()
            handleAvailable = handleRes.available

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
<p>Welcome {myProfile?.name}, you have {profileCount} profile{profileCount === 1 ? "" : "s"}</p>

<SuperDebug data={$form} />


<form method="POST" action="?/submitProfile" class="flex flex-col w-64">
    <label for="name">Handle</label>
    <input
        type="text"
        name="handle"
        data-invalid={$errors.handle}
        bind:this={inputElement}
        bind:value={$form.handle}
        on:input={handleInput}
        {...$constraints.handle} />
    {#if $form.handle}
        {#if $form.handle.length > handleMax}
            <p class="text-red-500 ml-2">+{$form.handle.length - handleMax}</p>
        {:else if $form.handle.length === handleMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.handle.length > handleMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{handleMax - $form.handle.length}</p>
        {:else if $form.handle.length > handleMax / 2}
            <p class="text-yellow-600 ml-2">{handleMax - $form.handle.length}</p>
        {/if}
    {/if}
    {#if $form.handle !== myProfile?.handle}
        {#if $errors.handle}
            <p class="text-yellow-600">{$errors.handle}</p>
        {:else if !$form.handle}
            <p class="text-yellow-600">handle must be {handleMin} characters or more</p>
        {:else if $form.handle && $form.handle.length < handleMin}
            <p class="text-yellow-600">handle must be {handleMin} characters or more</p>
        {:else if $form.handle && $form.handle.length > handleMax}
            <p class="text-yellow-600">handle must be {handleMax} characters or fewer</p>
        {:else if handleAvailable === false}
            <p class="text-yellow-600">handle unavailable!</p>
        {:else if handleAvailable}
            <p class="text-green-500">handle available!</p>
        {:else if $form.handle && $form.handle.length > 0}
            <p class="text-yellow-600">checking handle...</p>
        {:else }
            <p class="text-yellow-600">handle will not be updated</p>
        {/if}
    {/if}

    <label for="name">Display Name</label>
    <input
        type="text"
        name="name"
        data-invalid={$errors.name}
        on:input={otherInput}
        bind:value={$form.name}
        {...$constraints.name} />
    {#if $form.name}
        {#if $form.name.length > nameMax}
            <p class="text-red-500 ml-2">+{$form.name.length - nameMax}</p>
        {:else if $form.name.length === nameMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.name.length > nameMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{nameMax - $form.name.length}</p>
        {:else if $form.name.length > nameMax / 2}
            <p class="text-yellow-600 ml-2">{nameMax - $form.name.length}</p>
        {/if}
    {/if}
    {#if $errors.name}
        <p class="text-red-500">{$errors.name}</p>
    {:else if !$form.name}
        <p class="text-yellow-600">name must not be empty</p>
    {:else if $form.name && $form.name.length < nameMin}
        <p class="text-yellow-600">name must be {nameMin} characters or more</p>
    {:else if $form.name && $form.name.length > nameMax}
        <p class="text-yellow-600">name must be {nameMax} characters or fewer</p>
    {/if}

    <label for="pronouns">Pronouns</label>
    <input
        type="text"
        name="pronouns"
        data-invalid={$errors.pronouns}
        on:input={otherInput}
        bind:value={$form.pronouns}
        {...$constraints.pronouns} />
    {#if $form.pronouns}
        {#if $form.pronouns.length > pronounsMax}
            <p class="text-red-500 ml-2">+{$form.pronouns.length - pronounsMax}</p>
        {:else if $form.pronouns.length === pronounsMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.pronouns.length > pronounsMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{pronounsMax - $form.pronouns.length}</p>
        {:else if $form.pronouns.length > pronounsMax / 2}
            <p class="text-yellow-600 ml-2">{pronounsMax - $form.pronouns.length}</p>
        {/if}
    {/if}
    {#if $errors.pronouns}
        <p class="text-red-500">{$errors.pronouns}</p>
    {:else if $form.pronouns && $form.pronouns.length > pronounsMax}
        <p class="text-yellow-600">pronouns must be {pronounsMax} characters or fewer</p>
    {/if}

    <label for="bio">Bio</label>
    <textarea
        name="bio"
        rows="5"
        cols="40"
        data-invalid={$errors.bio}
        on:input={otherInput}
        bind:value={$form.bio}
        {...$constraints.bio} />
    {#if $form.bio}
        {#if $form.bio.length > bioMax}
            <p class="text-red-500 ml-2">+{$form.bio.length - bioMax}</p>
        {:else if $form.bio.length === bioMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.bio.length > bioMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{bioMax - $form.bio.length}</p>
        {/if}
    {/if}
    {#if $errors.bio}
        <p class="text-red-500">{$errors.bio}</p>
    {:else if $form.bio && $form.bio.length > bioMax}
        <p class="text-yellow-600">bio must be {bioMax} characters or fewer</p>
    {/if}

    <label for="location">Location</label>
    <input
        type="text"
        name="location"
        data-invalid={$errors.location}
        on:input={otherInput}
        bind:value={$form.location}
        {...$constraints.location} />
    {#if $form.location}
        {#if $form.location.length > locationMax}
            <p class="text-red-500 ml-2">+{$form.location.length - locationMax}</p>
        {:else if $form.location.length === locationMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.location.length > locationMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{locationMax - $form.location.length}</p>
        {:else if $form.location.length > locationMax / 2}
            <p class="text-yellow-600 ml-2">{locationMax - $form.location.length}</p>
        {/if}
    {/if}
    {#if $errors.location}
        <p class="text-red-500">{$errors.location}</p>
    {:else if $form.location && $form.location.length > locationMax}
        <p class="text-yellow-600">location must be {locationMax} characters or fewer</p>
    {/if}

    <label for="birthday">Birthday</label>
    <input
        type="date"
        name="birthday"
        data-invalid={$errors.birthday}
        on:input={otherInput}
        bind:value={$form.birthday}
        {...$constraints.birthday} />
    {#if $errors.birthday}
        <p class="text-red-500">{$errors.birthday}</p>
    {/if}

    <div>
        {#if handleAvailable === null && $form.handle !== data.myProfile?.handle}
            <button disabled>Submit</button>
        {:else}
            <button on:click={receiveSubmit}>Submit</button>
        {/if}
    </div>

    {#if $message && !hasBeenTouched}
        <p class="text-green-500">{$message}</p>
    {:else if hasBeenSubmitted}
        <p class="text-yellow-600">Updating profile...</p>
    {/if}
    {#if $errors._errors}
        <p class="text-red-500">{$errors._errors}</p>
    {:else if warningRequired && hasBeenTouched}
        <p class="text-yellow-600">Any fields with errors won't be updated</p>
    {/if}
</form>

