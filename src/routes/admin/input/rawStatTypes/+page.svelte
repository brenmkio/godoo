<script lang="ts">

// name, description, category, activity, higher is better

    import type { PageData } from './$types'
    import { superForm } from 'sveltekit-superforms/client'
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
    import { rawStatTypeSchema } from '$lib/zod'

    export let data: PageData

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
        validators: rawStatTypeSchema,
        validationMethod: 'oninput',
        delayMs: 100,
        invalidateAll: true,
    })


    let loading = false

    const { myUser, myProfile, session } = data
   

</script>





<h1>New Raw Stat Type</h1>

<SuperDebug data={$form} />


<form method="POST" class="flex flex-col w-64 space-y-2">
    <label for="name">Name</label>
    <input
        type="text"
        name="name"
        data-invalid={$errors.name}
        bind:value={$form.name}
        {...$constraints.name} />

    <label for="description">Description</label>
    <textarea 
        name="description" 
        cols="40" 
        rows="5"
        data-invalid={$errors.description} 
        bind:value={$form.description}
        {...$constraints.description}
    />

    <label for="category">Category</label>
    <input
        type="text"
        name="category"
        data-invalid={$errors.category}
        bind:value={$form.category}
        {...$constraints.category} />

    <label for="activity">Activity</label>
    <input
        type="text"
        name="activity"
        data-invalid={$errors.activity}
        bind:value={$form.activity}
        {...$constraints.activity} />

    <label for="higher_is_better">
        <input 
            type="checkbox" 
            name="higher_is_better"
            bind:checked={$form.higher_is_better}
            {...$constraints.higher_is_better}
        />
        Lower is better?
    </label>


    
    <button>Submit</button>
</form>

