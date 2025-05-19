import { integer, json, pgTable, serial, varchar, numeric, text, timestamp } from "drizzle-orm/pg-core";

export const CarListing = pgTable('carListing', {
    id: serial('id').primaryKey(),
    listingTitle: text('listingTitle').notNull(),
    tagline: text('tagline'),
    originalPrice: numeric('originalPrice', { precision: 12, scale: 2 }),
    sellingPrice: numeric('sellingPrice', { precision: 12, scale: 2 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    condition: varchar('condition', { length: 20 }).notNull(),
    make: varchar('make', { length: 50 }).notNull(),
    model: varchar('model', { length: 50 }).notNull(),
    year: integer('year').notNull(),
    driveType: varchar('driveType', { length: 20 }).notNull(),
    transmission: varchar('transmission', { length: 20 }).notNull(),
    fuelType: varchar('fuelType', { length: 20 }).notNull(),
    mileage: integer('mileage').notNull(),
    engineSize: numeric('engineSize', { precision: 3, scale: 1 }),
    cylinder: integer('cylinder'),
    color: varchar('color', { length: 30 }).notNull(),
    door: integer('door').notNull(),
    vin: varchar('vin', { length: 17 }),
    offerType: varchar('offerType', { length: 20 }),
    listingDescription: text('listingDescription').notNull(),
    features: json('features'),
    createdBy: integer('createdBy').notNull().references(() => User.id),
    postedOn: timestamp('postedOn', { mode: 'date' }).defaultNow()
});

export const CarImages = pgTable('carImages', {
    id: serial('id').primaryKey(),
    imageUrl: varchar('imageUrl').notNull(),
    carListingId: integer('carListingId').notNull().references(() => CarListing.id),
});


export const User = pgTable('user', {
    id: serial('id').primaryKey(),
    clerkUserId: varchar('clerkUserId').notNull().unique(),
    firstName: varchar('firstName'),
    lastName: varchar('lastName'),
    email: varchar('email').notNull().unique(),
    phoneNumber: varchar('phoneNumber'),
    address: json('address'),
});

