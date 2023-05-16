<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { theEvent, error } = data
</script>

<h1>Event</h1>
{#if error}
  <p class="text-red-600 mt-4">{error.message}</p>  
{:else if theEvent}
  <p class="text-purple-600 mt-4">{theEvent.name}</p>
{:else}
  <p class="text-yellow-600 mt-4">Loading...</p>
{/if}

{#if theEvent}
<p>Slug: {theEvent.slug}</p>
<p>Name: {theEvent.name}</p>
<p>Location: {theEvent.location}</p>
{/if}