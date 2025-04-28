import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-cake-600 text-2xl">
            <CakeIcon />
          </span>
          <span className="font-serif font-bold text-2xl">Sweet Treats</span>
        </Link>

        <button 
          className="md:hidden text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/customize" className="font-medium hover:text-primary transition-colors">
            Customize
          </Link>
          <Link to="/gallery" className="font-medium hover:text-primary transition-colors">
            Cake Gallery
          </Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">
            About Us
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/wishlist">
                <Heart size={20} />
                <span className="ml-1">{wishlistItems.length}</span>
              </Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/cart">
                <ShoppingBag size={20} />
                <span className="ml-1">0</span>
              </Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/profile">
                <User size={20} />
              </Link>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b p-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/customize" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Customize
              </Link>
              <Link 
                to="/gallery" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cake Gallery
              </Link>
              <Link 
                to="/about" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/wishlist" 
                className="flex items-center font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={20} />
                <span className="ml-2">Wishlist ({wishlistItems.length})</span>
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag size={20} />
                <span className="ml-2">Cart (0)</span>
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                <span className="ml-2">Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const CakeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v2" />
    <path d="M12 8v2" />
    <path d="M17 8v2" />
    <path d="M7 4h.01" />
    <path d="M12 4h.01" />
    <path d="M17 4h.01" />
  </svg>
);

export default Navbar;
