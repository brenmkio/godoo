<script lang="ts">

  import type { PageData } from './$types'

  export let data: PageData

</script>

{#if data.error}
  <h1 class="text-purple-600 mt-4">{data.error.message}</h1>  
{:else if data.test}
  <h1 class="text-purple-600 mt-4">{data.test}</h1>
{:else}
  <h1 class="text-yellow-600 mt-4">Loading...</h1>
{/if}

<div class="flex flex-col mt-4">
  {#if data.session}
    <p>Welcome, {data.session.user.email}</p>
    <a href="/edit-p">Edit Profile</a>
    <a href="/new-p">New Profile</a>
    <a href="/u">List of Users</a>
    <a href="/u/test">Test User</a>
    <form action="/logout" method="POST">
      <button type="submit">Logout</button>
    </form>
  {:else}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}
</div>