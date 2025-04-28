
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, Phone, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/store/store';
import { AuthForm, AuthFormData } from '@/components/AuthForm';
import { setUser, updateProfile } from '@/store/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAuth = async (data: AuthFormData) => {
    try {
      // In a real app, this would call Supabase auth
      // For now, we'll simulate auth with Redux
      dispatch(setUser({
        id: '1',
        email: data.email,
        full_name: data.full_name || 'Guest User',
      }));
      toast({
        title: "Success",
        description: authMode === 'login' ? "Successfully logged in" : "Account created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
    };

    try {
      dispatch(updateProfile(updates));
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    toast({
      title: "Success",
      description: "Successfully logged out",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-serif font-bold mb-6 text-center">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <AuthForm mode={authMode} onSubmit={handleAuth} />
            <p className="text-center mt-4">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-primary hover:underline"
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">My Profile</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <Input
                        name="full_name"
                        defaultValue={user?.full_name}
                        placeholder="Full Name"
                      />
                      <Input
                        name="phone"
                        defaultValue={user?.phone}
                        placeholder="Phone Number"
                      />
                      <div className="flex gap-2">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h2 className="text-xl font-medium">{user?.full_name}</h2>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </p>
                      {user?.phone && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {!isEditing && (
                  <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
              <p className="text-muted-foreground">No orders yet.</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsEditing(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/wishlist')}
                >
                  Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
