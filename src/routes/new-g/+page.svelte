<script lang="ts">

    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { newGroupSchema } from '$lib/zod';

    export let data: PageData

    let slugAvailable: boolean | null = null
    let inputElement: HTMLInputElement

    let hasBeenTouched = false
    let hasBeenSubmitted = false

    const slugMax = 15
    const slugMin = 3
    const nameMax = 50
    const nameMin = 1

    const { form, enhance, errors, constraints, message } = superForm(data.form, {
        taintedMessage: null,
        validators: newGroupSchema,
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

        if ($form.slug) {
            if ($form.slug.length > slugMax) warningRequired = true
            if ($form.slug.length < slugMin) warningRequired = true
        } else warningRequired = true
    }

    let loading = false

    const { myUser, myProfile, session } = data
   

    const slugInput = async () => { 
        hasBeenTouched = true
        slugAvailable = false
        if (!$errors.slug && $form.slug && $form.slug.length >= slugMin && $form.slug.length <= slugMax) {
            slugAvailable = null

            const res = await fetch('/api/checkSlugAvailability?slug=' + $form.slug + "&t=g")
            const slugRes = await res.json()
            slugAvailable = slugRes.available

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





<h1>New Group</h1>

<SuperDebug data={$form} />


<form method="POST" action="?/newGroup" class="flex flex-col w-64">
    <label for="name">Slug</label>
    <input
        type="text"
        name="slug"
        data-invalid={$errors.slug}
        bind:this={inputElement}
        bind:value={$form.slug}
        on:input={slugInput}
        {...$constraints.slug} />
    {#if $form.slug}
        {#if $form.slug.length > slugMax}
            <p class="text-red-500 ml-2">+{$form.slug.length - slugMax}</p>
        {:else if $form.slug.length === slugMax}
            <p class="text-red-500 ml-2">0</p>
        {:else if $form.slug.length > slugMax * 3 / 4}
            <p class="text-yellow-600 ml-2">{slugMax - $form.slug.length}</p>
        {:else if $form.slug.length > slugMax / 2}
            <p class="text-yellow-600 ml-2">{slugMax - $form.slug.length}</p>
        {/if}
    {/if}
    {#if true || $form.slug !== myProfile?.handle}
        {#if $errors.slug}
            <p class="text-yellow-600">{$errors.slug}</p>
        {:else if !$form.slug}
            <p class="text-yellow-600">slug must be {slugMin} characters or more</p>
        {:else if $form.slug && $form.slug.length < slugMin}
            <p class="text-yellow-600">slug must be {slugMin} characters or more</p>
        {:else if $form.slug && $form.slug.length > slugMax}
            <p class="text-yellow-600">slug must be {slugMax} characters or fewer</p>
        {:else if slugAvailable === false}
            <p class="text-yellow-600">slug unavailable!</p>
        {:else if slugAvailable}
            <p class="text-green-500">slug available!</p>
        {:else if $form.slug && $form.slug.length > 0}
            <p class="text-yellow-600">checking slug...</p>
        {:else }
            <p class="text-yellow-600">slug will not be updated</p>
        {/if}
    {/if}

    <label for="name">Group Name</label>
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

    <div>
        {#if slugAvailable === null}
            <button disabled>Submit</button>
        {:else}
            <button on:click={receiveSubmit}>Submit</button>
        {/if}
    </div>

    {#if $message && !hasBeenTouched}
        <p class="text-green-500">{$message}</p>
    {:else if hasBeenSubmitted}
        <p class="text-yellow-600">Creating group...</p>
    {/if}
    {#if $errors._errors}
        <p class="text-red-500">{$errors._errors}</p>
    {:else if warningRequired && hasBeenTouched}
        <p class="text-yellow-600">Any fields with errors won't be updated</p>
    {/if}
</form>

