import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TripProvider } from "./context/TripContext";
import { UserProvider } from "./context/UserContext";

// Layouts & Authentication
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import PlannerPage from "./pages/Planner/PlannerPage";
import SavedTripsPage from "./pages/SavedTrips/SavedTripsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import { ArchitectureDocs } from "./components/docs/ArchitectureDocs";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          <TripProvider>
            <UserProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Authentication Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Command Center Dashboard Area */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/planner" element={<PlannerPage />} />
                    <Route path="/trips" element={<SavedTripsPage filterFavorites={false} />} />
                    <Route path="/favorites" element={<SavedTripsPage filterFavorites={true} />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/docs" element={<ArchitectureDocs />} />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </UserProvider>
          </TripProvider>
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
