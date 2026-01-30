import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export const rides = pgTable("rides", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  driverId: text("driver_id").notNull(),
  startToClientAt: text("start_to_client_at"),
  endToClientAt: text("end_to_client_at"),
  startWithClientAt: text("start_with_client_at"),
  endWithClientAt: text("end_with_client_at"),
  distanceToClient: text("distance_to_client"), // stored as string for simplicity in demo
  amount: text("amount"),
  platform: text("platform"), // Uber, Bolt, FreeNow
});

export const insertRideSchema = createInsertSchema(rides);
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Ride = typeof rides.$inferSelect;
