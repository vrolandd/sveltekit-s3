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
		if (!file || !(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Please select an image file.' });
		}

		const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME, CLOUDFRONT_URL } =
			env;

		if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
			return fail(500, { error: 'S3 is not configured. Check AWS environment variables.' });
		}

		const s3 = new S3Client({
			region: AWS_REGION,
			credentials: {
				accessKeyId: AWS_ACCESS_KEY_ID,
				secretAccessKey: AWS_SECRET_ACCESS_KEY
			}
		});

		const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
		const buffer = Buffer.from(await file.arrayBuffer());

		try {
			await s3.send(
				new PutObjectCommand({
					Bucket: AWS_BUCKET_NAME,
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
			: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;
		const s3_url = `${base}/${key}`;

		await db.insert(galleryTable).values({
			title: title.trim(),
			s3_url,
			created_at: new Date()
		});

		return { success: true, url: s3_url, title: title.trim() };
	}
};
