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

<div id="main_app" class="bg-slate-100 w-screen h-screen">
  <div class="w-full bg-slate-300 h-6 flex items-center p-4 space-x-2">
    <a href="/">Home</a>
    <a href="/u">{myUser?.username}</a>
    <a href="/p/me/edit">My Profile</a>
  </div>
  <div class="p-4">
    <slot />
  </div>
</div>

