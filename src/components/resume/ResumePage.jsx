import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as htmlToImage from 'html-to-image';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import {
  Upload, CheckCircle2, AlertTriangle, FileText, Loader2, Zap, Search,
  Target, MessageSquare, Download, Trophy, Sparkles, Brain, Shield,
  TrendingUp, Eye, XCircle, RefreshCw, Share2, Clock, ChevronRight,
  Star, Lightbulb, Code2, Users, BarChart3, Wand2, History, X, Bell
} from "lucide-react";

// ─── TOAST STYLES ──────────────────────────────────────────────────────────────
const neonToastStyle = {
  background: "#0a0a1a",
  color: "#a78bfa",
  border: "1px solid rgba(167,139,250,0.4)",
  boxShadow: "0 0 20px rgba(167,139,250,0.2), inset 0 0 20px rgba(167,139,250,0.03)",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: "700",
  borderRadius: "16px",
  fontSize: "14px",
};

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: neonToastStyle,
  progressStyle: { background: "linear-gradient(90deg, #a78bfa, #f472b6)" },
  icon: "✦",
};

const showToast = {
  success: (msg) => toast.success(msg, { ...toastOptions, icon: "✅" }),
  error: (msg) => toast.error(msg, {
    ...toastOptions,
    style: { ...neonToastStyle, color: "#f87171", border: "1px solid rgba(248,113,113,0.4)" },
    progressStyle: { background: "linear-gradient(90deg, #f87171, #fb923c)" },
    icon: "❌",
  }),
  info: (msg) => toast.info(msg, { ...toastOptions, icon: "⚡" }),
  warn: (msg) => toast.warn(msg, {
    ...toastOptions,
    style: { ...neonToastStyle, color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)" },
    progressStyle: { background: "linear-gradient(90deg, #fbbf24, #f59e0b)" },
    icon: "⚠️",
  }),
};

// ============================================================
// 🎨 DESIGN TOKENS & CONSTANTS
// ============================================================
const NEON = {
  purple: "#a855f7",
  pink: "#ec4899",
  green: "#22c55e",
  yellow: "#eab308",
  cyan: "#D946EF",
  red: "#ef4444",
};

const LOADING_STEPS = [
  { id: 1, label: "Parsing Resume", icon: FileText, color: "text-cyan-400" },
  { id: 2, label: "Extracting Skills", icon: Brain, color: "text-purple-400" },
  { id: 3, label: "Matching ATS Keywords", icon: Target, color: "text-yellow-400" },
  { id: 4, label: "Generating AI Insights", icon: Sparkles, color: "text-cyan-400" },
];

const getScoreTheme = (score) => {
  if (score >= 85) return { color: NEON.green, textClass: "text-green-400", bgClass: "bg-green-500/10", borderClass: "border-green-500/30", label: "Excellent", badge: "🏆 Top Tier" };
  if (score >= 70) return { color: NEON.cyan, textClass: "text-cyan-400", bgClass: "bg-cyan-500/10", borderClass: "border-cyan-500/30", label: "Good", badge: "✅ Strong" };
  if (score >= 50) return { color: NEON.yellow, textClass: "text-yellow-400", bgClass: "bg-yellow-500/10", borderClass: "border-yellow-500/30", label: "Average", badge: "⚡ Moderate" };
  return { color: NEON.red, textClass: "text-red-400", bgClass: "bg-red-500/10", borderClass: "border-red-500/30", label: "Needs Work", badge: "⚠️ Improve" };
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ============================================================
// 🧩 SUB-COMPONENTS
// ============================================================

const SocialShareModal = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;
  const score = result?.atsScore ?? 0;
  const shareText = `I just analyzed my resume with TalentMatch AI and scored ${score}/100! I'm optimizing my profile for ATS algorithms to land my next role! #Career #Resume #Tech`;
  const encodedText = encodeURIComponent(shareText);
  const appUrl = encodeURIComponent("https://ai-interview-gateway.app");

  const platforms = [
    { name: "Twitter / X",  icon: <FaTwitter />,  color: "bg-[#1DA1F2]/20 border-[#1DA1F2]/40 text-[#1DA1F2] hover:bg-[#1DA1F2]/30", url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${appUrl}` },
    { name: "LinkedIn",     icon: <FaLinkedin />, color: "bg-[#0A66C2]/20 border-[#0A66C2]/40 text-[#0A66C2] hover:bg-[#0A66C2]/30", url: `https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}&summary=${encodedText}` },
    { name: "WhatsApp",     icon: <FaWhatsapp />, color: "bg-[#25D366]/20 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30", url: `https://wa.me/?text=${encodedText}%20${appUrl}` },
    { name: "Email",        icon: <FaEnvelope />, color: "bg-violet-600/20 border-violet-500/40 text-violet-300 hover:bg-violet-600/30", url: `mailto:?subject=${encodeURIComponent("My AI Resume Action Report")}&body=${encodedText}` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n\nhttps://ai-interview-gateway.app`);
    showToast.success("Text and link copied to clipboard!");
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-transparent/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.8, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
          className="bg-transparent border border-zinc-200 rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-violet-900/30"
          onClick={(e) => e.stopPropagation()}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-600/20 border border-violet-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Share2 className="text-2xl text-violet-400" />
            </div>
            <h3 className="text-2xl font-black mb-1">Share Your Insights</h3>
            <p className="text-zinc-500 text-sm">Let your network know about your progress!</p>
          </div>
          <div className="bg-white/3 border border-zinc-100 rounded-2xl p-5 mb-6">
            <p className="text-sm text-zinc-600 leading-relaxed font-mono">{shareText}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {platforms.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border font-bold text-sm transition-all ${p.color}`}
                onClick={() => showToast.success(`Opening ${p.name}…`)}>
                <span className="text-xl">{p.icon}</span>{p.name}
              </a>
            ))}
          </div>
          <button onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold text-sm text-zinc-600 hover:bg-zinc-100 transition-all">
            <Search size={16} /> Copy Text Only
          </button>
          <button onClick={onClose} className="w-full mt-3 text-sm text-zinc-500 hover:text-zinc-600 transition-colors font-bold">Close</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// 🎨 NEW ANIMATED BOXES BACKGROUND (Overrides local background to show global grid)
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <motion.div 
      animate={{ y: [0, -150, 0], rotate: [0, 180, 360] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[15%] left-[15%] w-20 h-20 rounded-2xl border-[6px] border-pink-500/40 z-0" 
    />
    <motion.div 
      animate={{ y: [0, 100, 0], rotate: [0, -180, -360] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 3 }}
      className="absolute top-[50%] right-[10%] w-24 h-24 rounded-full border-[6px] border-rose-500/40 z-0" 
    />
    <motion.div 
      animate={{ x: [0, -80, 0], y: [0, -80, 0], rotate: [0, 90, 180] }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 2 }}
      className="absolute bottom-[25%] left-[20%] w-16 h-16 rounded-xl border-[6px] border-fuchsia-500/40 z-0" 
    />
    <motion.div 
      animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: [0, -90, -180] }}
      transition={{ duration: 32, repeat: Infinity, ease: "linear", delay: 1 }}
      className="absolute top-[25%] right-[30%] w-12 h-12 bg-rose-400/30 rounded-lg z-0" 
    />
    <motion.div 
      animate={{ y: [0, -60, 0], rotate: [45, 90, 135] }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 4 }}
      className="absolute bottom-[15%] right-[25%] w-20 h-20 border-[6px] border-pink-600/30 z-0" 
    />
  </div>
);

const LoadingSkeleton = ({ currentStep }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 w-full">
    <div className="bg-white/60 backdrop-blur-xl border border-zinc-200 p-12 rounded-[3.5rem] shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden">
      
      {/* SHIMMER EFFECT BACKWARDS */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent w-[200%] animate-[shimmer_2s_infinite]" />

      <div className="relative z-10">
        {/* Loading Header & Steps */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-zinc-100 pb-8">
           <div className="flex flex-col gap-2">
             <div className="w-64 h-8 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 rounded-lg animate-pulse" />
             <div className="w-40 h-4 bg-zinc-200 rounded-lg animate-pulse mt-2" />
           </div>
           {/* Steps Mini-Tracker */}
           <div className="flex items-center gap-3">
             {LOADING_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={step.id} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    isDone ? "bg-green-500/20 border-green-500/50 text-green-400" :
                    isActive ? "bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]" :
                    "bg-zinc-50 border-zinc-200 text-gray-600"
                  }`} title={step.label}>
                    {isActive ? <span className="animate-spin"><Loader2 size={16}/></span> : (isDone ? <CheckCircle2 size={16}/> : <Icon size={16}/>)}
                  </div>
                );
             })}
           </div>
        </div>

        {/* Wireframes */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="h-40 rounded-[2.5rem] bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-[pulse_1.5s_infinite] border border-zinc-100" />
          <div className="h-40 rounded-[2.5rem] bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-[pulse_1.8s_infinite] border border-zinc-100" delay="0.2s" />
        </div>
        
        <div className="h-64 rounded-[2.5rem] bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-[pulse_2s_infinite] border border-zinc-100 mb-8" />
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="h-48 rounded-[2.5rem] bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-[pulse_1.6s_infinite] border border-zinc-100" delay="0.3s" />
          <div className="h-48 rounded-[2.5rem] bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 animate-[pulse_2.2s_infinite] border border-zinc-100" delay="0.1s" />
        </div>
      </div>
    </div>
  </motion.div>
);

const DropZone = ({ file, setFile, fileInputRef, isDragging, setIsDragging }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }, [setFile, setIsDragging]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => fileInputRef.current?.click()}
      className={`relative group border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
        file ? "border-green-500/60 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]" :
        isDragging ? "border-purple-400/80 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.2)] scale-[1.02]" :
        "border-zinc-800 hover:border-purple-500/50 hover:bg-purple-500/5 bg-white/60"
      }`}
    >
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} accept=".pdf" className="hidden" />
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div key="file" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
              <CheckCircle2 size={52} className="mx-auto mb-4 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            </motion.div>
            <p className="text-base font-black text-green-300 mb-1 truncate px-4">{file.name}</p>
            <p className="text-xs text-zinc-500 font-mono">{formatFileSize(file.size)} • PDF</p>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Upload size={48} className={`mx-auto mb-4 transition-colors ${isDragging ? "text-purple-400" : "text-zinc-700 group-hover:text-purple-500"}`} />
            <p className="text-base font-black text-zinc-500 mb-2">Drop your PDF here</p>
            <p className="text-xs text-zinc-700 tracking-widest uppercase">or click to browse</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScoreRing = ({ score, theme }) => {
  const R = 110;
  const CIRC = 2 * Math.PI * R;
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 rounded-full blur-[40px] opacity-20" style={{ background: theme.color }} />
      <svg className="-rotate-90 w-full h-full" viewBox="0 0 256 256">
        <circle cx="128" cy="128" r={R} stroke="#111" strokeWidth="14" fill="transparent" />
        <circle cx="128" cy="128" r={R} stroke={theme.color} strokeWidth="5" fill="transparent" strokeOpacity="0.15" />
        <motion.circle
          cx="128" cy="128" r={R} stroke={theme.color} strokeWidth="14" fill="transparent"
          strokeDasharray={CIRC} initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC - (CIRC * score) / 100 }}
          transition={{ duration: 2.2, ease: [0.34, 1.56, 0.64, 1] }}
          strokeLinecap="round" filter={`drop-shadow(0 0 12px ${theme.color})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="text-7xl font-black leading-none" style={{ color: theme.color }}>{score}</motion.span>
        <span className="text-xs font-black uppercase tracking-[0.3em] mt-1" style={{ color: theme.color }}>{theme.label}</span>
      </div>
    </div>
  );
};

const NeonTag = ({ label, color = "green" }) => {
  const styles = {
    green: "bg-green-500/10 text-green-400 border-green-500/20 hover:border-green-400/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    pink: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:border-yellow-400/60 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  };
  return (
    <motion.span whileHover={{ scale: 1.05 }} className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold border uppercase tracking-wide transition-all cursor-default ${styles[color]}`}>
      {label}
    </motion.span>
  );
};

const SectionCard = ({ title, icon: Icon, iconColor, borderColor, children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={`bg-white/60 rounded-[2.5rem] border p-8 backdrop-blur-sm ${borderColor}`}>
    <h4 className={`flex items-center gap-3 font-black text-xl md:text-2xl xl:text-3xl tracking-widest uppercase mb-6 md:mb-8 ${iconColor}`}>
      <Icon size={26} /> {title}
    </h4>
    {children}
  </motion.div>
);

const ProgressBar = ({ name, score, color = "#a855f7", delay = 0 }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{name}</span>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.5 }}
        className="text-sm font-black text-zinc-800">{score}%</motion.span>
    </div>
    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.2, delay, ease: "easeOut" }}
        className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}60` }} />
    </div>
  </div>
);

const HistoryCard = ({ entry, onReDownload }) => {
  const theme = getScoreTheme(entry.score);
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-purple-500/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <FileText size={18} className="text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800 truncate max-w-[200px]">{entry.name}</p>
          <p className="text-xs text-zinc-600 font-mono">{entry.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-black ${theme.textClass}`}>{entry.score}</span>
        <button onClick={() => onReDownload(entry)} className="p-2 rounded-xl bg-zinc-50 hover:bg-purple-500/20 transition-all">
          <Download size={14} className="text-zinc-500" />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================
// 🏠 MAIN COMPONENT
// ============================================================
const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobDescText, setJobDescText] = useState("");
  const [showJDMatch, setShowJDMatch] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);
  const shareRef = useRef(null);

  const handleFileSet = useCallback((f) => {
    if (f?.type !== "application/pdf") { showToast.error("Only PDF files are accepted"); return; }
    if (f.size > 10 * 1024 * 1024) { showToast.error("File too large (max 10MB)"); return; }
    setFile(f); setResult(null); setError(null);
    showToast.success(`${f.name} ready for analysis`);
  }, []);

  const handleAnalyze = async () => {
    if (!file) { showToast.error("Please upload a resume first"); return; }
    
    let token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        token = userInfo.token || userInfo.jwt || userInfo.accessToken; 
      } catch (e) {
        console.error("Could not parse userInfo");
      }
    }

    if (!token || token === "null" || token === "undefined") {
      showToast.error("Auth Error: Token missing. Please log out and log back in.");
      return; 
    }

    const formData = new FormData();
    formData.append("resume", file);
    
    try {
      setLoading(true); setError(null);
      
      // Start fake loading progression in background
      let step = 0;
      setLoadingStep(0);
      const interval = setInterval(() => {
        if (step < LOADING_STEPS.length - 1) {
          step++;
          setLoadingStep(step);
        }
      }, 1500);
      
      const { data } = await axios.post("/api/resume/analyze", formData, { 
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        } 
      });
      
      clearInterval(interval);
      setLoadingStep(LOADING_STEPS.length);

      if (data && data.atsScore !== undefined) {
        setResult(data);
        const entry = { id: Date.now(), name: file.name, score: data.atsScore, date: new Date().toLocaleDateString(), data };
        setHistory(prev => [entry, ...prev.slice(0, 4)]);
        showToast.success("Analysis complete! 🎉");
      } else {
        throw new Error("Invalid ATS report generated by AI");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Please try again.";
      showToast.error("Analysis failed: " + errMsg);
      setError(errMsg);
    } finally {
      setLoading(false); setLoadingStep(0);
    }
  };

  // --- 📤 SHARE HANDLER (MODAL) ---
  const handleShare = () => {
    if (!result) {
      showToast.error("Report content not found to share");
      return;
    }
    setShowShareModal(true);
  };

  // --- 📄 PERFECT ONE-PAGE PDF GENERATOR ---
  const handleDownloadReport = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const purple = [124, 58, 237], dark = [10, 10, 10];
    const theme = getScoreTheme(result.atsScore);

    // Header
    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("TALENT MATCH — ATS ANALYSIS", 15, 15);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleString()} | File: ${file?.name}`, 15, 22);

    // Score Banner
    doc.setFillColor(...purple);
    doc.roundedRect(155, 8, 40, 20, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`${result.atsScore}`, 165, 20);
    doc.setFontSize(8);
    doc.text("SCORE / 100", 165, 25);

    let currentY = 45;

    // Keywords Table
    autoTable(doc, {
      startY: currentY,
      head: [['Matched Skills', 'Missing Keywords']],
      body: [[result.skillsMatched?.join(", ") || "None", result.missingKeywords?.join(", ") || "None"]],
      headStyles: { fillColor: dark, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } }
    });
    currentY = doc.lastAutoTable.finalY + 8;

    // Factors & Analysis
    autoTable(doc, {
      startY: currentY,
      head: [['Optimization Metrics', 'Strength/Impact']],
      body: result.atsFactors?.map(f => [f.name, `${f.score}%`]) || [],
      headStyles: { fillColor: purple, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      theme: 'striped'
    });
    currentY = doc.lastAutoTable.finalY + 8;

    // Strengths & Weaknesses
    autoTable(doc, {
      startY: currentY,
      head: [['Key Strengths', 'Areas to Improve']],
      body: result.strengths?.map((s, i) => [s, result.weaknesses?.[i] || ""]) || [],
      headStyles: { fillColor: [40, 40, 40], fontSize: 9 },
      styles: { fontSize: 7, cellPadding: 2.5 }
    });
    currentY = doc.lastAutoTable.finalY + 8;

    // Questions
    if (result.interviewQuestions?.length) {
      autoTable(doc, {
        startY: currentY,
        head: [['Top 5 Interview Prep Questions']],
        body: result.interviewQuestions.slice(0, 5).map(q => [q]),
        headStyles: { fillColor: [236, 72, 153], fontSize: 9 },
        styles: { fontSize: 7, cellPadding: 2 }
      });
    }

    doc.save(`TalentMatch_Report.pdf`);
    showToast.success("PDF report downloaded perfectly!");
  };

  const theme = result ? getScoreTheme(result.atsScore) : null;
  const BAR_COLORS = [NEON.purple, NEON.cyan, NEON.yellow, NEON.pink, NEON.green];
  const displayQuestions = result?.interviewQuestions?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-transparent text-zinc-800 selection:bg-purple-500/30 font-sans relative" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeButton={true} toastStyle={neonToastStyle} style={{ zIndex: 99999 }} />
      <SocialShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} result={result} />
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-16">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-[0.25em] mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <Sparkles size={14} /> AI-Powered Resume Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none">
            TALENT <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">MATCH</span>
          </h1>
          <p className="text-zinc-500 text-xl xl:text-3xl font-light italic tracking-wide max-w-3xl mx-auto">
            "Decode your resume. Beat the ATS. Land the interview."
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            {history.length > 0 && (
              <button onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm font-bold hover:border-purple-500/40 hover:text-purple-400 transition-all backdrop-blur-md">
                <History size={16} /> History ({history.length})
              </button>
            )}
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mt-6 max-w-2xl mx-auto bg-white/80 border border-zinc-200 rounded-[2rem] p-6 backdrop-blur-xl">
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">Previous Analyses</h3>
                <div className="space-y-3">
                  {history.map(entry => <HistoryCard key={entry.id} entry={entry} onReDownload={(e) => { setResult(e.data); setShowHistory(false); }} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div className="bg-white/60 border border-zinc-200 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Resume Input</h3>
              <DropZone file={file} setFile={handleFileSet} fileInputRef={fileInputRef} isDragging={isDragging} setIsDragging={setIsDragging} />
              
              <div className="mt-5">
                <button onClick={() => setShowJDMatch(!showJDMatch)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-zinc-100 text-zinc-500 text-xs font-bold uppercase tracking-wider hover:border-purple-500/30 transition-all">
                  <span className="flex items-center gap-2"><Target size={14} /> Job Description Match</span>
                  <ChevronRight size={14} className={showJDMatch ? "rotate-90" : ""} />
                </button>
                <AnimatePresence>
                  {showJDMatch && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <textarea value={jobDescText} onChange={(e) => setJobDescText(e.target.value)} placeholder="Paste job description here..."
                        className="w-full mt-3 h-28 bg-white/80 border border-zinc-100 rounded-2xl p-4 text-xs text-zinc-600 outline-none resize-none" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button onClick={handleAnalyze} disabled={loading || !file} whileTap={{ scale: 0.97 }}
                className="relative w-full mt-6 py-5 rounded-2xl font-black text-lg overflow-hidden disabled:opacity-30 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                style={{ background: !file ? "#111" : "linear-gradient(135deg, #D946EF, #C026D3)" }}>
                <span className="relative flex items-center justify-center gap-3">
                  {loading ? <Loader2 size={22} className="animate-spin" /> : <><Zap size={20} /> RUN AI ANALYSIS</>}
                </span>
              </motion.button>
            </motion.div>

            {result && theme && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`bg-white/60 p-8 rounded-[2.5rem] border ${theme.borderClass} backdrop-blur-xl`}>
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${theme.textClass}`}>ATS Score</h3>
                <ScoreRing score={result.atsScore} theme={theme} />
                <div className="space-y-3 mt-8">
                  <button onClick={handleDownloadReport}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-zinc-800 font-black text-sm tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <Download size={18} /> DOWNLOAD PDF REPORT
                  </button>
                  <button onClick={handleShare}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-600 text-base font-bold hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                    <Share2 size={18} /> Share Report
                  </button>
                  <button onClick={() => { setFile(null); setResult(null); }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-600 text-base font-bold hover:text-red-400 hover:border-red-500/30 transition-all">
                    <RefreshCw size={18} /> New Resume
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* MAIN RESULTS AREA */}
          <div ref={resultsRef} className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingSkeleton key="skeleton" currentStep={loadingStep} />
              ) : result ? (
                <motion.div ref={shareRef} key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="space-y-8 bg-white/60 backdrop-blur-xl border border-zinc-200 p-12 rounded-[3.5rem] shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <SectionCard title="Matched Skills" icon={CheckCircle2} iconColor="text-green-400" borderColor="border-green-500/15">
                      <div className="flex flex-wrap gap-2">
                        {result.skillsMatched?.map((s, i) => <NeonTag key={i} label={s} color="green" />)}
                      </div>
                    </SectionCard>
                    <SectionCard title="Missing Skills" icon={AlertTriangle} iconColor="text-cyan-400" borderColor="border-cyan-500/15">
                      <div className="flex flex-wrap gap-2">
                        {result.missingKeywords?.map((s, i) => <NeonTag key={i} label={s} color="pink" />)}
                      </div>
                    </SectionCard>
                  </div>

                  <SectionCard title="Optimization Factors" icon={BarChart3} iconColor="text-yellow-400" borderColor="border-yellow-500/10">
                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                      {result.atsFactors?.map((f, i) => (
                        <ProgressBar key={i} name={f.name} score={f.score} color={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </div>
                  </SectionCard>

                  <div className="grid md:grid-cols-2 gap-6">
                    <SectionCard title="Strengths" icon={Trophy} iconColor="text-cyan-400" borderColor="border-cyan-500/15">
                      <ul className="space-y-4">
                        {result.strengths?.map((s, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-600 text-base leading-relaxed"><Star size={16} className="text-cyan-500 mt-1 shrink-0" /> {s}</li>
                        ))}
                      </ul>
                    </SectionCard>
                    <SectionCard title="Weaknesses" icon={AlertTriangle} iconColor="text-red-400" borderColor="border-red-500/10">
                      <ul className="space-y-4">
                        {result.weaknesses?.map((w, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-600 text-base leading-relaxed"><XCircle size={16} className="text-red-500 mt-1 shrink-0" /> {w}</li>
                        ))}
                      </ul>
                    </SectionCard>
                  </div>

                  <SectionCard title="AI Suggestions" icon={Lightbulb} iconColor="text-yellow-400" borderColor="border-yellow-500/10">
                    <div className="space-y-4">
                      {result.suggestions?.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 bg-yellow-500/[0.04] border border-yellow-500/10 rounded-2xl">
                          <ChevronRight size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                          <p className="text-zinc-700 text-base leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <div className="bg-gradient-to-br from-white/60 to-[#E11D48]/10 rounded-[2.5rem] border border-zinc-200 p-8 backdrop-blur-sm">
                    <h4 className="flex items-center gap-3 font-black text-xl text-purple-400 mb-6 uppercase tracking-widest">
                      <MessageSquare size={22} /> Top 5 Interview Questions
                    </h4>
                    <div className="space-y-5">
                      {displayQuestions.map((q, i) => (
                        <div key={i} className="flex items-start gap-5 p-6 bg-white/80 border border-zinc-200 rounded-2xl">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-cyan-500 text-sm font-black">{i + 1}</span>
                          </div>
                          <p className="text-zinc-700 text-lg italic leading-relaxed">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="h-[700px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-[4rem] bg-white/40 backdrop-blur-sm">
                  <Search size={80} className="opacity-20 text-zinc-500 mb-8" />
                  <p className="text-zinc-500 text-xl font-medium">System Awaiting Input</p>
                  <p className="text-zinc-500 text-sm mt-2">Upload resume and click <strong className="text-purple-400">RUN AI ANALYSIS</strong></p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div className="text-center mt-20 text-zinc-600 text-xs font-mono tracking-widest">
          TALENT MATCH AI • {new Date().getFullYear()}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumePage;