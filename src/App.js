import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';
import Profile from './components/Profile/Profile';
import AddRecord from './components/Records/AddRecord';
import RecordsList from './components/Records/RecordsList';
import SearchRecord from './components/Records/SearchRecord';
import RulesList from './components/Rules/RulesList';
import UsersList from './components/Users/UsersList';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';


function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<UsersList />} />
                      <Route path="rules" element={<RulesList />} />
                      <Route path="records" element={<RecordsList />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      <Route path="records/add" element={<AddRecord />} />
                      <Route path="records/search" element={<SearchRecord />} />
                      <Route path="profile" element={<Profile />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
