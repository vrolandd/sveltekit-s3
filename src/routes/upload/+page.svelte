<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);
	let file = $state<File | null>(null);
	let preview = $state<string | null>(null);
	let dragging = $state(false);

	function pickFile(f: File) {
		file = f;
		preview = URL.createObjectURL(f);
	}

	function onFileInput(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (input.files?.[0]) pickFile(input.files[0]);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const dropped = e.dataTransfer?.files[0];
		if (dropped?.type.startsWith('image/')) pickFile(dropped);
	}

	function clearFile() {
		file = null;
		if (preview) URL.revokeObjectURL(preview);
		preview = null;
	}
</script>

<div class="mx-auto w-full max-w-2xl px-6 py-12">
	<div class="mb-8">
		<h2 class="text-2xl font-bold text-white">Upload image</h2>
		<p class="mt-1 text-sm text-gray-400">
			Drag and drop or browse to add an image to your gallery.
		</p>
	</div>

	{#if form?.success}
		<div
			class="mb-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4"
		>
			<svg
				class="mt-0.5 h-5 w-5 shrink-0 text-green-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<div>
				<p class="font-medium text-green-300">Upload successful</p>
				<p class="mt-0.5 text-sm text-green-400/80">
					"{form.title}" has been added to your gallery.
				</p>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
			<svg
				class="mt-0.5 h-5 w-5 shrink-0 text-red-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
			<p class="text-sm text-red-300">{form.error}</p>
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col gap-6"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
				clearFile();
			};
		}}
	>
		<!-- Drop zone -->
		<div
			role="button"
			tabindex="0"
			class="relative overflow-hidden rounded-2xl border-2 transition-all duration-200 {dragging
				? 'border-indigo-400 bg-indigo-500/10'
				: preview
					? 'border-transparent'
					: 'border-dashed border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-800/60'}"
			ondragover={(e) => {
				e.preventDefault();
				dragging = true;
			}}
			ondragleave={() => {
				dragging = false;
			}}
			ondrop={onDrop}
			onclick={() => !preview && document.getElementById('file-input')?.click()}
			onkeydown={(e) =>
				e.key === 'Enter' && !preview && document.getElementById('file-input')?.click()}
		>
			{#if preview}
				<div class="relative">
					<img src={preview} alt="Preview" class="max-h-80 w-full object-cover" />
					<div class="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							clearFile();
						}}
						aria-label="Remove selected image"
						class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-950/70 text-gray-300 backdrop-blur-sm hover:bg-gray-950 hover:text-white"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<div class="absolute bottom-3 left-4 right-4">
						<p class="truncate text-sm font-medium text-white">{file?.name}</p>
						<p class="text-xs text-gray-300">{file ? (file.size / 1024).toFixed(0) + ' KB' : ''}</p>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center gap-3 py-14">
					<div
						class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							/>
						</svg>
					</div>
					<div class="text-center">
						<p class="font-medium text-gray-200">
							Drop your image here, or <span class="text-indigo-400">browse</span>
						</p>
						<p class="mt-0.5 text-xs text-gray-500">PNG, JPG, WebP, GIF up to 50 MB</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Hidden real file input so form submission works -->
		<input
			id="file-input"
			name="file"
			type="file"
			accept="image/*"
			required
			class="sr-only"
			onchange={onFileInput}
		/>

		<!-- Title -->
		<div class="flex flex-col gap-2">
			<label for="title" class="text-sm font-medium text-gray-300 flex flex-wrap"
				>Title <span class="text-neutral-500 text-sm text-right ml-auto">(max. 100 characters)</span
				></label
			>
			<input
				id="title"
				name="title"
				type="text"
				required
				placeholder="My awesome photo"
				class="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
			/>
		</div>

		<button
			type="submit"
			disabled={loading || !file}
			class="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
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
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/>
				</svg>
				Upload to gallery
			{/if}
		</button>
	</form>
</div>
