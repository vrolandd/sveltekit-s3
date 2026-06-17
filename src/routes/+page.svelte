<script lang="ts">
	import GalleryImage from '../components/GalleryImage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto w-full max-w-7xl px-6 py-10">
	{#await data.gallery}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each { length: 8 } as index (index)}
				<div class="aspect-square animate-pulse rounded-2xl bg-neutral-700"></div>
			{/each}
		</div>
	{:then gallery}
		{#if gallery.length === 0}
			<div class="flex flex-col items-center justify-center py-32 text-center">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-gray-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<p class="text-lg font-medium text-gray-300">No images yet</p>
				<p class="mt-1 text-sm text-gray-500">Upload your first image to get started.</p>
				<a
					href="/upload"
					class="mt-6 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
				>
					Upload an image
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each gallery as item (item.id)}
					<GalleryImage title={item.title} url={item.s3_url} />
				{/each}
			</div>
		{/if}
	{/await}
</div>
