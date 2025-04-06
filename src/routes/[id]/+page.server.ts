import { error } from '@sveltejs/kit'
import { getCommentById, getCommentReplies } from '$lib/server/db/comments'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	// Ensure the id is a valid number
	const id = parseInt(params.id, 10)
	if (isNaN(id)) {
		throw error(400, 'Invalid comment ID format')
	}

	try {
		const mainComment = await getCommentById(id)

		// If the main comment doesn't exist, throw 404
		if (!mainComment) {
			throw error(404, 'Comment not found')
		}

		// Fetch replies for this comment
		const replies = await getCommentReplies(id)
		// Sort replies chronologically (oldest first)
		replies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

		return {
			comment: mainComment,
			replies: replies
		}
	} catch (err: unknown) {
		// Handle potential database errors or the 404/400 errors thrown above
		if (
			(err instanceof Error && err.message.includes('404')) ||
			(err instanceof Error && err.message.includes('400'))
		) {
			throw err // Re-throw SvelteKit errors
		}
		console.error(`Failed to load comment ${id} and replies:`, err)
		throw error(500, 'Failed to load comment data')
	}
}
