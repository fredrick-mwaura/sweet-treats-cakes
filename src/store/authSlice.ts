
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../services/supabase';
import type { User, UserMetadata } from '@supabase/supabase-js';

// Define custom type for our user metadata to extend the default UserMetadata
interface CustomUserMetadata extends UserMetadata {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

interface UserState {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    phone?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Extract user metadata in a type-safe way
    const metadata = user.user_metadata as CustomUserMetadata;
    
    return {
      id: user.id,
      email: user.email!,
      full_name: metadata.full_name || '',
      avatar_url: metadata.avatar_url,
      phone: metadata.phone
    };
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('User not found');

      // Extract user metadata in a type-safe way
      const metadata = data.user.user_metadata as CustomUserMetadata;
      
      return {
        id: data.user.id,
        email: data.user.email!,
        full_name: metadata.full_name || '',
        avatar_url: metadata.avatar_url,
        phone: metadata.phone
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, full_name }: { email: string; password: string; full_name: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name
          }
        }
      });
      
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('User registration failed');
      
      // Extract user metadata in a type-safe way
      const metadata = data.user.user_metadata as CustomUserMetadata;
      
      return {
        id: data.user.id,
        email: data.user.email!,
        full_name: metadata.full_name || '',
        avatar_url: metadata.avatar_url,
        phone: metadata.phone
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ full_name, phone }: { full_name?: string; phone?: string }, { getState, rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name, phone }
      });
      
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('User not found');
      
      // Extract user metadata in a type-safe way
      const metadata = data.user.user_metadata as CustomUserMetadata;
      
      return {
        id: data.user.id,
        email: data.user.email!,
        full_name: metadata.full_name || '',
        avatar_url: metadata.avatar_url,
        phone: metadata.phone
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // fetchCurrentUser
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user';
    });
    
    // signIn
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to sign in';
    });
    
    // signUp
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to sign up';
    });
    
    // signOut
    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(signOut.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to sign out';
    });
    
    // updateProfile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to update profile';
    });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
