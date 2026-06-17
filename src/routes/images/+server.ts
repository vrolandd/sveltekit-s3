import { json } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryTable } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const rows = await db
		.select()
		.from(galleryTable)
		.orderBy(desc(galleryTable.created_at))
		.limit(50);
	return json(rows);
};

export const POST: RequestHandler = async ({ request }) => {
	const { title, key } = await request.json();

	if (!title || typeof title !== 'string' || title.trim() === '') {
		return json({ error: 'title is required' }, { status: 400 });
	}
	if (title.trim().length > 100) {
		return json({ error: 'title must be 100 characters or less' }, { status: 400 });
	}
	if (!key || typeof key !== 'string') {
		return json({ error: 'key is required' }, { status: 400 });
	}

	const base = env.CLOUDFRONT_URL
		? env.CLOUDFRONT_URL.replace(/\/$/, '')
		: `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com`;
	const s3_url = `${base}/${key}`;

	await db.insert(galleryTable).values({
		title: title.trim(),
		s3_url,
		created_at: new Date()
	});

	return json({ success: true, s3_url }, { status: 201 });
};
