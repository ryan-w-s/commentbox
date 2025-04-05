import { fail, redirect, type RequestEvent, isRedirect } from '@sveltejs/kit'
import { createComment } from '$lib/server/db/comments'
import type { Actions } from './$types'

export const actions = {
	default: async (event: RequestEvent) => {
		const data = await event.request.formData()
		const content = data.get('content') as string | null

		if (!content) {
			return fail(400, { content, missing: true })
		}

		try {
			await createComment({ content })
			// Instead of returning success, redirect to homepage
			throw redirect(303, '/') // Use 303 See Other for POST redirects
		} catch (error: unknown) {
			// Use SvelteKit's isRedirect type guard
			if (isRedirect(error)) {
				throw error // Re-throw redirects correctly
			}
			// Log actual errors
			console.error('Failed to create comment:', error)
			return fail(500, { content, error: 'Failed to save comment' })
		}
	}
} satisfies Actions
