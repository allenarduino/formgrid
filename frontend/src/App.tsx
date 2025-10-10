import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { RequireAuth } from './components/RequireAuth'
import { LandingPage } from './pages/LandingPage'
import { SignupPage } from './pages/SignupPage'
import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { DashboardPage } from './pages/DashboardPage'
import { FormsPage } from './pages/FormsPage'
import { FormBuilderPage } from './pages/FormBuilderPage'
import { FormDetailsPage } from './pages/FormDetailsPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'

function AppContent() {
    const location = useLocation()
    const isDashboardRoute = location.pathname.startsWith('/dashboard')

    return (
        <div className="min-h-screen bg-gray-50">
            {!isDashboardRoute && <Navbar />}
            <div className={!isDashboardRoute ? 'pt-16' : ''}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <DashboardPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/dashboard/forms"
                        element={
                            <RequireAuth>
                                <FormsPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/dashboard/forms/new"
                        element={
                            <RequireAuth>
                                <FormBuilderPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/dashboard/forms/:id/edit"
                        element={
                            <RequireAuth>
                                <FormBuilderPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/dashboard/forms/:id"
                        element={
                            <RequireAuth>
                                <FormDetailsPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/dashboard/profile"
                        element={
                            <RequireAuth>
                                <ProfilePage />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App
