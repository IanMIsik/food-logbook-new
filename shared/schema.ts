import { pgTable, text, serial, integer, real, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  caloriesPer100g: real("calories_per_100g").notNull(),
  proteinPer100g: real("protein_per_100g").notNull(),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  foodId: integer("food_id").notNull().references(() => foods.id),
  grams: real("grams").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodsRelations = relations(foods, ({ many }) => ({
  logs: many(logs),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  food: one(foods, {
    fields: [logs.foodId],
    references: [foods.id],
  }),
}));

export const insertFoodSchema = createInsertSchema(foods).omit({ id: true });
export const insertLogSchema = createInsertSchema(logs).omit({ id: true, createdAt: true });

export const updateFoodSchema = insertFoodSchema.partial();
export const updateLogSchema = insertLogSchema.partial();

export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type UpdateFood = z.infer<typeof updateFoodSchema>;
export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type UpdateLog = z.infer<typeof updateLogSchema>;

// Type for Log with joined Food data
export type LogWithFood = Log & { food: Food };

// Stats types
export type DailyStat = {
  date: string;
  totalCalories: number;
  totalProtein: number;
};
