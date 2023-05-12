import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
  } from '$env/static/public';
  import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
  import type { LayoutLoad } from './$types'
import type { Profile, User } from '@prisma/client';
  
  export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth')
  
    const supabase = createSupabaseLoadClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
      event: { fetch },
      serverSession: data.session
    })
  
    const {
      data: { session }
    } = await supabase.auth.getSession()

    const myUser: User | null = data.myUser
    const myProfile: Profile | null = data.myProfile
  
    return { supabase, session, myUser, myProfile }
  }