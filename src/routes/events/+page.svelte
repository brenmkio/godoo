<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { events, error } = data
</script>

<h1>events</h1>

{#if events}
{#each events as anEvent }
<p>#{anEvent.id}: <a href="/e/{anEvent.slug}">@{anEvent.slug}</a> - {anEvent.name}</p>
{/each}
{/if}