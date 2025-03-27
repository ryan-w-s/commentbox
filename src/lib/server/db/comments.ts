import { db } from './index'
import { comments } from './schema'
import { eq, isNull } from 'drizzle-orm'

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type CreateCommentInput = Omit<NewComment, 'id' | 'createdAt'>

/**
 * Create a new comment
 */
export async function createComment(input: CreateCommentInput): Promise<Comment> {
	const [comment] = await db.insert(comments).values(input).returning()
	return comment
}

/**
 * Get all top-level comments (comments without a parent)
 */
export async function getTopLevelComments(): Promise<Comment[]> {
	return db.select().from(comments).where(isNull(comments.parentId))
}

/**
 * Get all replies for a specific comment
 */
export async function getCommentReplies(parentId: number): Promise<Comment[]> {
	return db.select().from(comments).where(eq(comments.parentId, parentId))
}
