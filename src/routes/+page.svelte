<script lang="ts">


	import { enhance, type SubmitFunction } from '$app/forms';
	import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';



  import type { PageData } from './$types'

  export let data: PageData

  const submitLogout: SubmitFunction = async ({ cancel }) => {
    const { error } = await data.supabase.auth.signOut()
    if (error) {
      console.log(error)
    }
    cancel() // huntabyte sveltekit authentication 20:00 or so
    // this is all because we coded the non-JS first, but this is the JS way
  }


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
    <p>Welcome!</p>
    <p>auth user: {data.session.user.email}</p>
    <p>my user: {data.myUser?.username}</p>
    <p>my profile: {data.myProfile?.handle}</p>
    <a href="/edit-p">Edit Profile</a>
    <a href="/new-p">New Profile</a>
    <a href="/u">List of Users</a>
    <a href="/u/test">Test User</a>
    <form action="/logout" method="POST" use:enhance={submitLogout}>
      <button type="submit">Logout</button>
    </form>
  {:else}
    <a href="/login?backTo=u%2Ftest">Login</a>
    <a href="/register">Register</a>
  {/if}
</div>