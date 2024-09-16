import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import TeamLeaderDashboard from './components/teamleader/TeamLeaderDashboard';
import UserDashboard from './components/user/UserDashboard';
import Unauthorized from './components/Unauthorized';
import AddRequestForm from './components/user/AddRequestForm';
import ExpensesPage from './components/ExpensePage/ExpensePage';
import ProfilePage from './components/profile/ProfilePage';
import ProductsPage from './components/product/ProductPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/user/add-request" element={<AddRequestForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teamleader"
          element={
            <ProtectedRoute requiredRole="team_leader">
              <TeamLeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
