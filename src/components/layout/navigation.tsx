import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, PlusCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transações",
    href: "/transactions",
    icon: Receipt,
  },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center gap-2 px-4 py-6 border-b border-border">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-foreground">FinanceApp</h1>
      </div>
      
      <div className="flex-1 px-4 py-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <FinancialButton
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </FinancialButton>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <Link to="/transactions/new">
            <FinancialButton variant="success" className="w-full gap-2">
              <PlusCircle className="h-4 w-4" />
              Nova Transação
            </FinancialButton>
          </Link>
        </div>
      </div>
    </nav>
  );
}