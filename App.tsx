
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { BotWatch } from './pages/BotWatch';
import { User, UserRole, SubscriptionTier } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    // If admin, ensure they have enterprise features for the demo
    if (loggedInUser.role === UserRole.ADMIN) {
      setUser({
        ...loggedInUser,
        subscriptionTier: SubscriptionTier.ENTERPRISE
      });
    } else {
      setUser(loggedInUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (user) {
      setUser({ ...user, subscriptionTier: tier });
    }
  };

  const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout user={user} onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/scan" element={
          <ProtectedRoute>
             <Layout user={user} onLogout={handleLogout}>
              <Scanner user={user} />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/bot-watch" element={
          <ProtectedRoute>
             <Layout user={user} onLogout={handleLogout}>
              <BotWatch />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/subscription" element={
          <ProtectedRoute>
             <Layout user={user} onLogout={handleLogout}>
              <Subscription user={user} onUpgrade={handleUpgrade} />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
             <Layout user={user} onLogout={handleLogout}>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
