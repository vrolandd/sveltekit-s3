import { db } from '$lib/server/db';
import { galleryTable } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const gallery = db.select().from(galleryTable).limit(50);

	return {
		gallery
	};
};
