<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { group, error } = data
</script>

<h1>Group</h1>
{#if error}
  <p class="text-red-600 mt-4">{error.message}</p>  
{:else if group}
  <p class="text-purple-600 mt-4">{group.name}</p>
{:else}
  <p class="text-yellow-600 mt-4">Loading...</p>
{/if}

{#if group}
<p>Handle: {group.slug}</p>
<p>Name: {group.name}</p>
<p>Location: {group.location}</p>
{/if}