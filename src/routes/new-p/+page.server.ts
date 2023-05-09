import type { Actions } from '@sveltejs/kit'
import { fail } from '@sveltejs/kit'
import type { PageServerLoad } from "./$types"
import { z } from 'zod'
import { superValidate } from 'sveltekit-superforms/server'
import { newUserSchema } from '$lib/zod'

// import getTodos from database?

// probably move this to a different file
// const schema = z.object({
//     name: z.string().default('Hello world!'),
//     email: z.string().email(),
// })

export const load: PageServerLoad = async (event) => {

    // Server API:
    const form = await superValidate(event, newUserSchema)

    return { form }

    // can prepopulate with stuff from db: https://superforms.vercel.app/get-started

}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const actions: Actions = {

    addUser: async ({ request }) => {
        const formData = await request.formData()
        const user = String(formData.get('user'))
        const password = String(formData.get('password'))

        if (!user) {
            return fail(400, { user, userMissing: true })
        }

        if (!password) {
            return fail(400, { user, passwordMissing: true })
        }

        await sleep(2000)

        // add todo function from db

        return { success: true }
    },

    createUser: async (event) => {
        const form = await superValidate(event, newUserSchema)
        console.log("POST", form)
        // form has: valid bool, errors obj, data obj, empty bool, constraints obj

        if (!form.valid) {
            return fail(400, { form })
        }

        // do something with the validated data

        return { form }
    },

    removeTodo: async ({ request }) => {
        const formData = request.formData()
        const todoId = Number((await formData).get('id'))

        // removeTodo function from db

        return { success: true }
    },

    clearTodos: () => {
        console.log("clear todos")
    }
}