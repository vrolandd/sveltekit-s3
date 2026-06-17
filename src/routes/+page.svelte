<script lang="ts">
	import GalleryImage from '../components/GalleryImage.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

{#await data.gallery}
	loading...
{:then gallery}
	<div class="grid grid-cols-4">
		{#each gallery as item (item.id)}
			<GalleryImage title={item.title} url={item.s3_url} />
		{/each}
	</div>
{/await}
