import { getTopLevelComments, getTopLevelCommentsCount } from '$lib/server/db/comments'
import type { PageServerLoad } from './$types'

const PAGE_SIZE = 10

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1', 10)
	const limit = PAGE_SIZE
	const offset = (page - 1) * limit

	try {
		const [totalCommentsCount, comments] = await Promise.all([
			getTopLevelCommentsCount(),
			getTopLevelComments(limit, offset)
		])

		const totalPages = Math.ceil(totalCommentsCount / PAGE_SIZE)

		return {
			comments,
			currentPage: page,
			totalPages: totalPages,
			totalComments: totalCommentsCount
		}
	} catch (error) {
		console.error('Failed to load top-level comments:', error)
		return { comments: [], currentPage: 1, totalPages: 0, totalComments: 0, error: 'Could not load comments' }
	}
}
