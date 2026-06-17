import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

const galleryTable = pgTable('image', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	s3_url: text('s3_url').notNull(),
	created_at: timestamp('created_at').notNull()
});

const {
	DATABASE_URL,
	S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY,
	S3_REGION,
	S3_BUCKET_NAME,
	CLOUDFRONT_URL,
	ALLOWED_ORIGIN
} = process.env;

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema: { galleryTable } });

const s3 = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY
	}
});

function corsHeaders(origin) {
	const allowed = ALLOWED_ORIGIN || '*';
	const allowOrigin = allowed === '*' || origin === allowed ? allowed : '';
	return {
		'Access-Control-Allow-Origin': allowOrigin,
		'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	};
}

function respond(statusCode, body, origin) {
	return {
		statusCode,
		headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
		body: JSON.stringify(body)
	};
}

export const handler = async (event) => {
	const origin = event.headers?.origin ?? event.headers?.Origin ?? '';
	const method = event.requestContext?.http?.method ?? event.httpMethod ?? 'GET';
	const path = event.requestContext?.http?.path ?? event.path ?? '/';

	if (method === 'OPTIONS') {
		return { statusCode: 204, headers: corsHeaders(origin), body: '' };
	}

	try {
		if (method === 'GET' && path === '/images') {
			const rows = await db.select().from(galleryTable).limit(50);
			return respond(200, rows, origin);
		}

		if (method === 'POST' && path === '/presign') {
			const body = JSON.parse(event.body ?? '{}');
			const { filename, contentType } = body;

			if (!filename || !contentType) {
				return respond(400, { error: 'filename and contentType are required' }, origin);
			}
			if (!contentType.startsWith('image/')) {
				return respond(400, { error: 'Only image files are allowed' }, origin);
			}

			const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
			const command = new PutObjectCommand({
				Bucket: S3_BUCKET_NAME,
				Key: key,
				ContentType: contentType
			});
			const url = await getSignedUrl(s3, command, { expiresIn: 300 });

			return respond(200, { url, key }, origin);
		}

		if (method === 'POST' && path === '/images') {
			const body = JSON.parse(event.body ?? '{}');
			const { title, key } = body;

			if (!title || typeof title !== 'string' || title.trim() === '') {
				return respond(400, { error: 'title is required' }, origin);
			}
			if (title.trim().length > 100) {
				return respond(400, { error: 'title must be 100 characters or less' }, origin);
			}
			if (!key || typeof key !== 'string') {
				return respond(400, { error: 'key is required' }, origin);
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

			return respond(201, { success: true, s3_url }, origin);
		}

		return respond(404, { error: 'Not found' }, origin);
	} catch (e) {
		console.error('[Lambda error]', e);
		return respond(500, { error: e instanceof Error ? e.message : 'Internal error' }, origin);
	}
};
