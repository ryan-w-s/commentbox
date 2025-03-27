import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const comments = sqliteTable(
	'comments',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		content: text('content').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		parentId: integer('parent_id').references(() => comments.id),
		imageUrl: text('image_url')
	},
	(table) => ({
		parentIdIdx: index('parent_id_idx').on(table.parentId)
	})
)
