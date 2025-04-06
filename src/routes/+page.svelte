<script lang="ts">
	import type { PageData } from './$types'

	// Declare props using $props() and type the destructured variable
	const { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>Comment Feed</title>
</svelte:head>

<h1 class="mb-4 text-2xl font-bold">Latest Comments</h1>

{#if data.error}
	<p class="text-red-500">Error loading comments: {data.error}</p>
{:else if data.comments && data.comments.length > 0}
	<div class="space-y-4">
		{#each data.comments as comment (comment.id)}
			<article class="rounded-lg border p-4 shadow-sm">
				<p class="whitespace-pre-wrap text-gray-700">{comment.content}</p>
				<footer class="mt-2 text-sm text-gray-500">
					Posted on: {comment.createdAt.toLocaleString()}
					<!-- Link to the individual comment page (we'll create this later) -->
					<a href="/{comment.id}" class="ml-4 text-blue-500 hover:underline">View Replies</a>
				</footer>
			</article>
		{/each}
	</div>
{:else}
	<p>No comments yet. Be the first!</p>
{/if}

<style>
	/* Add any specific styles if needed */
</style>
