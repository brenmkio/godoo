<script lang="ts">

    import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { onboardSchema } from '$lib/zod'

    export let data: PageData

    let displayName = ''
    let avatarUrl = ''
    let handleAvailable: boolean | null = null
    let inputElement: HTMLInputElement


    const { form, enhance, errors, constraints } = superForm(data.form, {
        taintedMessage: null,
        validators: onboardSchema
    })

    const handleInput = async () => {
        if (!$errors.handle) {
            handleAvailable = null

            const res = await fetch('/api/checkHandleAvailability?handle=' + $form.handle)
            const handleRes = await res.json()
            handleAvailable = handleRes.available

        }
        
        if (inputElement) {
            inputElement.blur()
            inputElement.focus()
        }
    }

    onMount(async () => {
        if (!data.session?.user) {
            goto('/')
        }

        displayName = data.session?.user.user_metadata.full_name || ''
        avatarUrl = data.session?.user.user_metadata.avatarUrl || ''
    })

</script>





<h1>Onboard</h1>
<p>Welcome {displayName || "to Godoo!"}</p>

<SuperDebug data={$form} />

<form method="POST" action="?/onboard" use:enhance class="flex flex-col w-64">
    <label for="name">Handle</label>
    <input
        type="text"
        name="handle"
        data-invalid={$errors.handle}
        bind:this={inputElement}
        bind:value={$form.handle}
        on:input={handleInput}
        {...$constraints.handle} />
    {#if $errors.handle}
        <p class="text-red-500">{$errors.handle}</p>
    {:else if handleAvailable === false}
        <p class="text-red-500">handle unavailable!</p>
    {:else if handleAvailable}
        <p class="text-green-500">handle available!</p>
    {:else if $form.handle.length > 0}
        <p class="text-yellow-600">checking handle...</p>
    {/if}

    <label for="name">Display Name</label>
    <input
        type="text"
        name="name"
        data-invalid={$errors.name}
        bind:value={$form.name}
        {...$constraints.name} />
    {#if $errors.name}<span class="text-red-500">{$errors.name}</span>{/if}

    <div><button>Submit</button></div>
</form>