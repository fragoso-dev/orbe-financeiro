import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Tag as TagIcon
} from "lucide-react";
import { FinancialButton } from "@/components/ui/financial-button";
import { FinancialInput } from "@/components/ui/financial-input";
import { FinancialCard, FinancialCardContent, FinancialCardHeader, FinancialCardTitle } from "@/components/ui/financial-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { transactionService, categories } from "@/services/transactionService";
import { Transaction, TransactionFilters } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; transaction: Transaction | null }>({
    open: false,
    transaction: null,
  });
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters, searchTerm]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate!);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    setFilteredTransactions(filtered);
  };

  const handleDeleteTransaction = async () => {
    if (!deleteDialog.transaction) return;

    try {
      await transactionService.deleteTransaction(deleteDialog.transaction.id);
      await loadTransactions();
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, transaction: null });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters = Boolean(
    filters.startDate || 
    filters.endDate || 
    filters.category || 
    filters.type || 
    searchTerm
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Link to="/transactions/new">
          <FinancialButton variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </FinancialButton>
        </Link>
      </div>

      {/* Filters */}
      <FinancialCard>
        <FinancialCardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <FinancialInput
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />

            {/* Date From */}
            <FinancialInput
              type="date"
              placeholder="Data inicial"
              value={filters.startDate || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              icon={<Calendar className="h-4 w-4" />}
            />

            {/* Date To */}
            <FinancialInput
              type="date"
              placeholder="Data final"
              value={filters.endDate || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              icon={<Calendar className="h-4 w-4" />}
            />

            {/* Category Filter */}
            <Select
              value={filters.category || ""}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                category: value === "all" ? undefined : value 
              }))}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Categoria" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <FinancialButton
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, type: "income" }))}
              className={cn("gap-1", filters.type === "income" && "bg-success/10 text-success border-success")}
            >
              <TrendingUp className="h-3 w-3" />
              Receitas
            </FinancialButton>
            <FinancialButton
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, type: "expense" }))}
              className={cn("gap-1", filters.type === "expense" && "bg-danger/10 text-danger border-danger")}
            >
              <TrendingDown className="h-3 w-3" />
              Despesas
            </FinancialButton>
            {hasActiveFilters && (
              <FinancialButton
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Limpar filtros
              </FinancialButton>
            )}
          </div>
        </FinancialCardContent>
      </FinancialCard>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <FinancialCard>
            <FinancialCardContent className="text-center py-10">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Filter className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {transactions.length === 0 ? "Nenhuma transação" : "Nenhum resultado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {transactions.length === 0 
                  ? "Você ainda não tem transações cadastradas."
                  : "Tente ajustar os filtros para encontrar o que procura."
                }
              </p>
              {transactions.length === 0 && (
                <Link to="/transactions/new">
                  <FinancialButton variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira transação
                  </FinancialButton>
                </Link>
              )}
            </FinancialCardContent>
          </FinancialCard>
        ) : (
          filteredTransactions.map((transaction) => (
            <FinancialCard key={transaction.id} className="hover:shadow-lg transition-smooth">
              <FinancialCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Type indicator */}
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                      transaction.type === "income" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}>
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                    </div>

                    {/* Transaction info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {transaction.description || transaction.category}
                        </h3>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            transaction.type === "income" 
                              ? "transaction-income" 
                              : "transaction-expense"
                          )}
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(transaction.date), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Amount and actions */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className={cn(
                      "text-lg font-bold",
                      transaction.type === "income" ? "text-success" : "text-danger"
                    )}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <div className="flex gap-1">
                      <Link to={`/transactions/${transaction.id}/edit`}>
                        <FinancialButton variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </FinancialButton>
                      </Link>
                      <FinancialButton
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog({ open: true, transaction })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </FinancialButton>
                    </div>
                  </div>
                </div>
              </FinancialCardContent>
            </FinancialCard>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, transaction: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir transação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <FinancialButton
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, transaction: null })}
            >
              Cancelar
            </FinancialButton>
            <FinancialButton
              variant="destructive"
              onClick={handleDeleteTransaction}
            >
              Excluir
            </FinancialButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}