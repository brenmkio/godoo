<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { scene, error } = data
</script>

<h1>scene</h1>
{#if error}
  <p class="text-red-600 mt-4">{error.message}</p>  
{:else if scene}
  <p class="text-purple-600 mt-4">{scene.name}</p>
{:else}
  <p class="text-yellow-600 mt-4">Loading...</p>
{/if}

{#if scene}
<p>Name: {scene.name}</p>
<a href="/new-e?s={scene.slug}">CREATE EVENT</a>
{/if}