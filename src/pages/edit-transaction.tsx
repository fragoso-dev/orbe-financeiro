import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FinancialButton } from "@/components/ui/financial-button";
import { FinancialCard, FinancialCardContent } from "@/components/ui/financial-card";
import { TransactionForm } from "@/components/forms/transaction-form";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";

export default function EditTransaction() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadTransaction(id);
    }
  }, [id]);

  const loadTransaction = async (transactionId: string) => {
    try {
      setLoading(true);
      const transactions = await transactionService.getTransactions();
      const foundTransaction = transactions.find(t => t.id === transactionId);
      
      if (!foundTransaction) {
        toast({
          title: "Erro",
          description: "Transação não encontrada.",
          variant: "destructive",
        });
        return;
      }
      
      setTransaction(foundTransaction);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a transação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <FinancialCard>
            <FinancialCardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </FinancialCardContent>
          </FinancialCard>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/transactions">
            <FinancialButton variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </FinancialButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transação não encontrada</h1>
          </div>
        </div>
        <FinancialCard>
          <FinancialCardContent className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              A transação que você está tentando editar não foi encontrada.
            </p>
            <Link to="/transactions">
              <FinancialButton variant="default">
                Voltar para transações
              </FinancialButton>
            </Link>
          </FinancialCardContent>
        </FinancialCard>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Editar Transação</h1>
          <p className="text-muted-foreground">
            Modifique os dados da transação
          </p>
        </div>
      </div>

      {/* Form */}
      <TransactionForm transaction={transaction} />
    </div>
  );
}