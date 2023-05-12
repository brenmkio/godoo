import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
  } from '$env/static/public';
  import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
  import { redirect, type Handle } from '@sveltejs/kit';
  import { DB_getProfileByID, DB_getUserByEmail } from '$lib/db';
  
  export const handle: Handle = async ({ event, resolve }) => {

    // (step 2) request has hit server, but response has not been generated

    event.locals.supabase = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
      event
    })

    /**
     * a little helper that is written for convenience so that instead
     * of calling `const { data: { session } } = await supabase.auth.getSession()`
     * you just call this `await getSession()`
     */
    event.locals.getSession = async () => {
      const {
        data: { session }
      } = await event.locals.supabase.auth.getSession();
      return session;
    }

    const session = await event.locals.getSession()
    if (session) {

      const authEmail = session.user.email || ''
      const { db_data, db_error } = await DB_getUserByEmail(authEmail)
      if (db_error) {
        if (event.locals.errors) {
          event.locals.errors.push(db_error)
        } else {
          event.locals.errors = [db_error]
        }
      } else {
        event.locals.user = db_data
      }

    }

    if (event.locals.user) {
      const currentProfileID = event.locals.user.current_profile_id || -1
      const { db_data, db_error } = await DB_getProfileByID(currentProfileID.toString())
      if (db_error) {
        if (event.locals.errors) {
          event.locals.errors.push(db_error)
        } else {
          event.locals.errors = [db_error]
        }
      } else {
        event.locals.profile = db_data
      }
    }

    if (!event.url.pathname.startsWith('/onboard') && !event.url.pathname.startsWith('/api') && session && !event.locals.user) {
      throw redirect(303, '/onboard')
    }
  
    // (step 3) render route and generate response (also step 6)
    return resolve(event, {
      /**
       * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
       *
       * https://github.com/sveltejs/kit/issues/8061
       */
      filterSerializedResponseHeaders(name) {
        return name === 'content-range';
      }
    });
  };