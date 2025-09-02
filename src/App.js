import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignInPage from '../src/components/SignIn';
import SignUpPage from '../src/components/SignUp';
import DetailsPage from '../src/components/DetailsForm';
import ProfilePage from '../src/components/ProfileView';
import ProtectedRoute from '../src/components/ProtectedRoute';
import PublicRoute from '../src/components/PublicRoute';
import Navbar from '../src/pages/Navbar';

// Wrapper component for ProfilePage to handle navigation
const ProfilePageWrapper = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate('/edit-profile');
  };

  return <ProfilePage user={user} onLogout={onLogout} onEdit={handleEdit} />;
};

// Wrapper component for DetailsPage when used for editing
const EditProfileWrapper = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  const handleDetailsComplete = () => {
    navigate('/profile');
  };

  return (
    <DetailsPage 
      user={user} 
      onLogout={onLogout} 
      onDetailsComplete={handleDetailsComplete}
    />
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleSignInSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar - Always visible */}
        <Navbar user={user} onLogout={handleLogout} />
        
        {/* Main content area */}
        <div className="py-8 px-4">
          <Routes>
            {/* Default route */}
            <Route 
              path="/" 
              element={<Navigate to={user ? "/profile" : "/signin"} replace />} 
            />
            
            {/* Public routes */}
            <Route 
              path="/signin" 
              element={
                <PublicRoute user={user}>
                  <SignInPage onSuccess={handleSignInSuccess} />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                <PublicRoute user={user}>
                  <SignUpPage />
                </PublicRoute>
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user}>
                  <ProfilePageWrapper user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/details" 
              element={
                <ProtectedRoute user={user}>
                  <DetailsPage user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />

            {/* Edit profile route */}
            <Route 
              path="/edit-profile" 
              element={
                <ProtectedRoute user={user}>
                  <EditProfileWrapper user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;