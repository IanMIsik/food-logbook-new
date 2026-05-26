import express, { type Request, Response, NextFunction } from "express";
import { db } from "../server/db";
import {
  foods, logs,
  type InsertFood, type UpdateFood,
  type InsertLog, type UpdateLog,
} from "../shared/schema";
import { api } from "../shared/routes";
import { eq, and, gte, lte, desc, sql, type SQL } from "drizzle-orm";
import { z } from "zod";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Storage functions
async function getFoods(search?: string) {
  if (search) {
    return await db.select().from(foods).where(sql`lower(${foods.name}) LIKE ${`%${search.toLowerCase()}%`}`);
  }
  return await db.select().from(foods);
}

async function getFood(id: number) {
  const [food] = await db.select().from(foods).where(eq(foods.id, id));
  return food;
}

async function createFood(insertFood: InsertFood) {
  const [food] = await db.insert(foods).values(insertFood).returning();
  return food;
}

async function updateFood(id: number, updateFood: UpdateFood) {
  const [food] = await db.update(foods).set(updateFood).where(eq(foods.id, id)).returning();
  return food;
}

async function deleteFood(id: number) {
  const existingLogs = await db.select().from(logs).where(eq(logs.foodId, id)).limit(1);
  if (existingLogs.length > 0) {
    throw new Error("Cannot delete food that has associated logs");
  }
  await db.delete(foods).where(eq(foods.id, id));
}

async function getLogs(date?: string, from?: string, to?: string) {
  const conditions: SQL[] = [];
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

async function createLog(insertLog: InsertLog) {
  const [log] = await db.insert(logs).values(insertLog).returning();
  return log;
}

async function updateLog(id: number, updateLog: UpdateLog) {
  const [log] = await db.update(logs).set(updateLog).where(eq(logs.id, id)).returning();
  return log;
}

async function deleteLog(id: number) {
  await db.delete(logs).where(eq(logs.id, id));
}

async function getDailyStats(from?: string, to?: string) {
  const conditions: SQL[] = [];
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

// Routes
app.get(api.foods.list.path, async (req, res) => {
  const search = req.query.search as string | undefined;
  const foodsList = await getFoods(search);
  res.json(foodsList);
});

app.post(api.foods.create.path, async (req, res) => {
  try {
    const input = api.foods.create.input.parse(req.body);
    const food = await createFood(input);
    res.status(201).json(food);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors[0].message });
      return;
    }
    throw err;
  }
});

app.get(api.foods.get.path, async (req, res) => {
  const food = await getFood(Number(req.params.id));
  if (!food) {
    res.status(404).json({ message: "Food not found" });
    return;
  }
  res.json(food);
});

app.patch(api.foods.update.path, async (req, res) => {
  try {
    const input = api.foods.update.input.parse(req.body);
    const food = await updateFood(Number(req.params.id), input);
    res.json(food);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors[0].message });
      return;
    }
    throw err;
  }
});

app.delete(api.foods.delete.path, async (req, res) => {
  try {
    await deleteFood(Number(req.params.id));
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get(api.logs.list.path, async (req, res) => {
  const date = req.query.date as string | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const logsList = await getLogs(date, from, to);
  res.json(logsList);
});

app.post(api.logs.create.path, async (req, res) => {
  try {
    const input = api.logs.create.input.parse(req.body);
    const log = await createLog(input);
    res.status(201).json(log);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors[0].message });
      return;
    }
    throw err;
  }
});

app.patch(api.logs.update.path, async (req, res) => {
  try {
    const input = api.logs.update.input.parse(req.body);
    const log = await updateLog(Number(req.params.id), input);
    res.json(log);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors[0].message });
      return;
    }
    throw err;
  }
});

app.delete(api.logs.delete.path, async (req, res) => {
  await deleteLog(Number(req.params.id));
  res.status(204).end();
});

app.get(api.stats.daily.path, async (req, res) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const stats = await getDailyStats(from, to);
  res.json(stats);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
