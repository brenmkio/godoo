<script lang="ts">
  import '../app.postcss'
  import type { LayoutData } from './$types'
	import { onMount } from 'svelte'
	import { invalidateAll } from '$app/navigation'

  export let data: LayoutData

  $: ({ supabase, session, myUser, myProfile } = data)

    onMount(() => {

      const { 
        data: { subscription }
      } = supabase.auth.onAuthStateChange((event, _session) => {

        if (_session?.expires_at !== session?.expires_at) {
          invalidateAll()
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    })

</script>

<div id="main_app" class="bg-slate-100 px-2 w-screen h-screen">
  <a href="/">Home</a>
  {#if myProfile || myUser} 
  <p>Welcome back {"buddy"}</p>
  {/if}
  
  <slot />
</div>

