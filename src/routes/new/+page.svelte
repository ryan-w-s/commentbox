<script lang="ts">
	import type { ActionData } from './$types'

	// This holds the data returned from the server action (success or error)
	export let form: ActionData

	// Local variable to hold the textarea content
	let contentValue = form?.content ?? ''
</script>

<h1>Post a New Comment</h1>

<form method="POST" class="mx-auto flex max-w-md flex-col gap-4 rounded-lg border p-4">
	<label class="flex flex-col">
		<span class="mb-1 font-medium">Your Comment:</span>
		<textarea name="content" rows="4" class="rounded border p-2" required bind:value={contentValue}
		></textarea>
		{#if form?.missing && !form?.content}
			<p class="mt-1 text-sm text-red-500">Comment content cannot be empty.</p>
		{/if}
	</label>

	<button type="submit" class="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
		Post Comment
	</button>

	{#if form?.error}
		<p class="text-red-500">Error: {form.error}</p>
	{/if}
</form>
