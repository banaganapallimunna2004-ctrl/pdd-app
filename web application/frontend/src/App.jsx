import { useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import BackgroundByRoute from "./components/BackgroundByRoute";
import SplashScreen from "./components/SplashScreen";


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
const ScanDisease = lazy(() => import("./pages/ScanDisease"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Profile = lazy(() => import("./pages/Profile"));

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
    <div className="agri-page flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 font-semibold text-green-950">Loading Agro AI farm intelligence...</p>
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

import { LanguageProvider } from "./i18n";
import Layout from "./components/Layout";

/* -----------------------------
   Main App
------------------------------ */
export default function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first visit or page refresh
    return !sessionStorage.getItem("agro_splash_viewed");
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem("agro_splash_viewed", "true");
    setShowSplash(false);
  };

  // Pages that don't use the main Layout (like login/register)
  const isAuthPage = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify', '/home'].includes(location.pathname);

  return (
    <LanguageProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      </AnimatePresence>
      <div className="min-h-screen bg-transparent">
        <Suspense fallback={<Loader />}>
          {isAuthPage ? (
            <AnimatePresence mode="wait">
              <BackgroundByRoute key="auth-bg">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                  <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
                  <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
                  <Route path="/verify" element={<PageWrapper><Verify /></PageWrapper>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BackgroundByRoute>
            </AnimatePresence>
          ) : (
            <Layout>
              <AnimatePresence mode="wait">
                <BackgroundByRoute key="app-bg">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
                    <Route path="/scan" element={<ProtectedRoute><PageWrapper><ScanDisease /></PageWrapper></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><PageWrapper><AIAnalytics /></PageWrapper></ProtectedRoute>} />
                    <Route path="/crop-prediction" element={<ProtectedRoute><PageWrapper><CropPrediction /></PageWrapper></ProtectedRoute>} />
                    <Route path="/weather" element={<ProtectedRoute><PageWrapper><WeatherInsights /></PageWrapper></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute roles={["Admin"]}><PageWrapper><AdminPanel /></PageWrapper></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </BackgroundByRoute>
              </AnimatePresence>
            </Layout>
          )}
        </Suspense>
      </div>
    </LanguageProvider>
  );
}

