
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { supabase } from './services/supabase';
import { fetchCurrentUser } from './store/authSlice';
import Index from "./pages/Index";
import Customize from "./pages/Customize";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        // Fetch the updated user when auth state changes
        store.dispatch(fetchCurrentUser());
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
