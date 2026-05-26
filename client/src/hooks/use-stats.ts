import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDailyStats(from?: string, to?: string) {
  return useQuery({
    queryKey: [api.stats.daily.path, { from, to }],
    queryFn: async () => {
      let url = api.stats.daily.path;
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return api.stats.daily.responses[200].parse(await res.json());
    },
  });
}
