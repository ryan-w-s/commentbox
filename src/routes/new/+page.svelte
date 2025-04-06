<script lang="ts">
	import type { ActionData } from './$types'

	// Declare props using $props() and type the destructured variable
	const { form }: { form: ActionData } = $props()

	// Local reactive state using $state rune
	let contentValue = $state(form?.content ?? '')
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
