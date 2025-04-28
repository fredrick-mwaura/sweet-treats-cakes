
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Cart content will be implemented later */}
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
