<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { profiles, error } = data
</script>

<h1>Profiles</h1>

{#if profiles}
{#each profiles as profile }
<p>#{profile.id}: <a href="/p/{profile.handle}">@{profile.handle}</a> - {profile.name}</p>
{/each}
{/if}