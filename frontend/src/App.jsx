import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MangaDetails from './pages/MangaDetails';
import MangaBrowse from './pages/MangaBrowse';
import UserProfile from './pages/UserProfile';
import UserLibrary from './pages/UserLibrary';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Header />
          <Box flex="1" py={8} px={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/manga/:id" element={<MangaDetails />} />
              <Route path="/browse" element={<MangaBrowse />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/library" 
                element={
                  <ProtectedRoute>
                    <UserLibrary />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App; 