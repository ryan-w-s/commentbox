<script lang="ts">
	import type { PageData } from './$types'

	// Declare props using $props() and type the destructured variable
	const { data }: { data: PageData } = $props()

	// No longer destructuring currentPage, totalPages, etc. here
	// Access them directly via data in the template
	
	// Reactive calculation for prev/next page numbers using data directly
	const prevPage = $derived(data.currentPage > 1 ? data.currentPage - 1 : null)
	const nextPage = $derived(data.currentPage < data.totalPages ? data.currentPage + 1 : null)

</script>

<svelte:head>
	<title>Comment Feed - Page {data.currentPage}</title>
</svelte:head>

<h1 class="mb-4 text-2xl font-bold">Latest Comments (Page {data.currentPage} of {data.totalPages})</h1>

{#key data.currentPage}
	{#if data.error}
		<p class="text-red-500">Error loading comments: {data.error}</p>
	{:else if data.comments && data.comments.length > 0}
		<div class="space-y-4">
			{#each data.comments as comment (comment.id)}
				<article class="rounded-lg border p-4 shadow-sm">
					{#if comment.imageUrl}
						<img 
							src={comment.imageUrl} 
							alt="Uploaded content for comment {comment.id}" 
							class="mb-3 max-h-60 w-auto rounded border" 
						/>
					{/if}
					<p class="whitespace-pre-wrap text-gray-700">{comment.content}</p>
					<footer class="mt-2 text-sm text-gray-500">
						Posted on: {comment.createdAt.toLocaleString()}
						<!-- Link to the individual comment page (we'll create this later) -->
						<a href="/{comment.id}" class="ml-4 text-blue-500 hover:underline">View Replies</a>
					</footer>
				</article>
			{/each}
		</div>

		<!-- Pagination Controls -->
		<div class="mt-8 mb-6 flex justify-between items-center">
			{#if prevPage}
				<a href="/?page={prevPage}" 
				   class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
					&larr; Previous
				</a>
			{:else}
				<span class="rounded bg-gray-100 px-4 py-2 text-gray-400 cursor-not-allowed">
					&larr; Previous
				</span>
			{/if}

			<span>Page {data.currentPage} of {data.totalPages}</span>

			{#if nextPage}
				<a href="/?page={nextPage}" 
				   class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
					Next &rarr;
				</a>
			{:else}
				<span class="rounded bg-gray-100 px-4 py-2 text-gray-400 cursor-not-allowed">
					Next &rarr;
				</span>
			{/if}
		</div>

	{:else}
		<p>No comments yet. Be the first!</p>
	{/if}
{/key}

<style>
	/* Add any specific styles if needed */
</style>
