import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Plus, ArrowLeft, Loader2, Edit2, Trash2 } from "lucide-react";
import { useFoods, useCreateFood, useUpdateFood, useDeleteFood } from "@/hooks/use-foods";
import { useCreateLog } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AddFood() {
  const [_, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [grams, setGrams] = useState<string>("100");
  const [isCreateFoodOpen, setIsCreateFoodOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<any | null>(null);
  
  const { data: foods, isLoading } = useFoods(search);
  const { mutate: createLog, isPending: isLogging } = useCreateLog();
  const { mutate: deleteFood } = useDeleteFood();
  const { toast } = useToast();

  const handleLog = () => {
    if (!selectedFood) return;
    
    createLog({
      foodId: selectedFood.id,
      grams: parseFloat(grams),
      date: format(new Date(), "yyyy-MM-dd"),
    }, {
      onSuccess: () => {
        toast({ title: "Logged successfully", description: `Added ${selectedFood.name} to today's log.` });
        setLocation("/");
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  const handleDeleteFood = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this food? This will fail if it has associated logs.")) {
      deleteFood(id, {
        onSuccess: () => toast({ title: "Food deleted" }),
        onError: (err) => toast({ title: "Delete failed", description: err.message, variant: "destructive" })
      });
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="max-w-4xl mx-auto border-x border-border/40 relative min-h-screen bg-background md:shadow-sm md:my-6 md:rounded-3xl md:overflow-hidden md:border">
        {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border/40 p-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setLocation("/")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold">Add Food</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search foods (e.g., Chicken Breast)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-transparent focus:bg-white transition-all rounded-xl"
            autoFocus
          />
        </div>
      </div>

      {/* Results List */}
      <div className="p-4 md:p-8 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-8 text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : foods?.length === 0 && search ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No foods found for "{search}"</p>
            <Button onClick={() => setIsCreateFoodOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Create New Food
            </Button>
          </div>
        ) : (
          <>
            {/* Create New Button always visible if search results exist but aren't what user wants */}
            <button
              onClick={() => setIsCreateFoodOpen(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-medium">Create custom food</span>
            </button>

            {foods?.map((food) => (
              <div 
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-border/40 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] relative"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors pr-12">{food.name}</h3>
                  <p className="text-xs text-muted-foreground">Per 100g</p>
                  
                  <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingFood(food); }}
                      className="text-[10px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <Edit2 size={10} /> EDIT
                    </button>
                    <button 
                      onClick={(e) => handleDeleteFood(e, food.id)}
                      className="text-[10px] font-bold text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 size={10} /> DELETE
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{Math.round(food.caloriesPer100g)} kcal</div>
                  <div className="text-xs text-secondary font-medium">{Math.round(food.proteinPer100g)}g protein</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Log Quantity Dialog */}
      <Dialog open={!!selectedFood} onOpenChange={(open) => !open && setSelectedFood(null)}>
        <DialogContent className="rounded-2xl max-w-[90%] sm:max-w-md top-[30%] translate-y-[-30%]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">{selectedFood?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="flex justify-center">
              <div className="relative w-full max-w-[200px]">
                <Input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  className="text-center text-4xl font-bold h-20 border-none bg-muted/30 focus-visible:ring-0 rounded-2xl"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">
                  g
                </span>
              </div>
            </div>

            {/* Quick Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-3 rounded-xl text-center border border-primary/10">
                <p className="text-xs font-semibold text-primary uppercase">Calories</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedFood ? Math.round((parseFloat(grams || "0") / 100) * selectedFood.caloriesPer100g) : 0}
                </p>
              </div>
              <div className="bg-secondary/5 p-3 rounded-xl text-center border border-secondary/10">
                <p className="text-xs font-semibold text-secondary uppercase">Protein</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedFood ? Math.round((parseFloat(grams || "0") / 100) * selectedFood.proteinPer100g) : 0}g
                </p>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30" 
              onClick={handleLog}
              disabled={isLogging || !grams}
            >
              {isLogging ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Add to Log"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

        <CreateFoodSheet 
          open={isCreateFoodOpen || !!editingFood} 
          onOpenChange={(open) => {
            setIsCreateFoodOpen(open);
            if (!open) setEditingFood(null);
          }} 
          editingFood={editingFood}
        />
      </div>
    </div>
  );
}

// Sub-component for creating/editing food
function CreateFoodSheet({ open, onOpenChange, editingFood }: { open: boolean, onOpenChange: (o: boolean) => void, editingFood?: any }) {
  const { mutate: createFood, isPending: isCreating } = useCreateFood();
  const { mutate: updateFood, isPending: isUpdating } = useUpdateFood();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ 
    name: editingFood?.name || "", 
    caloriesPer100g: editingFood?.caloriesPer100g?.toString() || "", 
    proteinPer100g: editingFood?.proteinPer100g?.toString() || "" 
  });

  // Update form when editingFood changes
  useState(() => {
    if (editingFood) {
      setFormData({
        name: editingFood.name,
        caloriesPer100g: editingFood.caloriesPer100g.toString(),
        proteinPer100g: editingFood.proteinPer100g.toString()
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      caloriesPer100g: parseFloat(formData.caloriesPer100g),
      proteinPer100g: parseFloat(formData.proteinPer100g),
    };

    if (editingFood) {
      updateFood({ id: editingFood.id, data }, {
        onSuccess: () => {
          toast({ title: "Food updated" });
          onOpenChange(false);
        },
        onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
      });
    } else {
      createFood(data, {
        onSuccess: () => {
          toast({ title: "Food created", description: "You can now log this food." });
          onOpenChange(false);
          setFormData({ name: "", caloriesPer100g: "", proteinPer100g: "" });
        },
        onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-[90%] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingFood ? "Edit Food" : "Create New Food"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Food Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Greek Yogurt" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cals">Calories / 100g</Label>
              <Input 
                id="cals" 
                type="number" 
                step="0.1"
                placeholder="0" 
                value={formData.caloriesPer100g}
                onChange={e => setFormData({...formData, caloriesPer100g: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein / 100g</Label>
              <Input 
                id="protein" 
                type="number" 
                step="0.1"
                placeholder="0" 
                value={formData.proteinPer100g}
                onChange={e => setFormData({...formData, proteinPer100g: e.target.value})}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : null} 
            {editingFood ? "Update Food" : "Create Food"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
