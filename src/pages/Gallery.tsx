
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CakeCard from '@/components/CakeCard';
import { Input } from '@/components/ui/input';
import { cakes } from '@/data/cakes';
import { Search } from 'lucide-react';

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(categoryFromUrl || 'all');
  
  // Update active filter when URL parameter changes
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveFilter(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  
  const filters = [
    { id: 'all', label: 'All Cakes' },
    { id: 'chocolate', label: 'Chocolate' },
    { id: 'fruit', label: 'Fruit' },
    { id: 'vanilla', label: 'Vanilla' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'cupcakes', label: 'Cupcakes' },
    { id: 'metropolitan', label: 'Metropolitan' },
    { id: 'themed', label: 'Themed' },
    { id: 'gift', label: 'Gift' },
    { id: 'celebration', label: 'Celebration' }
  ];
  
  const filteredCakes = useMemo(() => {
    return cakes.filter(cake => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = activeFilter === 'all' || 
        cake.category.includes(activeFilter);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-cake-50 py-12">
          <div className="container text-center">
            <h1 className="section-title mb-4">Cake Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our selection of delicious cakes or use them as a starting point for your custom creation.
            </p>
          </div>
        </div>
        
        <div className="container py-12">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            {/* Search bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search cakes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`cake-tag transition-all ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          {filteredCakes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCakes.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="font-serif text-xl font-medium mb-2">No cakes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
