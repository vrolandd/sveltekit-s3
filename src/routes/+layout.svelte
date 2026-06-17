<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="bg-indigo-200 border-b border-b-indigo-300 py-4 flex justify-center px-6">
	<div class="w-full max-w-7xl flex">
		<h1 class="text-indigo-600 font-bold text-3xl">S3 Image Gallery</h1>
	</div>
</header>

<main class="flex-1 flex justify-center w-full px-6">
	<div class="flex flex-col max-w-7xl w-full pt-4">
		{@render children()}
	</div>
</main>
