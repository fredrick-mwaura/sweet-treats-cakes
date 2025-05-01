
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, Phone, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RootState, AppDispatch } from '@/store/store';
import { AuthForm, AuthFormData } from '@/components/AuthForm';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  updateUserProfile,
  fetchCurrentUser,
  clearError
} from '@/store/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  // Check for existing session on page load
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Clear any authentication errors when switching modes
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [authMode, dispatch]);

  const handleLogin = async (data: AuthFormData) => {
    try {
      await dispatch(loginUser({
        email: data.email,
        password: data.password
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
    } catch (error: any) {
      // Error is handled by the thunk
    }
  };

  const handleRegister = async (data: AuthFormData) => {
    try {
      await dispatch(registerUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      // Error is handled by the thunk
    }
  };

  const handleAuth = (data: AuthFormData) => {
    if (authMode === 'login') {
      return handleLogin(data);
    } else {
      return handleRegister(data);
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
      await dispatch(updateUserProfile(updates)).unwrap();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
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
            <AuthForm 
              mode={authMode} 
              onSubmit={handleAuth} 
              loading={loading}
              error={error}
            />
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
              {loading ? (
                <div className="flex items-center justify-center p-6">
                  <p>Loading profile...</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <Input
                          name="full_name"
                          defaultValue={user?.full_name || ''}
                          placeholder="Full Name"
                        />
                        <Input
                          name="phone"
                          defaultValue={user?.phone || ''}
                          placeholder="Phone Number"
                        />
                        <div className="flex gap-2">
                          <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h2 className="text-xl font-medium">{user?.full_name || 'No name provided'}</h2>
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
              )}
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
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {loading ? 'Signing out...' : 'Sign Out'}
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
