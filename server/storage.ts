import {
  foods, logs,
  type Food, type InsertFood, type UpdateFood,
  type Log, type InsertLog, type UpdateLog,
  type LogWithFood,
  type DailyStat
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  getFoods(search?: string): Promise<Food[]>;
  getFood(id: number): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;
  updateFood(id: number, food: UpdateFood): Promise<Food>;
  deleteFood(id: number): Promise<void>;

  getLogs(date?: string, from?: string, to?: string): Promise<LogWithFood[]>;
  createLog(log: InsertLog): Promise<Log>;
  updateLog(id: number, log: UpdateLog): Promise<Log>;
  deleteLog(id: number): Promise<void>;

  getDailyStats(from?: string, to?: string): Promise<DailyStat[]>;
}

export class DatabaseStorage implements IStorage {
  async getFoods(search?: string): Promise<Food[]> {
    if (search) {
      return await db.select().from(foods).where(sql`lower(${foods.name}) LIKE ${`%${search.toLowerCase()}%`}`);
    }
    return await db.select().from(foods);
  }

  async getFood(id: number): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.id, id));
    return food;
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const [food] = await db.insert(foods).values(insertFood).returning();
    return food;
  }

  async updateFood(id: number, updateFood: UpdateFood): Promise<Food> {
    const [food] = await db.update(foods).set(updateFood).where(eq(foods.id, id)).returning();
    return food;
  }

  async deleteFood(id: number): Promise<void> {
    // Check if food has logs
    const existingLogs = await db.select().from(logs).where(eq(logs.foodId, id)).limit(1);
    if (existingLogs.length > 0) {
      throw new Error("Cannot delete food that has associated logs");
    }
    await db.delete(foods).where(eq(foods.id, id));
  }

  async getLogs(date?: string, from?: string, to?: string): Promise<LogWithFood[]> {
    let conditions = [];
    if (date) conditions.push(eq(logs.date, date));
    if (from) conditions.push(gte(logs.date, from));
    if (to) conditions.push(lte(logs.date, to));

    const result = await db.select()
      .from(logs)
      .innerJoin(foods, eq(logs.foodId, foods.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(logs.date), desc(logs.createdAt));
      
    return result.map(({ logs, foods }) => ({
      ...logs,
      food: foods
    }));
  }

  async createLog(insertLog: InsertLog): Promise<Log> {
    const [log] = await db.insert(logs).values(insertLog).returning();
    return log;
  }

  async updateLog(id: number, updateLog: UpdateLog): Promise<Log> {
    const [log] = await db.update(logs).set(updateLog).where(eq(logs.id, id)).returning();
    return log;
  }

  async deleteLog(id: number): Promise<void> {
    await db.delete(logs).where(eq(logs.id, id));
  }

  async getDailyStats(from?: string, to?: string): Promise<DailyStat[]> {
    let conditions = [];
    if (from) conditions.push(gte(logs.date, from));
    if (to) conditions.push(lte(logs.date, to));

    const result = await db.select({
      date: logs.date,
      totalCalories: sql<number>`sum((${logs.grams} / 100) * ${foods.caloriesPer100g})`.mapWith(Number),
      totalProtein: sql<number>`sum((${logs.grams} / 100) * ${foods.proteinPer100g})`.mapWith(Number),
    })
    .from(logs)
    .innerJoin(foods, eq(logs.foodId, foods.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(logs.date)
    .orderBy(desc(logs.date));

    return result;
  }
}

export const storage = new DatabaseStorage();
