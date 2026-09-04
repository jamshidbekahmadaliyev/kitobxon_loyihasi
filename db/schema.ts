import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"),
  telegramId: text("telegram_id").unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const books = sqliteTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  authorId: text("author_id"),
  description: text("description"),
  coverUrl: text("cover_url"),
  pageCount: integer("page_count"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const userBooks = sqliteTable("user_books", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  bookId: text("book_id").notNull().references(() => books.id),
  status: text("status").notNull(), // 'want_to_read', 'reading', 'finished', 'paused', 'dropped'
  currentPage: integer("current_page").default(0),
  startedAt: integer("started_at", { mode: "timestamp" }),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const thoughts = sqliteTable("thoughts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  bookId: text("book_id").notNull().references(() => books.id),
  content: text("content").notNull(),
  containsSpoiler: integer("contains_spoiler", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  thoughtId: text("thought_id").notNull().references(() => thoughts.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const follows = sqliteTable("follows", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").notNull().references(() => users.id),
  followingId: text("following_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
