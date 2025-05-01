
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log warning instead of throwing error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Authentication features will not work properly.');
  console.info('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Create Supabase client with options for better reliability
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  full_name?: string;
};

// Mock function for authentication when Supabase is not properly configured
const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const signUp = async ({ email, password, full_name }: SignUpCredentials) => {
  if (isMockMode) {
    console.warn('Running in mock mode. Set Supabase environment variables for real authentication.');
    return { user: { id: 'mock-id', email, user_metadata: { full_name } } };
  }

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
  if (isMockMode) {
    console.warn('Running in mock mode. Set Supabase environment variables for real authentication.');
    return { user: { id: 'mock-id', email, user_metadata: { full_name: 'Mock User' } } };
  }

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
  if (isMockMode) {
    console.warn('Running in mock mode. Set Supabase environment variables for real authentication.');
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getSession = async () => {
  if (isMockMode) {
    console.warn('Running in mock mode. Set Supabase environment variables for real authentication.');
    return { session: null };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data;
};

export const getCurrentUser = async () => {
  if (isMockMode) {
    console.warn('Running in mock mode. Set Supabase environment variables for real authentication.');
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
};

export const updateProfile = async (updates: { full_name?: string; phone?: string }) => {
  if (isMockMode) {
    console.warn('Running in mock mode. Set Supabase environment variables for real authentication.');
    return { user: { id: 'mock-id', email: 'mock@example.com', user_metadata: { ...updates } } };
  }
  
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};
