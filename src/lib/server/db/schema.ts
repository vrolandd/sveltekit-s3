import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const galleryTable = pgTable('image', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	s3_url: text('s3_url').notNull(),
	created_at: timestamp('created_at').notNull()
});
