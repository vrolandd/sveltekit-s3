<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);
	let fileName = $state('');
</script>

<div class="py-8">
	<h2 class="mb-6 text-2xl font-bold text-indigo-700">Upload Image</h2>

	{#if form?.success}
		<div class="mb-6 rounded-lg border border-green-300 bg-green-50 p-4">
			<p class="font-medium text-green-800">"{form.title}" uploaded successfully!</p>
			<img src={form.url} alt={form.title} class="mt-3 max-h-64 rounded-md object-cover shadow" />
		</div>
	{/if}

	{#if form?.error}
		<div class="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
			<p class="text-red-800">{form.error}</p>
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		class="flex max-w-lg flex-col gap-5"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
				fileName = '';
			};
		}}
	>
		<div class="flex flex-col gap-1.5">
			<label for="title" class="font-medium text-gray-700">Title</label>
			<input
				id="title"
				name="title"
				type="text"
				required
				placeholder="My image"
				class="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="file" class="font-medium text-gray-700">Image</label>
			<label
				for="file"
				class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-indigo-300 bg-indigo-50 px-4 py-8 text-indigo-600 transition hover:border-indigo-500 hover:bg-indigo-100"
			>
				{#if fileName}
					<span class="text-sm font-medium">{fileName}</span>
					<span class="text-xs text-indigo-400">Click to change</span>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 opacity-60"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
						/>
					</svg>
					<span class="text-sm font-medium">Click to select an image</span>
					<span class="text-xs text-indigo-400">PNG, JPG, GIF, WebP</span>
				{/if}
				<input
					id="file"
					name="file"
					type="file"
					accept="image/*"
					required
					class="sr-only"
					onchange={(e) => {
						const input = e.currentTarget as HTMLInputElement;
						fileName = input.files?.[0]?.name ?? '';
					}}
				/>
			</label>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{#if loading}
				<svg
					class="h-4 w-4 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				Uploading…
			{:else}
				Upload
			{/if}
		</button>
	</form>
</div>
