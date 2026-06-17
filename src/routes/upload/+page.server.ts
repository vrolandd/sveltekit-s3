import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { galleryTable } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		const file = data.get('file');

		if (!title || typeof title !== 'string' || title.trim() === '') {
			return fail(400, { error: 'Title is required.' });
		}
		if (title.trim().length > 100) {
			return fail(400, { error: 'Title must be 100 characters or less.' });
		}
		if (!file || !(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Please select an image file.' });
		}

		const {
			S3_ACCESS_KEY_ID,
			S3_SECRET_ACCESS_KEY,
			S3_REGION,
			S3_BUCKET_NAME,
			CLOUDFRONT_URL
		} = env;

		if (!S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_REGION || !S3_BUCKET_NAME) {
			return fail(500, { error: 'S3 is not configured. Check S3 environment variables.' });
		}

		const s3 = new S3Client({
			region: S3_REGION,
			credentials: {
				accessKeyId: S3_ACCESS_KEY_ID,
				secretAccessKey: S3_SECRET_ACCESS_KEY
			}
		});

		const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
		const buffer = Buffer.from(await file.arrayBuffer());

		try {
			await s3.send(
				new PutObjectCommand({
					Bucket: S3_BUCKET_NAME,
					Key: key,
					Body: buffer,
					ContentType: file.type
				})
			);
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			console.error('[S3 upload error]', message);
			return fail(500, { error: `Upload to S3 failed: ${message}` });
		}

		const base = CLOUDFRONT_URL
			? CLOUDFRONT_URL.replace(/\/$/, '')
			: `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;
		const s3_url = `${base}/${key}`;

		await db.insert(galleryTable).values({
			title: title.trim(),
			s3_url,
			created_at: new Date()
		});

		return { success: true, url: s3_url, title: title.trim() };
	}
};
