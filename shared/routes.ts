import { z } from 'zod';
import { insertFoodSchema, insertLogSchema, foods, logs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  foods: {
    list: {
      method: 'GET' as const,
      path: '/api/foods',
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof foods.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/foods',
      input: insertFoodSchema,
      responses: {
        201: z.custom<typeof foods.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/foods/:id',
      input: insertFoodSchema.partial(),
      responses: {
        200: z.custom<typeof foods.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/foods/:id',
      responses: {
        204: z.void(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/foods/:id',
      responses: {
        200: z.custom<typeof foods.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      input: z.object({
        date: z.string().optional(), // YYYY-MM-DD
        from: z.string().optional(),
        to: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect & { food: typeof foods.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/logs',
      input: insertLogSchema,
      responses: {
        201: z.custom<typeof logs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/logs/:id',
      input: insertLogSchema.partial(),
      responses: {
        200: z.custom<typeof logs.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/logs/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    daily: {
      method: 'GET' as const,
      path: '/api/stats/daily',
      input: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.object({
          date: z.string(),
          totalCalories: z.number(),
          totalProtein: z.number(),
        })),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
