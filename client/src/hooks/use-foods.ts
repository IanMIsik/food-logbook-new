import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertFood } from "@shared/routes";

export function useFoods(search?: string) {
  return useQuery({
    queryKey: [api.foods.list.path, search],
    queryFn: async () => {
      const url = search 
        ? buildUrl(api.foods.list.path) + `?search=${encodeURIComponent(search)}`
        : api.foods.list.path;
        
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch foods');
      return api.foods.list.responses[200].parse(await res.json());
    },
    // Keep results fresh for a bit but allow background refetch
    staleTime: 1000 * 60 * 5, 
  });
}

export function useFood(id: number) {
  return useQuery({
    queryKey: [api.foods.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.foods.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch food');
      return api.foods.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFood) => {
      const validated = api.foods.create.input.parse(data);
      const res = await fetch(api.foods.create.path, {
        method: api.foods.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.foods.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create food');
      }
      return api.foods.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.foods.list.path] }),
  });
}

export function useUpdateFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertFood> }) => {
      const url = buildUrl(api.foods.update.path, { id });
      const res = await fetch(url, {
        method: api.foods.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.foods.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to update food');
      }
      return api.foods.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.foods.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    },
  });
}

export function useDeleteFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.foods.delete.path, { id });
      const res = await fetch(url, { 
        method: api.foods.delete.method, 
        credentials: "include" 
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error('Failed to delete food');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.foods.list.path] });
    },
  });
}
