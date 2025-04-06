<script lang="ts">
	import '../app.css'

	let { children } = $props()
</script>

<nav class="mb-6 border-b bg-gray-100 p-4">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/" class="text-lg font-semibold hover:text-blue-600">CommentBox</a>
		<div>
			<a href="/new" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				New Comment
			</a>
		</div>
	</div>
</nav>

<!-- This renders the content of the current page -->
<main class="container mx-auto px-4">
	{@render children()}
</main>

<style lang="postcss">
	/* Ensure Tailwind directives are present, e.g., in app.html or a global css file */
	/* For simplicity, assuming Tailwind base styles are applied globally */
</style>
