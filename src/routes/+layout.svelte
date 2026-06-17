<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
	<div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-2.5">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 text-white"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M4 5a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2H4zm0 2h16v6.586l-3.293-3.293a1 1 0 00-1.414 0L11 14.586l-2.293-2.293a1 1 0 00-1.414 0L4 15.586V7z"
					/>
				</svg>
			</div>
			<span class="text-lg font-semibold tracking-tight text-white">Mediarack</span>
		</a>

		<nav class="flex items-center gap-3">
			<a
				href="/"
				class="text-sm font-medium transition-colors {$page.url.pathname === '/'
					? 'text-white'
					: 'text-gray-400 hover:text-white'}"
			>
				Gallery
			</a>
			<a
				href="/upload"
				class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all {$page.url.pathname === '/upload'
					? 'bg-indigo-400 text-white'
					: 'bg-indigo-500 text-white hover:bg-indigo-400'}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
				</svg>
				Upload
			</a>
		</nav>
	</div>
</header>

<main class="flex min-h-0 flex-1 flex-col">
	{@render children()}
</main>
