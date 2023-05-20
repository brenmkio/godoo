<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { groups, error } = data
</script>

<h1>groups</h1>

{#if groups}
{#each groups as group }
<p>#{group.id}: <a href="/g/{group.slug}">@{group.slug}</a> - {group.name}</p>
{/each}
{/if}