<script lang="ts">

    // name, description, category, activity, higher is better
    
        import type { PageData } from './$types'
        import { superForm } from 'sveltekit-superforms/client'
        import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
        import { occurrenceTypeSchema } from '$lib/zod'
    
        export let data: PageData

        const { rawStatTypes } = data
    
        let inputElement: HTMLInputElement
    
        let showMore = false
    
        const slugMax = 15
        const slugMin = 3
        const nameMax = 50
        const nameMin = 1
    
        const { form, enhance, errors, constraints, message } = superForm(data.form, {
            taintedMessage: null,
            validators: occurrenceTypeSchema,
            validationMethod: 'oninput',
            delayMs: 100,
            invalidateAll: true,
        })
    
    
        let loading = false
    
        const { myUser, myProfile, session } = data
       
        const showMoreClicked = () => {
            showMore = !showMore
        }
    
    </script>
    
    
    
    
    
    <h1>New Occurrence Type</h1>
    
    
    <form method="POST" class="flex flex-col w-64 space-y-2">
        <label for="name">Name</label>
        <input
            class="border border-black"
            type="text"
            name="name"
            data-invalid={$errors.name}
            bind:value={$form.name}
            {...$constraints.name} />
    
        <label for="description">Description</label>
        <textarea 
            class="border border-black"
            name="description" 
            cols="40" 
            rows="5"
            data-invalid={$errors.description} 
            bind:value={$form.description}
            {...$constraints.description}
        />
    
        <label for="activity">Activity</label>
        <input
            class="border border-black"
            type="text"
            name="activity"
            data-invalid={$errors.activity}
            bind:value={$form.activity}
            {...$constraints.activity} />
        
        <p>RAW STATS</p>

        <div class="flex space-x-2">
            <label for="s1">
                <select 
                    name="s1"
                    data-invalid={$errors.s1}
                    bind:value={$form.s1}
                    {...$constraints.s1}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v1"
            data-invalid={$errors.v1}
            bind:value={$form.v1}
            {...$constraints.v1} />
        </div>

        <div class="flex space-x-2">
            <label for="s2">
                <select 
                    name="s2"
                    data-invalid={$errors.s2}
                    bind:value={$form.s2}
                    {...$constraints.s2}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v2"
            data-invalid={$errors.v2}
            bind:value={$form.v2}
            {...$constraints.v2} />
        </div>

        <div class="flex space-x-2">
            <label for="s3">
                <select 
                    name="s3"
                    data-invalid={$errors.s3}
                    bind:value={$form.s3}
                    {...$constraints.s3}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v3"
            data-invalid={$errors.v3}
            bind:value={$form.v3}
            {...$constraints.v3} />
        </div>

        <div class="flex space-x-2">
            <label for="s4">
                <select 
                    name="s4"
                    data-invalid={$errors.s4}
                    bind:value={$form.s4}
                    {...$constraints.s4}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v4"
            data-invalid={$errors.v4}
            bind:value={$form.v4}
            {...$constraints.v4} />
        </div>

        <div class="flex space-x-2">
            <label for="s5">
                <select 
                    name="s5"
                    data-invalid={$errors.s5}
                    bind:value={$form.s5}
                    {...$constraints.s5}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v5"
            data-invalid={$errors.v5}
            bind:value={$form.v5}
            {...$constraints.v5} />
        </div>

        {#if showMore}

        <div class="flex space-x-2">
            <label for="s6">
                <select 
                    name="s6"
                    data-invalid={$errors.s6}
                    bind:value={$form.s6}
                    {...$constraints.s6}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v6"
            data-invalid={$errors.v6}
            bind:value={$form.v6}
            {...$constraints.v6} />
        </div>

        <div class="flex space-x-2">
            <label for="s7">
                <select 
                    name="s7"
                    data-invalid={$errors.s7}
                    bind:value={$form.s7}
                    {...$constraints.s7}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v7"
            data-invalid={$errors.v7}
            bind:value={$form.v7}
            {...$constraints.v7} />
        </div>

        <div class="flex space-x-2">
            <label for="s8">
                <select 
                    name="s8"
                    data-invalid={$errors.s8}
                    bind:value={$form.s8}
                    {...$constraints.s8}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v8"
            data-invalid={$errors.v8}
            bind:value={$form.v8}
            {...$constraints.v8} />
        </div>

        <div class="flex space-x-2">
            <label for="s9">
                <select 
                    name="s9"
                    data-invalid={$errors.s9}
                    bind:value={$form.s9}
                    {...$constraints.s9}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v9"
            data-invalid={$errors.v9}
            bind:value={$form.v9}
            {...$constraints.v9} />
        </div>

        <div class="flex space-x-2">
            <label for="s10">
                <select 
                    name="s10"
                    data-invalid={$errors.s10}
                    bind:value={$form.s10}
                    {...$constraints.s10}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v10"
            data-invalid={$errors.v10}
            bind:value={$form.v10}
            {...$constraints.v10} />
        </div>

        <div class="flex space-x-2">
            <label for="s11">
                <select 
                    name="s11"
                    data-invalid={$errors.s11}
                    bind:value={$form.s11}
                    {...$constraints.s11}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v11"
            data-invalid={$errors.v11}
            bind:value={$form.v11}
            {...$constraints.v11} />
        </div>

        <div class="flex space-x-2">
            <label for="s12">
                <select 
                    name="s12"
                    data-invalid={$errors.s12}
                    bind:value={$form.s12}
                    {...$constraints.s12}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v12"
            data-invalid={$errors.v12}
            bind:value={$form.v12}
            {...$constraints.v12} />
        </div>

        <div class="flex space-x-2">
            <label for="s13">
                <select 
                    name="s13"
                    data-invalid={$errors.s13}
                    bind:value={$form.s13}
                    {...$constraints.s13}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v13"
            data-invalid={$errors.v13}
            bind:value={$form.v13}
            {...$constraints.v13} />
        </div>

        <div class="flex space-x-2">
            <label for="s14">
                <select 
                    name="s14"
                    data-invalid={$errors.s14}
                    bind:value={$form.s14}
                    {...$constraints.s14}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v14"
            data-invalid={$errors.v14}
            bind:value={$form.v14}
            {...$constraints.v14} />
        </div>

        <div class="flex space-x-2">
            <label for="s15">
                <select 
                    name="s15"
                    data-invalid={$errors.s15}
                    bind:value={$form.s15}
                    {...$constraints.s15}
                    >
                    <option selected disabled value="null">Select a raw stat type</option>
                    
                    {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                        <option value="{rawStatType.id}">{rawStatType.name}</option>
                    {/each}{/if}
                </select>
            </label>  
            <input
            class="border border-black"
            type="text"
            name="v15"
            data-invalid={$errors.v15}
            bind:value={$form.v15}
            {...$constraints.v15} />
        </div>




        {/if}
        
        <button>Submit</button>
    </form>

    <button on:click={showMoreClicked}>Show more</button>

    
    