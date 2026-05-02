import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- PAGE IMPORTS ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard"; // Standard Student Dashboard
import ResumePage from "./components/resume/ResumePage";
import ResumeBuilder from "./components/resume/ResumeBuilder";
import InterviewPage from "./components/interview/InterviewPage";
import Contact from "./pages/Contact";
import Pathways from "./pages/Pathways";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./components/admin/AdminDashboard";

// --- SUPERADMIN IMPORTS ---
// Corrected to match your folder structure: src/components/SuperAdmin/
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";


// --- COMPONENT IMPORTS ---
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

/**
 * Talent Match - AI Career Accelerator
 * Optimized for CIMDR Tech Leaders 2026
 */
function App() {
  const location = useLocation();

  // Hide Navbar on specific authentication/recovery pages for a cleaner look
  const hideNavbarOn = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/super-admin",
    "/admin" // Optional: Hide on SuperAdmin dashboard if you want a distinct layout
  ];

  const shouldShowNavbar = !hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-800 selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden relative" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* ── GLOBAL PREMIUM MESH GRADIENT BACKGROUND ───────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[1000px] h-[1000px] rounded-full bg-pink-500/30 blur-[120px]" 
        />
        <motion.div 
          animate={{ y: [0, 80, 0], x: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-rose-500/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], y: [0, -60, 0], x: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-20%] left-[10%] w-[1200px] h-[1200px] rounded-full bg-fuchsia-500/30 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], y: [0, 40, 0], x: [0, -40, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] -right-[10%] w-[900px] h-[900px] rounded-full bg-pink-400/20 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.1)_100%)] mix-blend-multiply" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />


      </div>

      {/* Persistent Navigation */}
      {shouldShowNavbar && <Navbar />}

      {/* Main Content Area */}
      <main className={`flex-grow relative z-10 ${shouldShowNavbar ? "pt-24" : ""}`}>
        <Routes>
          {/* --- PUBLIC ACCESSIBLE ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />

          {/* --- PASSWORD RECOVERY FLOW --- */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* --- PROTECTED AI CAREER TOOLS --- */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* AI Resume Analyzer & Match Intelligence */}
          <Route path="/resume" element={<ResumePage />} />

          {/* AI Mock Interview Battleground */}
          <Route path="/interview" element={<InterviewPage />} />

          {/* AI Resume Builder */}
          <Route path="/resume-builder" element={<ResumeBuilder />} />

          {/* Career Pathways */}
          <Route path="/career-path" element={<Pathways />} />

          {/* About & Legal Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/help" element={<Help />} />

          {/* --- SUPERADMIN CONTROL CENTER --- */}
          <Route path="/admin" element={<AdminDashboard />} />


          {/* --- SUPERADMIN CONTROL CENTER --- */}
          {/* Linked to your specialized SuperAdmin components */}
          <Route path="/super-admin" element={<SuperAdminDashboard />} />

          {/* --- FALLBACKS --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Persistent Global Footer */}
      {shouldShowNavbar && <Footer />}
    </div>
  );
}

export default App;