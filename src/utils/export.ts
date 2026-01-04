import * as XLSX from 'xlsx';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from './format';

export const exportToExcel = (transactions: Transaction[], categories: Category[]) => {
  // Criar planilha de transações
  const transactionsData = transactions.map(t => {
    const category = categories.find(c => c.id === t.category);
    return {
      'Tipo': t.type === 'expense' ? 'Despesa' : 'Receita',
      'Descrição': t.description,
      'Categoria': category?.name || 'Sem categoria',
      'Valor': t.amount,
      'Valor Formatado': formatCurrency(t.amount),
      'Data Vencimento': formatDate(t.dueDate),
      'Data Pagamento/Recebimento': t.paymentDate ? formatDate(t.paymentDate) : '-',
      'Status': t.status === 'paid' ? 'Pago' : t.status === 'received' ? 'Recebido' : t.status === 'overdue' ? 'Vencida' : 'Pendente',
      'Observações': t.notes || '-',
      'Data Criação': formatDate(t.createdAt),
    };
  });

  // Criar planilha de categorias
  const categoriesData = categories.map(c => ({
    'Nome': c.name,
    'Tipo': c.type === 'expense' ? 'Despesa' : 'Receita',
    'Cor': c.color,
    'Ícone': c.icon,
  }));

  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Adicionar planilha de transações
  const wsTransactions = XLSX.utils.json_to_sheet(transactionsData);
  XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transações');

  // Adicionar planilha de categorias
  const wsCategories = XLSX.utils.json_to_sheet(categoriesData);
  XLSX.utils.book_append_sheet(wb, wsCategories, 'Categorias');

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 12 }, // Tipo
    { wch: 30 }, // Descrição
    { wch: 20 }, // Categoria
    { wch: 12 }, // Valor
    { wch: 15 }, // Valor Formatado
    { wch: 18 }, // Data Vencimento
    { wch: 25 }, // Data Pagamento/Recebimento
    { wch: 12 }, // Status
    { wch: 30 }, // Observações
    { wch: 18 }, // Data Criação
  ];
  wsTransactions['!cols'] = colWidths;

  // Gerar arquivo
  const fileName = `plano-financeiro-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

