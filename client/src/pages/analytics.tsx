import { useState } from "react";
import { format, subDays, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { LayoutShell } from "@/components/layout-shell";
import { useDailyStats } from "@/hooks/use-stats";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Analytics() {
  const [range, setRange] = useState<"week" | "month">("week");
  
  // Calculate date ranges
  const today = new Date();
  const startDate = range === "week" 
    ? subDays(today, 6) 
    : subDays(today, 29);
    
  const fromStr = format(startDate, "yyyy-MM-dd");
  const toStr = format(today, "yyyy-MM-dd");

  const { data: stats, isLoading } = useDailyStats(fromStr, toStr);

  const formattedData = stats?.map(stat => ({
    ...stat,
    day: format(new Date(stat.date), range === "week" ? "EEE" : "dd"),
  })) || [];

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 flex flex-col">
        <header className="pt-8 pb-4 px-6 md:mt-6 bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-border/40 md:rounded-2xl md:shadow-sm md:border">
          <h1 className="text-2xl font-display text-foreground">Analytics</h1>
        </header>

        <div className="p-6 space-y-8 flex-1 md:bg-white/30 md:backdrop-blur-sm md:rounded-2xl md:border md:border-border/40 md:p-8 md:shadow-sm md:mt-6 md:mb-8">
          <Tabs defaultValue="week" onValueChange={(v) => setRange(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="week">Last 7 Days</TabsTrigger>
              <TabsTrigger value="month">Last 30 Days</TabsTrigger>
            </TabsList>
            
            <TabsContent value="week" className="space-y-6">
              <StatsCharts data={formattedData} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="month" className="space-y-6">
              <StatsCharts data={formattedData} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LayoutShell>
  );
}

function StatsCharts({ data, isLoading }: { data: any[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border/50 shadow-lg rounded-xl text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-primary font-medium">
            {payload[0].value} kcal
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipProtein = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border/50 shadow-lg rounded-xl text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-secondary font-medium">
            {Number(payload[0].value).toFixed(2)}g Protein
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Calorie Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                  dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f4f4f5'}} />
                <Bar 
                  dataKey="totalCalories" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  barSize={data.length > 7 ? 6 : 20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Protein Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                  dy={10}
                />
                <Tooltip content={<CustomTooltipProtein />} cursor={{fill: '#f4f4f5'}} />
                <Bar 
                  dataKey="totalProtein" 
                  fill="hsl(var(--secondary))" 
                  radius={[4, 4, 0, 0]}
                  barSize={data.length > 7 ? 6 : 20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
