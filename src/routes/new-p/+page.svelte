<script lang="ts">
	import { applyAction } from '$app/forms';
    import type { ActionData, PageData, SubmitFunction } from './$types';
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { newUserSchema } from '$lib/zod';

    export let data: PageData
    export let form2: ActionData

    const { form, enhance, errors, constraints } = superForm(data.form, {
        taintedMessage: "Are you sure you want to leave?",
        validators: newUserSchema
    })

    let loading = false

    const addUser: SubmitFunction = (input) => {
        // do something before the form submits, eg is username taken
        // input has: action, cancel, controller, data (formData), form (form element)

        loading = true

        return async (options) => {
            // do something after the form submits
            // options has: action, data (formData), form (form element), result (response), update
            loading = false
            console.log(options.result)

            await options.update() // update parent state, re-render parent component
            // I only need this because the very act of using this function within "use:enhance" means I'm preventing the default behaviour. This brings it back

            if (options.result.type === "success") {

                await applyAction(options.result) // apply server response to client form
            }
        }
    }

</script>





<h1>New dummy user</h1>

<form method="POST" action="?/addUser" class="flex flex-col w-40 space-y-2">
    <input type="text" name="user" />
    {#if form2?.userMissing}
        <p class="text-red-500">This field is required</p>
    {/if}
    <input type="password" name="password" />
    {#if form2?.passwordMissing}
        <p class="text-red-500">This field is required</p>
    {/if}
    <button type="submit">Create user</button>
    <button type="submit" formaction="?/clearTodos">Clear</button>
</form>

{#if loading}
 <p>Loading...</p>
{:else if form2?.success}
    <p>Added todo!</p>
{/if}

<SuperDebug data={$form} />

<form method="POST" action="?/createUser" use:enhance>
    <label for="name">Name</label>
    <input
        type="text"
        name="name"
        data-invalid={$errors.name}
        bind:value={$form.name}
        {...$constraints.name} />
    {#if $errors.name}<span class="text-red-500">{$errors.name}</span>{/if}

    <label for="email">E-mail</label>
    <input
        type="email"
        name="email"
        data-invalid={$errors.email}
        bind:value={$form.email}
        {...$constraints.email} />
    {#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}

    <div><button>Submit</button></div>
</form>