import { sqliteTable, text, integer, index, customType } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Custom type to handle Unix timestamps (seconds) stored as integers
const sqliteTimestampSeconds = customType<{
	data: Date
	nativeData: number // Represents the integer in the DB (seconds)
}>({
	dataType() {
		return 'integer'
	},
	// Convert from DB value (seconds) to JS Date
	fromDriver(value: unknown): Date {
		// Ensure the value is a number before multiplying
		if (typeof value === 'number') {
			return new Date(value * 1000)
		}
		// Handle potential null or other types, return current date or throw error
		console.warn(`Unexpected type for timestamp: ${typeof value}, value: ${value}`)
		return new Date() // Or throw an error, depending on desired behavior
	},
	// Convert from JS Date to DB value (seconds)
	toDriver(value: Date): number {
		return Math.floor(value.getTime() / 1000)
	}
})

export const comments = sqliteTable(
	'comments',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		content: text('content').notNull(),
		createdAt: sqliteTimestampSeconds('created_at') // Use the custom type
			.notNull()
			.default(sql`(cast(strftime('%s', 'now') as int))`),
		parentId: integer('parent_id').references(() => comments.id),
		imageUrl: text('image_url')
	},
	(table) => ({
		parentIdIdx: index('parent_id_idx').on(table.parentId)
	})
)
