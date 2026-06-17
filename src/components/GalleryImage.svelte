<script lang="ts">
	const { title, url } = $props();
</script>

<div
	class="group relative overflow-hidden rounded-2xl bg-gray-800 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
>
	<div class="aspect-square overflow-hidden">
		<img
			src={url}
			alt={title}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
	</div>
	<div
		class="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-gray-950/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0"
	>
		<p class="truncate text-sm font-medium text-white">{title}</p>
	</div>
</div>
