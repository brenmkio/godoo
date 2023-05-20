<script lang="ts">

    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { registerSchema } from '$lib/zod';

    export let data: PageData

    let displayName = ''
    let avatarUrl = ''
    let handleAvailable: boolean | null = null
    let inputElement: HTMLInputElement

    const { form, enhance, errors, constraints } = superForm(data.form, {
        taintedMessage: null,
        validators: registerSchema
    })

    let loading = false

   

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


</script>





<h1>Register</h1>

<SuperDebug data={$form} />


<form method="POST" action="?/register" use:enhance class="flex flex-col w-64">
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

    <label for="confirm">Confirm Password</label>
    <input
        type="password"
        name="confirm"
        data-invalid={$errors.confirm}
        bind:value={$form.confirm}
        {...$constraints.confirm} />
    {#if $errors.confirm}
        <p class="text-red-500">{$errors.confirm}</p>
    {/if}

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
    {#if $errors.name}
        <p class="text-red-500">{$errors.name}</p>
    {/if}

    <div><button>Submit</button></div>
    {#if $errors._errors}
        <p class="text-red-500">{$errors._errors}</p>
    {/if}
</form>

