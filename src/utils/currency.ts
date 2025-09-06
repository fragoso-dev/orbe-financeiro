export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove todos os caracteres que não são dígitos, vírgula ou ponto
  const cleanValue = value.replace(/[^\d,-]/g, '');
  
  // Substitui vírgula por ponto para conversão
  const normalizedValue = cleanValue.replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
};

export const formatCurrencyInput = (value: string): string => {
  // Remove caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  // Converte para número e divide por 100 para ter centavos
  const amount = parseFloat(numericValue) / 100;
  
  return formatCurrency(amount).replace('R$', '').trim();
};

export const getBalanceColor = (amount: number): string => {
  if (amount > 0) return 'balance-positive';
  if (amount < 0) return 'balance-negative';
  return 'balance-neutral';
};