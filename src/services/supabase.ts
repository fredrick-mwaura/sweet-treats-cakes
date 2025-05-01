
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  full_name?: string;
};

export const signUp = async ({ email, password, full_name }: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signIn = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
};

export const updateProfile = async (updates: { full_name?: string; phone?: string }) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};
