import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FinancialButton } from "@/components/ui/financial-button";
import { TransactionForm } from "@/components/forms/transaction-form";

export default function NewTransaction() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/transactions">
          <FinancialButton variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </FinancialButton>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nova Transação</h1>
          <p className="text-muted-foreground">
            Adicione uma nova receita ou despesa
          </p>
        </div>
      </div>

      {/* Form */}
      <TransactionForm />
    </div>
  );
}