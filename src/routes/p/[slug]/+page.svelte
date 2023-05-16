<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { profile, error } = data
</script>

<h1>Profile</h1>
{#if error}
  <p class="text-red-600 mt-4">{error.message}</p>  
{:else if profile}
  <p class="text-purple-600 mt-4">{profile.name}</p>
{:else}
  <p class="text-yellow-600 mt-4">Loading...</p>
{/if}

{#if profile}
<p>Handle: {profile.handle}</p>
<p>Name: {profile.name}</p>
<p>Pronouns: {profile.pronouns}</p>
<p>Bio: {profile.bio}</p>
<p>Location: {profile.location}</p>
<p>Birthday: {profile.birthday}</p>
{/if}