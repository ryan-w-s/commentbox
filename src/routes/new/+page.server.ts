import { fail, redirect, type RequestEvent, isRedirect } from '@sveltejs/kit'
import { createComment } from '$lib/server/db/comments'
import type { Actions } from './$types'
import fs from 'node:fs/promises' // Import Node.js file system promises API
import path from 'node:path' // Import Node.js path module
import crypto from 'node:crypto' // For generating unique names

const UPLOAD_DIR = 'static/uploads' // Define upload directory constant

export const actions = {
	default: async (event: RequestEvent) => {
		const data = await event.request.formData()
		const content = data.get('content') as string | null
		const parentIdRaw = data.get('parentId') as string | null
		const imageFile = data.get('image') as File | null // Get the image file

		let parentId: number | undefined = undefined
		let imageUrl: string | undefined = undefined // Variable to hold image path

		if (parentIdRaw) {
			parentId = parseInt(parentIdRaw, 10)
			if (isNaN(parentId)) {
				return fail(400, { content, parentIdRaw, error: 'Invalid parent ID format' })
			}
		}

		if (!content) {
			return fail(400, { content, parentIdRaw, missing: true })
		}

		// --- Image Upload Handling ---
		if (imageFile && imageFile.size > 0) {
			// Basic validation (optional: check file type, size limits)
			if (!imageFile.type.startsWith('image/')) {
				return fail(400, { content, parentIdRaw, error: 'Invalid file type. Only images allowed.' })
			}

			try {
				// Generate unique filename
				const buffer = Buffer.from(await imageFile.arrayBuffer())
				const uniqueSuffix = crypto.randomBytes(8).toString('hex')
				const extension = path.extname(imageFile.name) || '.jpg' // Default extension
				const filename = `${uniqueSuffix}${extension}`
				const uploadPath = path.join(UPLOAD_DIR, filename)

				// Save the file
				await fs.writeFile(uploadPath, buffer)

				// Set the URL path for the database
				imageUrl = `/uploads/${filename}` // Web-accessible path
			} catch (uploadError) {
				console.error('Failed to upload image:', uploadError)
				return fail(500, { content, parentIdRaw, error: 'Failed to save uploaded image' })
			}
		}
		// --- End Image Upload Handling ---

		try {
			// Pass parentId and potentially imageUrl
			await createComment({ content, parentId, imageUrl })

			// Redirect based on whether it was a reply or not
			if (parentId) {
				throw redirect(303, `/${parentId}`)
			} else {
				throw redirect(303, '/')
			}
		} catch (error: unknown) {
			if (isRedirect(error)) {
				throw error
			}
			console.error('Failed to create comment:', error)
			return fail(500, { content, parentIdRaw, error: 'Failed to save comment' })
		}
	}
} satisfies Actions
