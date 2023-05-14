import { connectedToDb } from "@utils/database";
import Prompt from "@models/prompt";

// GET
export const GET = async (req, { params }) => {
    try {
        await connectedToDb()

        const prompt = await Prompt.findById(params.id).populate('creator')
        if (!prompt) {
            return new Response("Not found", { status: 404 })
        }

        return new Response(JSON.stringify(prompt), { status: 200 })
    } catch (error) {
        return new Response("Failed to get prompt", { status: 500 })
    }
}

// PATCH
export const PATCH = async (req, { params }) => {
    const { prompt, tag } = await req.json()
    try {
        await connectedToDb()

        const existingPrompt = await Prompt.findById(params.id)

        if (!existingPrompt) {
            return new Response("Not found", { status: 404 })
        } else {
            existingPrompt.prompt = prompt
            existingPrompt.tag = tag

            await existingPrompt.save()
            return new Response(JSON.stringify(existingPrompt), { status: 200 })
        }
    } catch (error) {
        return new Response("Failed to update prompt", { status: 500 })
    }
}

// DELETE
export const DELETE = async (req, {params}) => {
    try {
        await connectedToDb()

        await Prompt.findByIdAndRemove(params.id)

        return new Response("Prompt deleted", {status: 200})
    } catch (error) {
        return new Response("Failed to delete prompt", { status: 500 })
    }
}

