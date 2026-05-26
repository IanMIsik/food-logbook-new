import { useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Flame, Beef, Trash2, Edit2, Check, X } from "lucide-react";
import { useLogs, useDeleteLog, useUpdateLog } from "@/hooks/use-logs";
import { LayoutShell } from "@/components/layout-shell";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [date, setDate] = useState(new Date());
  const dateStr = format(date, "yyyy-MM-dd");
  
  const { data: logs, isLoading } = useLogs(dateStr);
  const { mutate: deleteLog } = useDeleteLog();
  const { mutate: updateLog } = useUpdateLog();
  const { toast } = useToast();

  const totalCalories = logs?.reduce((sum, log) => sum + (log.grams / 100) * log.food.caloriesPer100g, 0) || 0;
  const totalProtein = logs?.reduce((sum, log) => sum + (log.grams / 100) * log.food.proteinPer100g, 0) || 0;

  const handleDelete = (id: number) => {
    deleteLog(id, {
      onSuccess: () => {
        toast({
          title: "Entry deleted",
          description: "Food log has been removed successfully.",
        });
      }
    });
  };

  const handleUpdate = (id: number, grams: number) => {
    updateLog({ id, data: { grams } }, {
      onSuccess: () => {
        toast({
          title: "Entry updated",
          description: "Grams updated successfully.",
        });
      }
    });
  };

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 flex flex-col">
        {/* Header / Date Picker */}
        <header className="pt-8 pb-4 px-6 bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-border/40 rounded-b-2xl md:mt-6 md:rounded-2xl md:shadow-sm md:border">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-display text-foreground">Daily Log</h1>
          <button 
            onClick={() => setDate(new Date())}
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            TODAY
          </button>
        </div>
        
        <div className="flex items-center justify-between bg-secondary/5 rounded-xl p-1">
          <button 
            onClick={() => setDate(d => subDays(d, 1))}
            className="p-2 hover:bg-white rounded-lg text-muted-foreground hover:text-foreground hover:shadow-sm transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-foreground">
              {format(date, "EEEE, MMMM d")}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
              {isSameDay(date, new Date()) ? "Current Day" : format(date, "yyyy")}
            </span>
          </div>

          <button 
            onClick={() => setDate(d => addDays(d, 1))}
            className="p-2 hover:bg-white rounded-lg text-muted-foreground hover:text-foreground hover:shadow-sm transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="py-6 space-y-6 md:bg-white/30 md:backdrop-blur-sm md:rounded-2xl md:mt-6 md:mb-12 md:shadow-sm md:border md:border-border/40 md:p-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Calories" 
            value={totalCalories} 
            unit="kcal" 
            icon={Flame} 
            variant="primary" 
            isLoading={isLoading}
          />
          <StatCard 
            label="Protein" 
            value={totalProtein} 
            unit="g" 
            icon={Beef} 
            variant="secondary" 
            isLoading={isLoading}
          />
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display text-foreground">Meals</h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {logs?.length || 0} Entries
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-white">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))
            ) : logs && logs.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <LogItem key={log.id} log={log} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                <div className="bg-muted rounded-full p-4 mb-3">
                  <Flame className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">No meals logged yet</p>
                <p className="text-sm text-muted-foreground mt-1">Tap the + button to add your first meal</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </LayoutShell>
  );
}

function LogItem({ log, onDelete, onUpdate }: { log: any; onDelete: (id: number) => void; onUpdate: (id: number, grams: number) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editGrams, setEditGrams] = useState(log.grams.toString());

  const calories = Math.round((log.grams / 100) * log.food.caloriesPer100g);
  const protein = Math.round((log.grams / 100) * log.food.proteinPer100g);

  const handleSave = () => {
    onUpdate(log.id, parseFloat(editGrams));
    setIsEditing(false);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex items-center justify-between p-4 bg-white rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all duration-200"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-border flex items-center justify-center text-lg">
          {log.food.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">{log.food.name}</h3>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={editGrams}
                onChange={(e) => setEditGrams(e.target.value)}
                className="h-7 w-20 text-xs"
                autoFocus
              />
              <span className="text-[10px] text-muted-foreground font-bold">G</span>
              <button onClick={handleSave} className="text-green-500 hover:text-green-600"><Check size={14} /></button>
              <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-600"><X size={14} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{log.grams}g serving</p>
              <button 
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-right ml-2">
        <p className="font-bold text-primary font-display text-sm">{calories} kcal</p>
        <p className="text-xs font-medium text-secondary">{protein}g protein</p>
      </div>

      <button 
        onClick={() => onDelete(log.id)}
        className="absolute -right-2 -top-2 bg-destructive text-white p-1.5 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md"
      >
        <Trash2 size={12} />
      </button>
    </motion.div>
  );
}
