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
  <p>Type: {theEvent.event_type}</p>
  {#if theEvent.continuation_of}
    <p>Continuation of {theEvent.continuation_of}</p>
  {/if}
  <p>Status: {theEvent.status}</p>
  <a href="/e/{theEvent.slug}/edit">EDIT EVENT</a>
{/if}