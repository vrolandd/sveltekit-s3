import { json } from '@sveltejs/kit';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '$lib/server/s3';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { filename, contentType } = await request.json();

	if (!filename || !contentType) {
		return json({ error: 'filename and contentType are required' }, { status: 400 });
	}
	if (!contentType.startsWith('image/')) {
		return json({ error: 'Only image files are allowed' }, { status: 400 });
	}

	const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
	const command = new PutObjectCommand({
		Bucket: env.S3_BUCKET_NAME,
		Key: key,
		ContentType: contentType
	});
	const url = await getSignedUrl(s3, command, { expiresIn: 300 });

	return json({ url, key });
};
