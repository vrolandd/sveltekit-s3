<script lang="ts">
	const { title, url } = $props();
</script>

<div class="rounded-3xl bg-indigo-50 border border-indigo-300 flex flex-col gap-2 pb-2">
	<img src={url} class="aspect-[1/1] w-full bg-indigo-100 rounded-3xl" alt="gallery item" />
	<h1 class="text-xl px-5">{title}</h1>
</div>
