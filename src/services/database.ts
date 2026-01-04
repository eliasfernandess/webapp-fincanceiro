import { Transaction, Category } from '../types';
import { supabase, isSupabaseEnabled } from '../config/supabase';
import { getTransactions as getLocalTransactions, saveTransactions as saveLocalTransactions } from '../utils/storage';
import { getCategories as getLocalCategories, saveCategories as saveLocalCategories } from '../utils/storage';

// ID do usuário - pode ser melhorado com autenticação no futuro
const USER_ID = 'default-user';

// Usar Supabase se disponível, caso contrário usar localStorage
export const useDatabase = () => {
  if (isSupabaseEnabled && supabase) {
    return {
      getTransactions: async (): Promise<Transaction[]> => {
        try {
          const { data, error } = await supabase!
            .from('transactions')
            .select('*')
            .eq('user_id', USER_ID)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('❌ Erro ao buscar transações do Supabase:', error);
            console.error('📋 Detalhes:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            return getLocalTransactions(); // Fallback para localStorage
          }
          
          console.log('✅ Transações carregadas do Supabase:', data?.length || 0);
          
          // Mapear dados do banco (snake_case) para formato da aplicação (camelCase)
          return (data || []).map((item: any) => ({
            id: item.id,
            description: item.description,
            amount: parseFloat(item.amount),
            dueDate: item.due_date,
            paymentDate: item.payment_date || undefined,
            category: item.category,
            type: item.type,
            status: item.status,
            notes: item.notes || undefined,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
        } catch (err) {
          console.error('❌ Exceção ao buscar transações:', err);
          return getLocalTransactions();
        }
      },
      
      saveTransaction: async (transaction: Transaction): Promise<void> => {
        try {
          const { error } = await supabase!
            .from('transactions')
            .upsert({
              id: transaction.id,
              user_id: USER_ID,
              description: transaction.description,
              amount: transaction.amount,
              due_date: transaction.dueDate,
              payment_date: transaction.paymentDate || null,
              category: transaction.category,
              type: transaction.type,
              status: transaction.status,
              notes: transaction.notes || null,
              created_at: transaction.createdAt,
              updated_at: transaction.updatedAt,
            });
          
          if (error) {
            console.error('❌ Erro ao salvar transação no Supabase:', error);
            console.error('📋 Detalhes:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            // Salvar localmente também como backup
            const local = getLocalTransactions();
            saveLocalTransactions([...local.filter(t => t.id !== transaction.id), transaction]);
          } else {
            console.log('✅ Transação salva no Supabase:', transaction.description);
          }
        } catch (err) {
          console.error('❌ Exceção ao salvar transação:', err);
        }
      },
      
      deleteTransaction: async (id: string): Promise<void> => {
        const { error } = await supabase!
          .from('transactions')
          .delete()
          .eq('id', id)
          .eq('user_id', USER_ID);
        
        if (error) {
          console.error('Erro ao deletar transação:', error);
        }
      },
      
      getCategories: async (): Promise<Category[]> => {
        const { data, error } = await supabase!
          .from('categories')
          .select('*')
          .eq('user_id', USER_ID);
        
        if (error) {
          console.error('Erro ao buscar categorias:', error);
          return getLocalCategories();
        }
        
        // Mapear dados do banco para formato da aplicação
        return (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          color: item.color,
          icon: item.icon,
          type: item.type,
        }));
      },
      
      saveCategory: async (category: Category): Promise<void> => {
        const { error } = await supabase!
          .from('categories')
          .upsert({
            id: category.id,
            user_id: USER_ID,
            name: category.name,
            color: category.color,
            icon: category.icon,
            type: category.type,
          });
        
        if (error) {
          console.error('Erro ao salvar categoria:', error);
          const local = getLocalCategories();
          saveLocalCategories([...local.filter(c => c.id !== category.id), category]);
        }
      },
      
      deleteCategory: async (id: string): Promise<void> => {
        const { error } = await supabase!
          .from('categories')
          .delete()
          .eq('id', id)
          .eq('user_id', USER_ID);
        
        if (error) {
          console.error('Erro ao deletar categoria:', error);
        }
      },
    };
  }
  
  // Fallback para localStorage
  return {
    getTransactions: async () => getLocalTransactions(),
    saveTransaction: async (transaction: Transaction) => {
      const local = getLocalTransactions();
      saveLocalTransactions([...local.filter(t => t.id !== transaction.id), transaction]);
    },
    deleteTransaction: async () => {},
    getCategories: async () => getLocalCategories(),
    saveCategory: async (category: Category) => {
      const local = getLocalCategories();
      saveLocalCategories([...local.filter(c => c.id !== category.id), category]);
    },
    deleteCategory: async () => {},
  };
};

