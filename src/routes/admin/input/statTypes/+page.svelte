<script lang="ts">

    /*

import * as math from 'mathjs';

async function calculateStats(profileId: number) {
    const statTypes = await getStatTypesFromDb();

    for (const statType of statTypes) {
        const environment: Record<string, any> = {};

        // Fetch the corresponding RawStatType values
        const rawStats = await getRawStatsForProfile(profileId, [statType.a, statType.b, statType.c, statType.d, statType.e]);
        for (const rawStat of rawStats) {
            environment[rawStat.type] = rawStat.value;
        }

        // Recursively calculate and fetch d and e if they are aggregate Stats
        if (isStatType(statType.d)) {
            environment['d'] = await calculateStat(profileId, statType.d);
        }

        if (isStatType(statType.e)) {
            environment['e'] = await calculateStat(profileId, statType.e);
        }

        // Evaluate the function with the environment
        const func = math.parse(statType.function).compile();
        const result = func.evaluate(environment);

        // Store this calculated value back in the database or cache
        await storeCalculatedStat(profileId, statType.id, result);
    }
}




    */


    // name, description, category, activity, higher is better
    
        import type { PageData } from './$types'
        import { superForm } from 'sveltekit-superforms/client'
        import { statTypeSchema } from '$lib/zod'
    
        export let data: PageData

        const { rawStatTypes, aggStatTypes } = data
    
        let inputElement: HTMLInputElement
    
        const slugMax = 15
        const slugMin = 3
        const nameMax = 50
        const nameMin = 1
    
        const { form, enhance, errors, constraints, message } = superForm(data.form, {
            taintedMessage: null,
            validators: statTypeSchema,
            validationMethod: 'oninput',
            delayMs: 100,
            invalidateAll: true,
        })
    
    
        let loading = false
    
        const { myUser, myProfile, session } = data
       
    
    </script>
    
    
    
    
    
    <h1>New Stat Type</h1>
    
    
    <form method="POST" class="flex flex-col w-64 space-y-2">
        <label for="name">Name</label>
        <input
            class="border border-black"
            type="text"
            name="name"
            data-invalid={$errors.name}
            bind:value={$form.name}
            {...$constraints.name} />

        <label for="shortform">Shortform</label>
        <input
            class="border border-black"
            type="text"
            name="shortform"
            data-invalid={$errors.shortform}
            bind:value={$form.shortform}
            {...$constraints.shortform} />
    
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
        <label for="category">Category</label>
        <input
            class="border border-black"
            type="text"
            name="category"
            data-invalid={$errors.category}
            bind:value={$form.category}
            {...$constraints.category} />
    
        <label for="activity">Activity</label>
        <input
            class="border border-black"
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
    
        
        <p>RAW STATS</p>

        <label for="s1">a (raw)
            <select 
                name="s1"
                data-invalid={$errors.s1}
                bind:value={$form.s1}
                {...$constraints.s1}
                >
                <option selected disabled value="null">raw stat type</option>
                
                {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                    <option value="{rawStatType.id}">{rawStatType.name}</option>
                {/each}{/if}
            </select>
        </label>  

        <label for="s2">b (raw)
            <select 
                name="s2"
                data-invalid={$errors.s2}
                bind:value={$form.s2}
                {...$constraints.s2}
                >
                <option selected disabled value="null">raw stat type</option>
                
                {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                    <option value="{rawStatType.id}">{rawStatType.name}</option>
                {/each}{/if}
            </select>
        </label> 

        <label for="s3">c (raw)
            <select 
                name="s3"
                data-invalid={$errors.s3}
                bind:value={$form.s3}
                {...$constraints.s3}
                >
                <option selected disabled value="null">raw stat type</option>
                
                {#if rawStatTypes}{#each rawStatTypes as rawStatType}
                    <option value="{rawStatType.id}">{rawStatType.name}</option>
                {/each}{/if}
            </select>
        </label>  

        <label for="agg1">d (agg)
            <select 
                name="agg1"
                data-invalid={$errors.agg1}
                bind:value={$form.agg1}
                {...$constraints.agg1}
                >
                <option selected disabled value="null">agg stat type</option>
                
                {#if aggStatTypes}{#each aggStatTypes as aggStatType}
                    <option value="{aggStatType.id}">{aggStatType.name}</option>
                {/each}{/if}
            </select>
        </label>  
        
        <label for="agg2">e (agg)
            <select 
                name="agg2"
                data-invalid={$errors.agg2}
                bind:value={$form.agg2}
                {...$constraints.agg2}
                >
                <option selected disabled value="null">agg stat type</option>
                
                {#if aggStatTypes}{#each aggStatTypes as aggStatType}
                    <option value="{aggStatType.id}">{aggStatType.name}</option>
                {/each}{/if}
            </select>
        </label>  
    
        <label for="expression">Expression</label>
        <input
            class="border border-black"
            type="text"
            name="expression"
            data-invalid={$errors.expression}
            bind:value={$form.expression}
            {...$constraints.expression} />


        
        <button>Submit</button>
    </form>

    
    

    