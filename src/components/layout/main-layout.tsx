import { Outlet } from "react-router-dom";
import { Navigation } from "./navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { FinancialButton } from "@/components/ui/financial-button";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Navigation />
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <FinancialButton
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </FinancialButton>
            <h1 className="text-lg font-semibold text-foreground">FinanceApp</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}