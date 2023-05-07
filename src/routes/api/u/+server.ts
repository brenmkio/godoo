import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {

    const options: ResponseInit = {
        status: 418,
        headers: {
            X: "gon give it to ya"
        }
    }

    return new Response('getting a user')
}


export const POST: RequestHandler = async (event) => {
    const data = await event.request.formData()
    const email = data.get("email")

    // do logic
    console.log(email)

    return new Response(
        JSON.stringify({ success: true }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}