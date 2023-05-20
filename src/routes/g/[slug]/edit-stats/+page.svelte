<script lang="ts">
	import { str } from '$lib/utilsClient';


    import type { PageData } from './$types';

    export let data: PageData

    const { theGroup, occurrenceTypes, statTypes, rawStatTypes, dbErrors } = data
    const { myUser, myProfile, session } = data

    let searchTerm = ''
    let searchResults = []

    let chosenOccurrenceTypes: number[] = []
    let chosenStatTypes: number[] = []

    let rawStatsDemandedByChosenStats = new Set<number>()
    let rawStatsFromOccurrenceTypes = new Set<number>()

    $: {
        rawStatsDemandedByChosenStats = new Set<number>()
        for (let i = 0; i < chosenStatTypes.length; i++) {
            const rawId = chosenStatTypes[i]
            if (statTypes[rawId]) {
                const rawStat = statTypes[rawId]
                rawStatsDemandedByChosenStats = new Set([...rawStatsDemandedByChosenStats, Number(rawStat.raw_stat_1)])
                rawStatsDemandedByChosenStats = new Set([...rawStatsDemandedByChosenStats, Number(rawStat.raw_stat_2)])
                rawStatsDemandedByChosenStats = new Set([...rawStatsDemandedByChosenStats, Number(rawStat.raw_stat_3)])
            }
        }
        rawStatsFromOccurrenceTypes = new Set([...rawStatsFromOccurrenceTypes])
    }

    const updateRawStatsFromOccurrence = async () => {
        const response = await fetch('/api/getRawStatsFromOccurrenceTypes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: str(Array.from(chosenOccurrenceTypes))
        })

        if (response.ok) {
            const rawStatTypesArray = await response.json()
            rawStatsFromOccurrenceTypes = new Set<number>()
            for (let i = 0; i < rawStatTypesArray.length; i++) {
                rawStatsFromOccurrenceTypes = new Set([...rawStatsFromOccurrenceTypes,Number(rawStatTypesArray[i])])
            }
        } else {
            const { error } = await response.json();
            // can do something here to update UI if I want
            console.error(error);
        }
    }

    const newOccurrenceClicked = () => {
        chosenOccurrenceTypes = [...chosenOccurrenceTypes, -1]
    }

    const newStatClicked = () => {
        chosenStatTypes = [...chosenStatTypes, -1]
    }

    async function search() {
        const response = await fetch(`/api/search?term=${searchTerm}`);
        searchResults = await response.json();
    }

    const occurrenceRemoveItem = (index: number) => {
        if (index >= 0 && index < chosenOccurrenceTypes.length) {
            chosenOccurrenceTypes.splice(index, 1)
            chosenOccurrenceTypes = [...chosenOccurrenceTypes]
        }
        updateRawStatsFromOccurrence()
    }

    const statRemoveItem = (index: number) => {
        if (index >= 0 && index < chosenStatTypes.length) {
            chosenStatTypes.splice(index, 1)
            chosenStatTypes = [...chosenStatTypes]
        }
    }

</script>


<h1>Edit Stats for {theGroup.name}</h1>

<div class="w-full h-96 bg-slate-400 flex">
    <div class="w-1/3 h-full bg-slate-300 flex flex-col items-center space-y-2 overflow-y-scroll p-2">
        {#each chosenOccurrenceTypes as id, i}
            <div class="w-60 h-8 flex space-x-2">
                <label for="s1">{occurrenceTypes[id] ? id: "new"}</label>  
                <select name="s1" bind:value={id} on:change={updateRawStatsFromOccurrence}>
                    <option disabled value="-1">Select an occurrence</option>
                    {#if occurrenceTypes}{#each Object.values(occurrenceTypes) as occurrenceType}
                        <option value="{occurrenceType.id}">{occurrenceType.name}</option>
                    {/each}{/if}
                </select>
                <button on:click={() => occurrenceRemoveItem(i)}>x</button>
            </div>
        {/each}
    </div>
    <div class="w-1/3 h-full bg-slate-400 flex flex-col items-center space-y-2 overflow-y-scroll p-2">
        {#each Array.from(rawStatsDemandedByChosenStats) as id}
            {#if rawStatTypes[id]}
                {#if rawStatsFromOccurrenceTypes.has(id)}
                    <p class="text-green-600">{rawStatTypes[id].name}</p>
                {:else}
                    <p class="text-red-600">{rawStatTypes[id].name}</p>
                {/if}
            {/if}
        {/each}
    </div>
    <div class="w-1/3 h-full bg-slate-500 flex flex-col items-center space-y-2 overflow-y-scroll p-2">
        {#each chosenStatTypes as id, i}
        <div class="w-60 h-8 flex space-x-2">
            <label for="s1">{statTypes[id] ? id: "new"}</label>  
            <select name="s1" bind:value={id}>
                <option disabled value="-1">Select a stat</option>
                {#if statTypes}{#each Object.values(statTypes) as statType}
                    <option value="{statType.id}">{statType.name}</option>
                {/each}{/if}
            </select>
            <button on:click={() => statRemoveItem(i)}>x</button>
        </div>
    {/each}
    </div>
</div>
<button on:click={newOccurrenceClicked}>Add New Occurrence</button>
<button on:click={newStatClicked}>Add New Stat</button>

