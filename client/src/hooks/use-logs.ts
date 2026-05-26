import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertLog } from "@shared/routes";

export function useLogs(date?: string, from?: string, to?: string) {
  return useQuery({
    queryKey: [api.logs.list.path, { date, from, to }],
    queryFn: async () => {
      let url = api.logs.list.path;
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch logs');
      return api.logs.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLog) => {
      const validated = api.logs.create.input.parse(data);
      const res = await fetch(api.logs.create.path, {
        method: api.logs.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.logs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create log');
      }
      return api.logs.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific date query and stats
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.daily.path] });
    },
  });
}

export function useUpdateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertLog> }) => {
      const url = buildUrl(api.logs.update.path, { id });
      const res = await fetch(url, {
        method: api.logs.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.logs.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to update log');
      }
      return api.logs.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.daily.path] });
    },
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.logs.delete.path, { id });
      const res = await fetch(url, { 
        method: api.logs.delete.method, 
        credentials: "include" 
      });
      
      if (res.status === 404) throw new Error('Log not found');
      if (!res.ok) throw new Error('Failed to delete log');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.daily.path] });
    },
  });
}
