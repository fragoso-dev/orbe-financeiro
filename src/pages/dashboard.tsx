import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { FinancialCard, FinancialCardContent, FinancialCardDescription, FinancialCardHeader, FinancialCardTitle } from "@/components/ui/financial-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency, getBalanceColor } from "@/utils/currency";
import { transactionService } from "@/services/transactionService";
import { DashboardSummary } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--danger))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--secondary))'];

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getDashboardSummary();
      setSummary(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <FinancialCard key={i} className="animate-pulse">
              <FinancialCardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </FinancialCardContent>
            </FinancialCard>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Não foi possível carregar os dados.</p>
      </div>
    );
  }

  const pieData = summary.transactionsByCategory.map((item, index) => ({
    name: item.category,
    value: item.amount,
    fill: COLORS[index % COLORS.length],
  }));

  const barData = summary.transactionsByCategory.slice(0, 6).map((item, index) => ({
    category: item.category.length > 10 ? item.category.substring(0, 10) + '...' : item.category,
    amount: item.amount,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças pessoais</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Balance Card */}
        <FinancialCard elevated>
          <FinancialCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <FinancialCardTitle className="text-sm font-medium">Saldo Total</FinancialCardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </FinancialCardHeader>
          <FinancialCardContent>
            <div className={cn("text-2xl font-bold", getBalanceColor(summary.totalBalance))}>
              {formatCurrency(summary.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalBalance >= 0 ? "Situação positiva" : "Situação negativa"}
            </p>
          </FinancialCardContent>
        </FinancialCard>

        {/* Income Card */}
        <FinancialCard elevated>
          <FinancialCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <FinancialCardTitle className="text-sm font-medium">Receitas do Mês</FinancialCardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </FinancialCardHeader>
          <FinancialCardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(summary.monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Entradas no mês atual
            </p>
          </FinancialCardContent>
        </FinancialCard>

        {/* Expenses Card */}
        <FinancialCard elevated>
          <FinancialCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <FinancialCardTitle className="text-sm font-medium">Despesas do Mês</FinancialCardTitle>
            <TrendingDown className="h-4 w-4 text-danger" />
          </FinancialCardHeader>
          <FinancialCardContent>
            <div className="text-2xl font-bold text-danger">
              {formatCurrency(summary.monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saídas no mês atual
            </p>
          </FinancialCardContent>
        </FinancialCard>
      </div>

      {/* Charts */}
      {summary.transactionsByCategory.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <FinancialCard elevated>
            <FinancialCardHeader>
              <FinancialCardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Gastos por Categoria
              </FinancialCardTitle>
              <FinancialCardDescription>
                Distribuição das despesas do mês
              </FinancialCardDescription>
            </FinancialCardHeader>
            <FinancialCardContent>
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(Number(value)), "Valor"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </FinancialCardContent>
          </FinancialCard>

          {/* Bar Chart */}
          <FinancialCard elevated>
            <FinancialCardHeader>
              <FinancialCardTitle>Categorias - Top 6</FinancialCardTitle>
              <FinancialCardDescription>
                Maiores gastos por categoria
              </FinancialCardDescription>
            </FinancialCardHeader>
            <FinancialCardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(value) => `R$ ${value}`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(Number(value)), "Valor"]}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </FinancialCardContent>
          </FinancialCard>
        </div>
      ) : (
        <FinancialCard>
          <FinancialCardContent className="text-center py-10">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
            <p className="text-muted-foreground">
              Adicione algumas transações para visualizar os gráficos.
            </p>
          </FinancialCardContent>
        </FinancialCard>
      )}
    </div>
  );
}