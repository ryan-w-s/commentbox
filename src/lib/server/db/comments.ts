import { db } from './index'
import { comments } from './schema'
import { eq, isNull, desc, count } from 'drizzle-orm'

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type CreateCommentInput = Pick<NewComment, 'content' | 'parentId' | 'imageUrl'>

/**
 * Create a new comment (top-level or reply)
 */
export async function createComment(input: CreateCommentInput): Promise<Comment> {
	const valuesToInsert: NewComment = {
		content: input.content,
		parentId: input.parentId,
		imageUrl: input.imageUrl
	}
	const [comment] = await db.insert(comments).values(valuesToInsert).returning()
	return comment
}

/**
 * Get paginated top-level comments (comments without a parent),
 * ordered by creation date descending.
 */
export async function getTopLevelComments(limit: number, offset: number): Promise<Comment[]> {
	return db
		.select()
		.from(comments)
		.where(isNull(comments.parentId))
		.orderBy(desc(comments.createdAt))
		.limit(limit)
		.offset(offset)
}

/**
 * Get the total count of top-level comments.
 */
export async function getTopLevelCommentsCount(): Promise<number> {
	const result = await db.select({ count: count() }).from(comments).where(isNull(comments.parentId))

	return result[0]?.count ?? 0
}

/**
 * Get a single comment by its ID
 */
export async function getCommentById(id: number): Promise<Comment | undefined> {
	const [comment] = await db.select().from(comments).where(eq(comments.id, id)).limit(1)
	return comment
}

/**
 * Get all replies for a specific comment
 */
export async function getCommentReplies(parentId: number): Promise<Comment[]> {
	return db.select().from(comments).where(eq(comments.parentId, parentId))
}
