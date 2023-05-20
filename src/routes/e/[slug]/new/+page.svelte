<script lang="ts">

    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { newEventSchema } from '$lib/zod';
    import type { EventType } from '$lib/types';

    export let data: PageData

    const events = data.events ?? []
    const scene = data.scene

    let slugAvailable: boolean | null = null
    let inputElement: HTMLInputElement

    let hasBeenTouched = false
    let hasBeenSubmitted = false
    let isContinuation = false

    const slugMax = 15
    const slugMin = 3
    const nameMax = 50
    const nameMin = 1

    const { form, enhance, errors, constraints, message } = superForm(data.form, {
        taintedMessage: null,
        validators: newEventSchema,
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

            const res = await fetch('/api/checkSlugAvailability?slug=' + $form.slug + "&t=e")
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





<h1>New Event</h1>

<SuperDebug data={$form} />


<form method="POST" class="flex flex-col w-64 space-y-2">
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

    <label for="name">Event Name</label>
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

    {#if data.scene}
        <p>Scene: {data.scene.name}</p>
    {/if}

    <label for="event_type">Event Type</label>  
    <select 
        name="event_type"
        data-invalid={$errors.event_type}
        on:input={otherInput}
        bind:value={$form.event_type}
        {...$constraints.event_type}
        >
        <option selected disabled value="null">Select an event type</option>
        <option value="GeneralEvent">Event</option>
        <option value="Game">Game</option>
        <option value="Tournament">Tournament</option>
    </select>
    {#if $errors.event_type}
        <p class="text-red-500">{$errors.event_type}</p>
    {:else if $form.event_type !== "null"}
        <p class="text-yellow-600">Please note: you won't be able to change this later!</p>
    {/if}

    <label>
        <input type="checkbox" bind:checked={isContinuation} /> 
        Is this event a continuation of another event?
    </label>
    {#if isContinuation}
        <label>
            Select the previous event:
            <select bind:value={$form.continuation_of}>
                <option disabled selected value=""> -- select an event -- </option>
                {#each events as event (event.id)}
                    <option value={event.id}>{event.name}</option>
                {/each}
            </select>
        </label>
    {/if}

    <label for="start_time">Start Time</label>
    <input
        type="date"
        name="start_time"
        data-invalid={$errors.start_time}
        on:input={otherInput}
        bind:value={$form.start_time}
        {...$constraints.start_time} />
    {#if $errors.start_time}
        <p class="text-red-500">{$errors.start_time}</p>
    {/if}

    <div>
        {#if slugAvailable === null && $form.slug !== data.myProfile?.handle}
            <button disabled>Submit</button>
        {:else}
            <button on:click={receiveSubmit}>Submit</button>
        {/if}
    </div>

    {#if $message && !hasBeenTouched}
        <p class="text-green-500">{$message}</p>
    {:else if hasBeenSubmitted}
        <p class="text-yellow-600">Creating event...</p>
    {/if}
    {#if $errors._errors}
        <p class="text-red-500">{$errors._errors}</p>
    {:else if warningRequired && hasBeenTouched}
        <p class="text-yellow-600">Any fields with errors won't be updated</p>
    {/if}
</form>

