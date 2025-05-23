import { integer, json, pgTable, serial, varchar, numeric, text, timestamp } from "drizzle-orm/pg-core";

export const CarListing = pgTable('carListing', {
    id: serial('id').primaryKey(),
    listingTitle: text('listingTitle').notNull(),
    tagline: text('tagline'),
    originalPrice: numeric('originalPrice', { precision: 12, scale: 2 }),
    sellingPrice: numeric('sellingPrice', { precision: 12, scale: 2 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    condition: varchar('condition', { length: 40 }).notNull(),
    make: varchar('make', { length: 50 }).notNull(),
    model: varchar('model', { length: 50 }).notNull(),
    year: integer('year').notNull(),
    driveType: varchar('driveType', { length: 50 }).notNull(),
    transmission: varchar('transmission', { length: 50 }).notNull(),
    fuelType: varchar('fuelType', { length: 50 }).notNull(),
    mileage: integer('mileage').notNull(),
    engineSize: numeric('engineSize', { precision: 3, scale: 1 }),
    cylinder: integer('cylinder'),
    color: varchar('color', { length: 30 }).notNull(),
    door: integer('door').notNull(),
    vin: varchar('vin', { length: 50 }),
    offerType: varchar('offerType', { length: 20 }),
    listingDescription: text('listingDescription').notNull(),
    features: json('features'),
    createdBy: integer('createdBy').notNull().references(() => User.id),
    postedOn: timestamp('postedOn', { mode: 'date' }).defaultNow()
});

export const CarImages = pgTable('carImages', {
    id: serial('id').primaryKey(),
    imageUrl: varchar('imageUrl').notNull(),
    carListingId: integer('carListingId').notNull().references(() => CarListing.id, { onDelete: 'cascade' }) 
});


export const User = pgTable('user', {
    id: serial('id').primaryKey(),
    clerkUserId: varchar('clerkUserId').notNull().unique(),
    firstName: varchar('firstName'),
    lastName: varchar('lastName'),
    email: varchar('email').notNull().unique(),
    phoneNumber: varchar('phoneNumber'),
    address: varchar('address'),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull().references(() => User.id, { onDelete: 'cascade' }),
  carListingId: integer('carListingId').notNull().references(() => CarListing.id, { onDelete: 'cascade' }),
});

export const Comment = pgTable('comment', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().references(() => User.id, { onDelete: 'cascade' }),
    carListingId: integer('carListingId').notNull().references(() => CarListing.id, { onDelete: 'cascade' }),
    commentText: text('commentText').notNull(),
    rating: integer('rating').notNull().default(5),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const BlogPost = pgTable('blogPost', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    imageUrls: json('imageUrls').notNull(),
    userId: integer('userId').notNull().references(() => User.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow()
  });
  
export const BlogComment = pgTable('blogComment', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    blogPostId: integer('blogPostId').notNull().references(() => BlogPost.id, { onDelete: 'cascade' }),
    userId: integer('userId').notNull().references(() => User.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow()
  });

  // schema.ts
export const BlogImages = pgTable('blog_images', {
    id: serial('id').primaryKey(),
    imageUrl: varchar('image_url', { length: 2048 }).notNull(),
    blogPostId: integer('blog_post_id').references(() => BlogPost.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  });