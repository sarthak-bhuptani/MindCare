import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import Journal from "./pages/Journal";
import Breathing from "./pages/Breathing";
import MindGame from "./pages/MindGame";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CheckIn from "./pages/CheckIn";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import { isOnboarded } from "./lib/onboarding";

import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requireOnboarding = true }: { children: React.ReactNode, requireOnboarding?: boolean }) => {
  const { isAuthenticated } = useAuth();
  const hasOnboarded = isOnboarded();

  if (!isAuthenticated) return <Navigate to="/" />;

  if (requireOnboarding && !hasOnboarded) {
    return <Navigate to="/onboarding" />;
  }

  // Prevent going back to onboarding if already completed
  if (!requireOnboarding && hasOnboarded) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
              <Route path="/mindgame" element={<ProtectedRoute><MindGame /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute requireOnboarding={false}><Onboarding /></ProtectedRoute>} />
              <Route path="/check-in" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
