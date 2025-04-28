
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile content will be implemented later */}
          <p className="text-muted-foreground">Profile management coming soon.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
