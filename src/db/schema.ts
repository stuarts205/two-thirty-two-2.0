import { date } from "drizzle-orm/mysql-core";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const slides = pgTable("slide_info", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slidename: text("slidename").notNull(),
  people: text("people").notNull(),
  approxDate: text("approxDate").notNull(),
  // createdAt: date("created_at").defaultNow().notNull(),
  // updatedAt: date("updated_at").defaultNow().notNull(),
});

export const slideInsertSchema = createInsertSchema(slides);
export const slideSelectSchema = createSelectSchema(slides);
export const slideUpdateSchema = createUpdateSchema(slides);
