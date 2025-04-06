<script lang="ts">
	import type { PageData } from './$types'

	// Get data (comment and replies) from the load function using $props
	const { data }: { data: PageData } = $props()

	// Destructure for easier access in the template
	const { comment, replies } = data
</script>

<svelte:head>
	<title>Comment by {comment.id}</title> <!-- Or maybe use first few chars of content -->
</svelte:head>

<div class="mb-6">
	<a href="/" class="text-blue-500 hover:underline">&larr; Back to Feed</a>
</div>

<!-- Display the main comment -->
<article class="mb-8 border p-4 rounded-lg bg-gray-50 shadow-sm">
	<p class="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
	<footer class="text-sm text-gray-500 mt-2">
		Posted on: {comment.createdAt.toLocaleString()} (ID: {comment.id})
	</footer>
</article>

<!-- Display the replies -->
<h2 class="text-xl font-semibold mb-4">Replies ({replies.length})</h2>

{#if replies.length > 0}
	<div class="space-y-4 ml-4 md:ml-8 border-l-2 border-gray-200 pl-4">
		{#each replies as reply (reply.id)}
			<article class="border p-3 rounded-lg shadow-sm bg-white">
				<p class="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
				<footer class="text-sm text-gray-500 mt-2">
					Posted on: {reply.createdAt.toLocaleString()}
				</footer>
			</article>
		{/each}
	</div>
{:else}
	<p class="ml-4 md:ml-8 text-gray-600">No replies yet.</p>
{/if}

<!-- TODO: Add a form here to post a reply to the main comment -->

<style>
	/* Specific styles if needed */
</style> 