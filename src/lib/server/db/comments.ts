import { db } from './index'
import { comments } from './schema'
import { eq, isNull } from 'drizzle-orm'

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type CreateCommentInput = Omit<NewComment, 'id' | 'createdAt' | 'parentId' | 'imageUrl'>

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
