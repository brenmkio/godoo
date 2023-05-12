// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { User, Profile } from "@prisma/client"
import type { DBError } from '$lib/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSession: () => Promise<Session | null>;
			user: User | null;
			profile: Profile | null;
			errors: DBError[];
		}
		interface PageData {
			session: Session | null;
			myUser: User | null;
			myProfile: Profile | null;
		}
		// interface Platform {}
	}
}

export {};

