import { getTopLevelComments } from '$lib/server/db/comments'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	try {
		const comments = await getTopLevelComments()
		// Add sorting if needed, e.g., reverse chronological
		comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
		return { comments }
	} catch (error) {
		console.error('Failed to load top-level comments:', error)
		// Return an empty array or an error state if loading fails
		return { comments: [], error: 'Could not load comments' }
	}
}
