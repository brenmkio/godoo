// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSession: () => Promise<Session | null>; // You can replace 'any' with the expected session type if you know it.
		}
		interface PageData {
			session: Session | null;
			myUser: User | null; 
		}
		// interface Platform {}
	}
}

export {};

