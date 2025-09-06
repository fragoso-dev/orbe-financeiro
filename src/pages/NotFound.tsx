import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { FinancialButton } from "@/components/ui/financial-button";
import { FinancialCard, FinancialCardContent } from "@/components/ui/financial-card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <FinancialCard elevated>
          <FinancialCardContent className="text-center p-8">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
            <p className="text-xl text-muted-foreground mb-6">Oops! Página não encontrada</p>
            <p className="text-sm text-muted-foreground mb-6">
              A página que você está procurando não existe ou foi removida.
            </p>
            <Link to="/">
              <FinancialButton className="gap-2">
                <Home className="h-4 w-4" />
                Voltar ao início
              </FinancialButton>
            </Link>
          </FinancialCardContent>
        </FinancialCard>
      </div>
    </div>
  );
};

export default NotFound;
