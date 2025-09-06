import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, DollarSign, FileText, Tag } from "lucide-react";
import { FinancialButton } from "@/components/ui/financial-button";
import { FinancialInput } from "@/components/ui/financial-input";
import { FinancialCard, FinancialCardContent, FinancialCardHeader, FinancialCardTitle } from "@/components/ui/financial-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrencyInput, parseCurrency } from "@/utils/currency";
import { transactionService, categories } from "@/services/transactionService";
import { Transaction, TransactionType } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  transaction?: Transaction;
}

export function TransactionForm({ transaction }: TransactionFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense" as TransactionType,
    category: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      });
    }
  }, [transaction]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setFormData(prev => ({ ...prev, amount: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const amount = parseCurrency(formData.amount);
      const finalAmount = formData.type === "expense" ? -Math.abs(amount) : Math.abs(amount);
      
      const transactionData = {
        amount: finalAmount,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      if (transaction) {
        await transactionService.updateTransaction(transaction.id, transactionData);
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso!",
          variant: "default",
        });
      } else {
        await transactionService.createTransaction(transactionData);
        toast({
          title: "Sucesso",
          description: "Transação criada com sucesso!",
          variant: "default",
        });
      }
      
      navigate("/transactions");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incomeCategories = categories.filter(cat => 
    ["Salário", "Freelance", "Investimentos", "Outros Rendimentos"].includes(cat)
  );
  
  const expenseCategories = categories.filter(cat => 
    !["Salário", "Freelance", "Investimentos", "Outros Rendimentos"].includes(cat)
  );

  const availableCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="max-w-2xl mx-auto">
      <FinancialCard elevated>
        <FinancialCardHeader>
          <FinancialCardTitle>
            {transaction ? "Editar Transação" : "Nova Transação"}
          </FinancialCardTitle>
        </FinancialCardHeader>
        <FinancialCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Tipo de Transação *</Label>
              <div className="grid grid-cols-2 gap-4">
                <FinancialButton
                  type="button"
                  variant={formData.type === "income" ? "success" : "outline"}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: "income", category: "" }));
                  }}
                  className="h-12"
                >
                  + Receita
                </FinancialButton>
                <FinancialButton
                  type="button"
                  variant={formData.type === "expense" ? "destructive" : "outline"}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: "expense", category: "" }));
                  }}
                  className="h-12"
                >
                  - Despesa
                </FinancialButton>
              </div>
            </div>

            {/* Amount */}
            <FinancialInput
              label="Valor *"
              placeholder="0,00"
              value={formData.amount}
              onChange={handleAmountChange}
              icon={<DollarSign className="h-4 w-4" />}
            />

            {/* Category */}
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="h-10">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Selecione uma categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <FinancialInput
              label="Data *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              icon={<CalendarDays className="h-4 w-4" />}
            />

            {/* Description */}
            <div className="space-y-2">
              <Label>Observações</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="Adicione uma descrição (opcional)"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="pl-10 min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <FinancialButton
                type="button"
                variant="outline"
                onClick={() => navigate("/transactions")}
                className="flex-1"
              >
                Cancelar
              </FinancialButton>
              <FinancialButton
                type="submit"
                variant={formData.type === "income" ? "success" : "destructive"}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Salvando..." : transaction ? "Atualizar" : "Salvar"}
              </FinancialButton>
            </div>
          </form>
        </FinancialCardContent>
      </FinancialCard>
    </div>
  );
}