import { Link, useLocation } from "wouter";
import { Home, BarChart2, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col w-full overflow-hidden relative">
      {/* Content Area - Flex 1 to push footer down */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full md:max-w-xl mx-auto bg-white/90 backdrop-blur-xl border-t border-border/50 px-6 py-4 z-50 md:sticky md:bottom-6 md:border md:rounded-3xl md:mb-8 md:shadow-xl md:border-primary/20">
        <div className="flex justify-around items-center">
          <NavItem 
            href="/" 
            icon={<Home size={24} />} 
            label="Log" 
            isActive={location === "/"} 
          />
          
          {/* Main Action - Needs to pop out */}
          <Link href="/add-food">
            <div className="relative -top-6 cursor-pointer group">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-primary to-orange-400 text-white p-4 rounded-full shadow-lg shadow-primary/40 transform transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                <PlusCircle size={32} strokeWidth={2.5} />
              </div>
            </div>
          </Link>

          <NavItem 
            href="/analytics" 
            icon={<BarChart2 size={24} />} 
            label="Stats" 
            isActive={location === "/analytics"} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Link href={href} className={cn(
      "flex flex-col items-center gap-1 transition-colors duration-200 select-none",
      isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
    )}>
      {icon}
      <span className="text-[10px] tracking-wide uppercase">{label}</span>
    </Link>
  );
}
