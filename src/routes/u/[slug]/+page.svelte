<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h1>Users</h1>


{#if data.error}
  <p class="text-red-600 mt-4">{data.error.message}</p>  
{:else if data.user}
  <p class="text-purple-600 mt-4">{data.user.email}</p>
{:else}
  <p class="text-yellow-600 mt-4">Loading...</p>
{/if}