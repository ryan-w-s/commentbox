<script lang="ts">
	import type { PageData } from './$types'

	// Get data (comment and replies) from the load function using $props
	const { data }: { data: PageData } = $props()

	// Destructure for easier access in the template
	const { comment, replies } = data
</script>

<svelte:head>
	<title>Comment by {comment.id}</title>
	<!-- Or maybe use first few chars of content -->
</svelte:head>

<div class="mb-6">
	<a href="/" class="text-blue-500 hover:underline">&larr; Back to Feed</a>
</div>

<!-- Display the main comment -->
<article class="mb-8 rounded-lg border bg-gray-50 p-4 shadow-sm">
	<p class="whitespace-pre-wrap text-gray-800">{comment.content}</p>
	<footer class="mt-2 text-sm text-gray-500">
		Posted on: {comment.createdAt.toLocaleString()} (ID: {comment.id})
	</footer>
</article>

<!-- Display the replies -->
<h2 class="mb-4 text-xl font-semibold">Replies ({replies.length})</h2>

{#if replies.length > 0}
	<div class="ml-4 space-y-4 border-l-2 border-gray-200 pl-4 md:ml-8">
		{#each replies as reply (reply.id)}
			<article class="rounded-lg border bg-white p-3 shadow-sm">
				<p class="whitespace-pre-wrap text-gray-700">{reply.content}</p>
				<footer class="mt-2 text-sm text-gray-500">
					Posted on: {reply.createdAt.toLocaleString()}
				</footer>
			</article>
		{/each}
	</div>
{:else}
	<p class="ml-4 text-gray-600 md:ml-8">No replies yet.</p>
{/if}

<div class="mt-8 ml-4 border-t pt-4 md:ml-8">
	<h3 class="mb-3 text-lg font-semibold">Post a Reply</h3>
	<!-- Link to the /new page, passing the current comment's ID -->
	<a
		href="/new?parentId={comment.id}"
		class="inline-block rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
	>
		Write Reply
	</a>
</div>

<style>
	/* Specific styles if needed */
</style>
