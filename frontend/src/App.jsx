import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";

/* -----------------------------
   Lazy Loaded Pages
------------------------------ */
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Verify = lazy(() => import("./pages/Verify"));
const Home = lazy(() => import("./pages/Home"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const ScanDisease = lazy(() => import("./pages/ScanDisease"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

/* -----------------------------
   AI Advanced Modules
------------------------------ */
const AIAnalytics = lazy(() => import("./pages/AIAnalytics"));
const CropPrediction = lazy(() => import("./pages/CropPrediction"));
const WeatherInsights = lazy(() => import("./pages/WeatherInsights"));

/* -----------------------------
   Page Animation
------------------------------ */
const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

/* -----------------------------
   Professional Loader
------------------------------ */
function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 text-slate-300">Loading Agro AI (farm intelligence)...</p>
      </div>
    </div>
  );
}

/* -----------------------------
   Protected Route
------------------------------ */
function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    roles.length > 0 &&
    (!user.role || !roles.includes(user.role))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* -----------------------------
   Animated Wrapper
------------------------------ */
function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

/* -----------------------------
   Main App
------------------------------ */
export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            {/* Authentication */}
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />

            <Route
              path="/home"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />

            <Route
              path="/register"
              element={
                <PageWrapper>
                  <Register />
                </PageWrapper>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <PageWrapper>
                  <ForgotPassword />
                </PageWrapper>
              }
            />

            <Route
              path="/reset-password"
              element={
                <PageWrapper>
                  <ResetPassword />
                </PageWrapper>
              }
            />

            <Route
              path="/verify"
              element={
                <PageWrapper>
                  <Verify />
                </PageWrapper>
              }
            />

            {/* User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* AI Disease Detection */}
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <ScanDisease />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* AI Chat Assistant */}
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <ChatBot />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* AI Analytics */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <AIAnalytics />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Crop Prediction */}
            <Route
              path="/crop-prediction"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <CropPrediction />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Weather Intelligence */}
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <WeatherInsights />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Admin Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <PageWrapper>
                    <AdminPanel />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* 404 Redirect */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}