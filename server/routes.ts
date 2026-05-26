import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Foods
  app.get(api.foods.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const foods = await storage.getFoods(search);
    res.json(foods);
  });

  app.post(api.foods.create.path, async (req, res) => {
    try {
      const input = api.foods.create.input.parse(req.body);
      const food = await storage.createFood(input);
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
    const food = await storage.getFood(Number(req.params.id));
    if (!food) {
      res.status(404).json({ message: "Food not found" });
      return;
    }
    res.json(food);
  });

  app.patch(api.foods.update.path, async (req, res) => {
    try {
      const input = api.foods.update.input.parse(req.body);
      const food = await storage.updateFood(Number(req.params.id), input);
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
      await storage.deleteFood(Number(req.params.id));
      res.status(204).end();
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // Logs
  app.get(api.logs.list.path, async (req, res) => {
    const date = req.query.date as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const logs = await storage.getLogs(date, from, to);
    res.json(logs);
  });

  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const log = await storage.createLog(input);
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
      const log = await storage.updateLog(Number(req.params.id), input);
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
    await storage.deleteLog(Number(req.params.id));
    res.status(204).end();
  });

  // Stats
  app.get(api.stats.daily.path, async (req, res) => {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const stats = await storage.getDailyStats(from, to);
    res.json(stats);
  });

  // Seeding
  const foodsList = await storage.getFoods();
  if (foodsList.length === 0) {
    console.log("Seeding data...");
    const chicken = await storage.createFood({ name: "Chicken Breast", caloriesPer100g: 165, proteinPer100g: 31 });
    const rice = await storage.createFood({ name: "White Rice (Cooked)", caloriesPer100g: 130, proteinPer100g: 2.7 });
    const apple = await storage.createFood({ name: "Apple", caloriesPer100g: 52, proteinPer100g: 0.3 });
    const egg = await storage.createFood({ name: "Egg (Large)", caloriesPer100g: 155, proteinPer100g: 13 });
    const oats = await storage.createFood({ name: "Oats (Rolled)", caloriesPer100g: 389, proteinPer100g: 16.9 });
    const banana = await storage.createFood({ name: "Banana", caloriesPer100g: 89, proteinPer100g: 1.1 });

    // Logs for today
    const today = new Date().toISOString().split('T')[0];
    await storage.createLog({ foodId: chicken.id, grams: 200, date: today });
    await storage.createLog({ foodId: rice.id, grams: 150, date: today });
    await storage.createLog({ foodId: banana.id, grams: 120, date: today });

    // Logs for yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await storage.createLog({ foodId: egg.id, grams: 100, date: yesterday });
    await storage.createLog({ foodId: apple.id, grams: 150, date: yesterday });
    await storage.createLog({ foodId: oats.id, grams: 50, date: yesterday });
    
    console.log("Data seeded!");
  }

  return httpServer;
}
