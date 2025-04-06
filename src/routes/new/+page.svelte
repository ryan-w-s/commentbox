<script lang="ts">
	import type { ActionData } from './$types'
	import { page } from '$app/stores' // Import page store

	// Declare props using $props() and type the destructured variable
	const { form }: { form: ActionData } = $props()

	// Get parentId from URL query string (?parentId=...)
	let parentId: string | null = $page.url.searchParams.get('parentId')

	// Local reactive state using $state rune
	let contentValue = $state(form?.content ?? '')

	// Determine if this form is for a reply using $derived
	const isReply = $derived(!!parentId)
</script>

<svelte:head>
	<title>{isReply ? 'Reply to Comment' : 'Post a New Comment'}</title>
</svelte:head>

<h1 class="mb-4 text-2xl font-bold">
	{isReply ? 'Post a Reply' : 'Post a New Comment'}
</h1>

{#if isReply}
	<p class="mb-4 text-sm text-gray-600">Replying to comment ID: {parentId}</p>
{/if}

<form
	method="POST"
	enctype="multipart/form-data"
	class="mx-auto flex max-w-md flex-col gap-4 rounded-lg border p-4"
>
	{#if isReply && parentId}
		<!-- Hidden input to send parentId -->
		<input type="hidden" name="parentId" value={parentId} />
	{/if}

	<label class="flex flex-col">
		<span class="mb-1 font-medium">Your {isReply ? 'Reply' : 'Comment'}:</span>
		<textarea name="content" rows="4" class="rounded border p-2" required bind:value={contentValue}
		></textarea>
		{#if form?.missing && !contentValue}
			<p class="mt-1 text-sm text-red-500">
				{isReply ? 'Reply' : 'Comment'} content cannot be empty.
			</p>
		{/if}
	</label>

	<!-- Image Upload Input -->
	<label class="flex flex-col">
		<span class="mb-1 font-medium">Attach Image (Optional):</span>
		<input
			type="file"
			name="image"
			accept="image/*"
			class="rounded border p-2 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
		/>
	</label>
	<!-- End Image Upload Input -->

	<button type="submit" class="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
		{isReply ? 'Post Reply' : 'Post Comment'}
	</button>

	{#if form?.error}
		<p class="text-red-500">Error: {form.error}</p>
	{/if}
</form>
