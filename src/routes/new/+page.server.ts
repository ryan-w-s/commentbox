import { fail, redirect, type RequestEvent, isRedirect } from '@sveltejs/kit'
import { createComment } from '$lib/server/db/comments'
import type { Actions } from './$types'

export const actions = {
	default: async (event: RequestEvent) => {
		const data = await event.request.formData()
		const content = data.get('content') as string | null
		const parentIdRaw = data.get('parentId') as string | null

		let parentId: number | undefined = undefined
		if (parentIdRaw) {
			parentId = parseInt(parentIdRaw, 10)
			if (isNaN(parentId)) {
				return fail(400, { content, parentIdRaw, error: 'Invalid parent ID format' })
			}
		}

		if (!content) {
			return fail(400, { content, parentIdRaw, missing: true })
		}

		try {
			// Pass parentId (will be undefined for top-level comments)
			await createComment({ content, parentId })

			// Redirect based on whether it was a reply or not
			if (parentId) {
				throw redirect(303, `/${parentId}`) // Redirect to the parent comment page
			} else {
				throw redirect(303, '/') // Redirect to homepage for top-level comments
			}
		} catch (error: unknown) {
			if (isRedirect(error)) {
				throw error
			}
			console.error('Failed to create comment:', error)
			// Include parentIdRaw in fail data if needed for form repopulation
			return fail(500, { content, parentIdRaw, error: 'Failed to save comment' })
		}
	}
} satisfies Actions
