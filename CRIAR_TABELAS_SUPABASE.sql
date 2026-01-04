-- Script para criar as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase: https://supabase.com/dashboard/project/elqzcyyijsecatyxogjw/sql

-- 1. Criar tabela transactions
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default-user',
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'received', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Criar tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default-user',
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON transactions(due_date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS para permitir acesso público (anon key)
-- Para desenvolvimento/teste - em produção você deve usar autenticação
CREATE POLICY "Permitir todas as operações para anon" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir todas as operações para anon" ON categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

