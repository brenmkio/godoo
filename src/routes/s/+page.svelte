<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { scenes, error } = data
</script>

<h1>scenes</h1>

{#if scenes}
{#each scenes as scene }
    <p>#{scene.id}: <a href="/s/{scene.slug}">{scene.name}</a>
{/each}
{/if}