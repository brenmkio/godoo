<script lang="ts">
  import '../app.postcss'
  import type { LayoutData } from './$types'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'

  export let data: LayoutData

  $: ({ supabase, session, myUser } = data)

    onMount(() => {
      console.log("URL hash: ", window.location.hash)

      const { 
        data: { subscription }
      } = supabase.auth.onAuthStateChange((event, _session) => {
        console.log ("Auth event: ", event)
        console.log ("Auth session: ", _session)

        if (_session?.expires_at !== session?.expires_at) {
          invalidate('supabase:auth');
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    })

</script>

<div id="main_app" class="bg-slate-100 px-2 w-screen h-screen">
  <a href="/">Home</a>
  {#if myUser} 
  <p>Welcome back {myUser?.username}</p>
  {/if}
  
  <slot />
</div>

