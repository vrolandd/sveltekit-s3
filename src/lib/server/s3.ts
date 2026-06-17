import { S3Client } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

if (!env.S3_ACCESS_KEY_ID) throw new Error('S3_ACCESS_KEY_ID is not set');
if (!env.S3_SECRET_ACCESS_KEY) throw new Error('S3_SECRET_ACCESS_KEY is not set');
if (!env.S3_REGION) throw new Error('S3_REGION is not set');

export const s3 = new S3Client({
	region: env.S3_REGION,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY_ID,
		secretAccessKey: env.S3_SECRET_ACCESS_KEY
	}
});
