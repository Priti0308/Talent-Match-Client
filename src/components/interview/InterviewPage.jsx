import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaRobot, FaCode, FaUserTie, FaBrain, FaFileDownload,
  FaCheckCircle, FaLaptopCode, FaMicrophone, FaVideo,
  FaArrowRight, FaArrowLeft, FaClock, FaUpload, FaSpinner,
  FaExclamationTriangle, FaPlay, FaStar,
  FaTrophy, FaChartBar, FaBriefcase,
  FaChevronRight, FaForward, FaShareAlt, FaTwitter,
  FaLinkedin, FaWhatsapp, FaEnvelope, FaLink, FaStop
} from "react-icons/fa";

// ─── TOAST STYLES ──────────────────────────────────────────────────────────────
const neonToastStyle = {
  background: "#ffffff",
  color: "#8b5cf6",
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

// ─── API CONFIG ────────────────────────────────────────────────────────────────
const API_BASE = "https://talent-match-9rsc.onrender.com/api/interview";

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo?.token ? `Bearer ${userInfo.token}` : "";
};

const api = {
  startInterview: async (formData) => {
    const token = getToken();
    const headers = token ? { Authorization: token } : {};
    const res = await fetch(`${API_BASE}/startInterview`, { method: "POST", headers, body: formData });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to start interview");
    return res.json();
  },
  analyzeRound: async (payload) => {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = token;
    const res = await fetch(`${API_BASE}/analyzeRound`, {
      method: "POST", headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Analysis failed");
    return res.json();
  },
  finalizeInterview: async (payload) => {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = token;
    const res = await fetch(`${API_BASE}/finalizeInterview`, {
      method: "POST", headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Finalization failed");
    return res.json();
  },
};

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
// Stages differ by field: MCA gets Tech MCQ, MBA doesn't
const ALL_STAGES = [
  { id: "aptitude", label: "Aptitude", icon: <FaBrain /> },
  { id: "techMCQ", label: "Tech MCQ", icon: <FaCode /> },  // Only MCA
  { id: "resume", label: "Resume", icon: <FaLaptopCode /> },
  { id: "hr", label: "HR Round", icon: <FaUserTie /> },
];

const getStagesForField = (field) =>
  field === "MCA"
    ? ALL_STAGES
    : ALL_STAGES.filter(s => s.id !== "techMCQ");

// ─── TIMERS ────────────────────────────────────────────────────────────────────
// aptitude: 45min, techMCQ: 25min, resume: 25min, hr: 30min
const ROUND_TIMERS = {
  aptitude: 45 * 60,
  techMCQ: 25 * 60,
  resume: 25 * 60,
  hr: 30 * 60,
};

// ─── UTILITY ──────────────────────────────────────────────────────────────────
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ─── COLOR PALETTE (gradient-based background theme) ─────────────────────────
// Primary: #D946EF (deep violet), #E11D48 (purple-magenta), #C026D3 (rose-pink)
// Accent:  #BE185D (cyan), #F472B6 (amber), #3EE17A (emerald)

// ─── REUSABLE: NEON BUTTON ────────────────────────────────────────────────────
const NeonBtn = ({ children, onClick, disabled, color = "purple", size = "md", className = "" }) => {
  const colors = {
    purple: "bg-violet-600 hover:bg-violet-500 shadow-violet-600/40 border-violet-500",
    pink: "bg-cyan-600   hover:bg-cyan-500   shadow-cyan-600/40   border-cyan-500",
    green: "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/40 border-cyan-500",
    yellow: "bg-amber-500  hover:bg-amber-400  shadow-amber-500/40  border-amber-400",
    cyan: "bg-cyan-600   hover:bg-cyan-500   shadow-cyan-600/40   border-cyan-500",
    ghost: "bg-zinc-50    hover:bg-zinc-100   shadow-transparent   border-zinc-200",
  };
  const sizes = { sm: "px-4 py-2 text-base", md: "px-6 py-3 text-lg", lg: "px-8 py-5 text-xl", xl: "px-10 py-6 text-2xl" };
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`${colors[color]} ${sizes[size]} border rounded-2xl font-black tracking-wide transition-all duration-200
        shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
};

// ─── SKELETON LOADING OVERLAY ──────────────────────────────────────────────────
const LoadingOverlay = ({ message, type = "cards" }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-8 w-full">
    <div className="text-center mb-4 flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.3)] mb-6 animate-pulse">
        <FaRobot className="text-5xl text-sky-500" />
      </div>
      <p className="text-xl text-zinc-600 font-black animate-pulse uppercase tracking-widest">{message || "AI IS ANALYZING YOUR RESUME..."}</p>
    </div>
  </motion.div>
);

// ─── ERROR PANEL ──────────────────────────────────────────────────────────────
const ErrorPanel = ({ message, onRetry }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-3xl p-10 text-center">
    <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-4" />
    <h3 className="text-2xl font-black text-red-600 mb-2">Something went wrong</h3>
    <p className="text-zinc-500 mb-6 text-base">{message}</p>
    <NeonBtn color="pink" onClick={onRetry}>Try Again</NeonBtn>
  </motion.div>
);

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const GlowBar = ({ value, max, color = "purple", label }) => {
  const pct = Math.round((value / max) * 100);
  const colorMap = {
    purple: "from-violet-600 to-violet-400 shadow-violet-500/50",
    pink: "from-cyan-600   to-cyan-400   shadow-cyan-500/50",
    cyan: "from-cyan-600   to-cyan-400   shadow-cyan-500/50",
    green: "from-cyan-600 to-cyan-400 shadow-cyan-500/50",
    yellow: "from-amber-500  to-amber-300  shadow-amber-400/50",
  };
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-sm font-mono text-zinc-500 mb-1"><span>{label}</span><span>{pct}%</span></div>}
      <div className="h-2.5 bg-zinc-50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r shadow-lg ${colorMap[color]}`}
        />
      </div>
    </div>
  );
};

// ─── SCORE CARD ───────────────────────────────────────────────────────────────
const ScoreCard = ({ label, score, color, icon }) => (
  <div className="bg-white/90 border border-zinc-100 rounded-3xl p-6 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className="text-5xl font-black">{score ?? "—"}<span className="text-xl text-zinc-500 ml-1">%</span></p>
    <GlowBar value={score ?? 0} max={100} color={color} />
  </div>
);

// ─── SOCIAL SHARE MODAL ───────────────────────────────────────────────────────
const SocialShareModal = ({ isOpen, onClose, finalReport, roundResults }) => {
  if (!isOpen) return null;
  const score = finalReport?.finalScore ?? 0;
  const status = finalReport?.isShortlisted ? "SHORTLISTED 🎉" : "Completed Interview";
  const shareText = `I just completed an AI-powered interview and scored ${score}/100 — ${status}! My scores: Aptitude: ${roundResults.aptitude?.score ?? "N/A"}%, Tech MCQ: ${roundResults.techMCQ?.score ?? "N/A"}%, Resume: ${roundResults.resume?.score ?? "N/A"}%, HR: ${roundResults.hr?.score ?? "N/A"}%. #AIInterview #CareerGoals`;
  const encodedText = encodeURIComponent(shareText);
  const appUrl = encodeURIComponent("https://ai-interview-gateway.app");

  const platforms = [
    { name: "Twitter / X", icon: <FaTwitter />, color: "bg-[#1DA1F2]/20 border-[#1DA1F2]/40 text-[#1DA1F2] hover:bg-[#1DA1F2]/30", url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${appUrl}` },
    { name: "LinkedIn", icon: <FaLinkedin />, color: "bg-[#0A66C2]/20 border-[#0A66C2]/40 text-[#0A66C2] hover:bg-[#0A66C2]/30", url: `https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}&summary=${encodedText}` },
    { name: "WhatsApp", icon: <FaWhatsapp />, color: "bg-[#25D366]/20 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30", url: `https://wa.me/?text=${encodedText}%20${appUrl}` },
    { name: "Email", icon: <FaEnvelope />, color: "bg-violet-600/20 border-violet-500/40 text-violet-300 hover:bg-violet-600/30", url: `mailto:?subject=${encodeURIComponent("My AI Interview Results")}&body=${encodedText}` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n\nhttps://ai-interview-gateway.app`);
    showToast.success("Link copied to clipboard!");
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
              <FaShareAlt className="text-2xl text-violet-400" />
            </div>
            <h3 className="text-2xl font-black mb-1">Share Your Results</h3>
            <p className="text-zinc-500 text-sm">Let the world know about your achievement!</p>
          </div>
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 mb-6">
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
            <FaLink /> Copy Link
          </button>
          <button onClick={onClose} className="w-full mt-3 text-sm text-zinc-500 hover:text-zinc-600 transition-colors font-bold">Close</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── PDF GENERATOR (Corporate Black & White) ───────────────────────────────────
const generatePDFReport = async ({ interviewData, finalReport, roundResults }) => {
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve; script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297, ML = 20, MR = 20, CW = W - ML - MR;
  
  const C = {
    white: [255,255,255], black: [0,0,0], bg: [250,250,250],
    g100: [243,244,246], g200: [229,231,235], g300: [209,213,219],
    g400: [156,163,175], g500: [107,114,128], g600: [75,85,99],
    g700: [55,65,81],   g800: [31,41,55],   g900: [17,24,39]
  };

  const F = (rgb) => doc.setFillColor(...rgb);
  const S = (rgb) => doc.setDrawColor(...rgb);
  const T = (rgb) => doc.setTextColor(...rgb);
  const Font = (size, style = "normal") => { doc.setFontSize(size); doc.setFont("helvetica", style); };
  
  const isOK = finalReport?.isShortlisted;

  const header = (title, pageNum) => {
    F(C.white); doc.rect(0, 0, W, H, "F");
    T(C.black); Font(18, "bold"); doc.text("INTERVIEW ASSESSMENT REPORT", ML, 25);
    S(C.g900); doc.setLineWidth(0.8); doc.line(ML, 30, W - MR, 30);
    T(C.g500); Font(9, "bold"); doc.text(`AI-Powered Recruitment Platform  |  Confidential  |  Page ${pageNum}`, ML, 36);
    Font(10, "bold"); doc.text(title, W - MR, 25, { align: "right" });
  };

  const drawBox = (x, y, w, h, title, isDark = false) => {
    if (isDark) {
      F(C.g900); doc.rect(x, y, w, h, "F");
      T(C.white); Font(10, "bold"); doc.text(title, x + 5, y + 6);
    } else {
      F(C.g100); doc.rect(x, y, w, h, "F");
      S(C.g300); doc.setLineWidth(0.3); doc.rect(x, y, w, h, "S");
      if (title) { T(C.g800); Font(10, "bold"); doc.text(title, x + 5, y + 6); }
    }
  };

  // PAGE 1: EXECUTIVE SUMMARY
  header("EXECUTIVE SUMMARY", 1);
  let yPos = 45;

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const candidateName = userInfo?.user?.name || "Candidate";

  drawBox(ML, yPos, CW, 25, "CANDIDATE DETAILS", false);
  T(C.g800); Font(9, "bold"); doc.text(`Name: ${candidateName}`, ML + 5, yPos + 12);
  Font(9, "normal");
  doc.text(`Track: ${interviewData?.field || "General"}`, ML + 5, yPos + 18);
  doc.text(`Resume: ${interviewData?.filename || "Uploaded PDF"}`, W - MR - 5, yPos + 12, { align: "right" });
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`Date of Assessment: ${dateStr}`, W - MR - 5, yPos + 18, { align: "right" });
  yPos += 35;

  const vBoxW = CW;
  F(C.white); S(C.black); doc.setLineWidth(1); doc.rect(ML, yPos, vBoxW, 35, "S");
  T(C.black); Font(12, "bold"); doc.text("OVERALL OUTCOME", ML + 5, yPos + 8);
  Font(28, "bold"); doc.text(`${finalReport?.finalScore ?? "—"}/100`, W - MR - 5, yPos + 22, { align: "right" });
  T(isOK ? [34,197,94] : [239,68,68]); Font(14, "bold");
  doc.text(isOK ? "RECOMMENDED FOR SHORTLIST" : "NOT RECOMMENDED", ML + 5, yPos + 18);
  T(C.g600); Font(9, "normal");
  doc.text(isOK ? "Excellent performance." : "Did not meet required thresholds.", ML + 5, yPos + 25);
  yPos += 45;

  T(C.black); Font(12, "bold"); doc.text("CORE METRICS", ML, yPos);
  S(C.g300); doc.setLineWidth(0.3); doc.line(ML, yPos + 2, W - MR, yPos + 2);
  yPos += 8;
  const metrics = [
    { label: "Communication", val: finalReport?.communicationLevel || "N/A" },
    { label: "Confidence", val: finalReport?.confidenceLevel || "N/A" },
    { label: "Correctness", val: (finalReport?.correctnessScore ? finalReport.correctnessScore + "%" : "N/A") }
  ];
  metrics.forEach((m, i) => {
    const mx = ML + i * (CW / 3);
    drawBox(mx, yPos, (CW / 3) - 4, 18, "", false);
    T(C.g600); Font(8, "bold"); doc.text(m.label.toUpperCase(), mx + 5, yPos + 6);
    T(C.black); Font(12, "bold"); doc.text(m.val.toString(), mx + 5, yPos + 13);
  });
  yPos += 28;

  T(C.black); Font(12, "bold"); doc.text("HIRING DOSSIER", ML, yPos);
  S(C.g300); doc.setLineWidth(0.3); doc.line(ML, yPos + 2, W - MR, yPos + 2);
  yPos += 8;
  Font(9, "normal"); T(C.g800);
  if (Array.isArray(finalReport?.hiringDossier)) {
    finalReport.hiringDossier.forEach(point => {
      const lines = doc.splitTextToSize(`• ${point}`, CW);
      doc.text(lines, ML, yPos);
      yPos += lines.length * 5;
    });
  } else {
    const lines = doc.splitTextToSize(finalReport?.hiringDossier || "N/A", CW);
    doc.text(lines, ML, yPos);
    yPos += lines.length * 5;
  }

  // PAGE 2: ROUND OVERVIEW
  doc.addPage(); header("ROUND-BY-ROUND BREAKDOWN", 2);
  yPos = 45;

  const rounds = [
    { key: "aptitude", label: "Aptitude Test" },
    { key: "techMCQ", label: "Technical MCQ" },
    { key: "resume", label: "Resume Interview" },
    { key: "hr", label: "HR & Behavioral" },
  ];

  rounds.forEach((r) => {
    const res = roundResults[r.key];
    if (!res) return;
    
    if (yPos > H - 40) {
      doc.addPage(); header("ROUND-BY-ROUND BREAKDOWN (CONT.)", doc.internal.getNumberOfPages());
      yPos = 45;
    }

    F(C.g100); doc.rect(ML, yPos, CW, 8, "F");
    T(C.black); Font(10, "bold"); doc.text(r.label.toUpperCase(), ML + 3, yPos + 5);
    Font(10, "bold"); doc.text(`${res.score}% - ${res.status.toUpperCase()}`, W - MR - 3, yPos + 5, { align: "right" });
    yPos += 12;

    if (res.feedback && res.feedback.length > 0) {
      T(C.g900); Font(9, "bold"); doc.text("Key Observations:", ML + 2, yPos);
      yPos += 5;
      Font(9, "normal"); T(C.g700);
      res.feedback.slice(0, 4).forEach(fb => {
        const lines = doc.splitTextToSize(`- ${fb}`, CW - 10);
        doc.text(lines, ML + 5, yPos);
        yPos += lines.length * 5;
      });
    } else {
      Font(9, "italic"); T(C.g500); doc.text("No specific feedback provided.", ML + 2, yPos);
      yPos += 6;
    }
    yPos += 5;
  });

  // PAGE 3: RECOMMENDATIONS
  doc.addPage(); header("RECOMMENDATIONS & DEVELOPMENT", doc.internal.getNumberOfPages());
  yPos = 45;

  T(C.black); Font(12, "bold"); doc.text("RECOMMENDED ROLES", ML, yPos);
  S(C.black); doc.setLineWidth(0.5); doc.line(ML, yPos + 2, W - MR, yPos + 2);
  yPos += 8;
  Font(10, "normal"); T(C.g800);
  if (finalReport?.suggestedRoles?.length > 0) {
    finalReport.suggestedRoles.forEach((role) => {
      doc.text(`• ${role}`, ML + 2, yPos);
      yPos += 6;
    });
  } else {
    doc.text("No specific roles recommended.", ML + 2, yPos); yPos += 6;
  }
  yPos += 10;

  T(C.black); Font(12, "bold"); doc.text("AREAS FOR DEVELOPMENT", ML, yPos);
  S(C.black); doc.line(ML, yPos + 2, W - MR, yPos + 2);
  yPos += 8;
  if (finalReport?.skillsToImprove?.length > 0) {
    finalReport.skillsToImprove.forEach((skill) => {
      doc.text(`• ${skill}`, ML + 2, yPos);
      yPos += 6;
    });
  } else {
    doc.text("No critical improvement areas identified.", ML + 2, yPos); yPos += 6;
  }

  doc.save(`Talent_Match_${candidateName.replace(/\s+/g,"_")}_Report.pdf`);
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
const InterviewApp = () => {
  const [screen, setScreen] = useState("upload");
  const [activeStage, setActiveStage] = useState("aptitude");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [apiError, setApiError] = useState(null);
  const [retryStage, setRetryStage] = useState(null);

  const [interviewData, setInterviewData] = useState(null);

  // ── Question indices
  const [aptIdx, setAptIdx] = useState(0);
  const [techMCQIdx, setTechMCQIdx] = useState(0);  // Tech MCQ index
  const [intIdx, setIntIdx] = useState(0);

  // ── Answers
  const [aptAnswers, setAptAnswers] = useState({});
  const [aptSkipped, setAptSkipped] = useState(new Set());
  const [techMCQAnswers, setTechMCQAnswers] = useState({});  // Tech MCQ answers
  const [techMCQSkipped, setTechMCQSkipped] = useState(new Set());
  const [resumeAnswers, setResumeAnswers] = useState({});
  const [hrAnswers, setHrAnswers] = useState({});

  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [roundResults, setRoundResults] = useState({});
  const [currentRoundResult, setCurrentRoundResult] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  // ── Timers: one per round
  const [aptTime, setAptTime] = useState(ROUND_TIMERS.aptitude);
  const [techMCQTime, setTechMCQTime] = useState(ROUND_TIMERS.techMCQ);
  const [resumeTime, setResumeTime] = useState(ROUND_TIMERS.resume);
  const [hrTime, setHrTime] = useState(ROUND_TIMERS.hr);

  const aptTimerRef = useRef(null);
  const techMCQTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const hrTimerRef = useRef(null);

  const videoRef = useRef(null);
  const mediaStream = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAnswer, setVoiceAnswer] = useState("");
  const recognitionRef = useRef(null);

  const speak = useCallback((text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.95;
    window.speechSynthesis.speak(msg);
  }, []);

  const getAptSection = () => {
    if (aptIdx < 15) return "Numerical Ability";
    if (aptIdx < 30) return "Verbal Ability";
    return "Reasoning Ability";
  };

  // ─── Timer helper: get current timer value for header display
  const getCurrentTimerValue = () => {
    if (activeStage === "aptitude") return aptTime;
    if (activeStage === "techMCQ") return techMCQTime;
    if (activeStage === "resume") return resumeTime;
    if (activeStage === "hr") return hrTime;
    return 0;
  };

  // ─── Full reset
  const resetInterview = () => {
    setScreen("upload"); setFile(null); setInterviewData(null);
    setAptIdx(0); setTechMCQIdx(0); setIntIdx(0);
    setAptAnswers({}); setAptSkipped(new Set());
    setTechMCQAnswers({}); setTechMCQSkipped(new Set());
    setResumeAnswers({}); setHrAnswers({});
    setRoundResults({}); setFinalReport(null); setActiveStage("aptitude");
    setAptTime(ROUND_TIMERS.aptitude);
    setTechMCQTime(ROUND_TIMERS.techMCQ);
    setResumeTime(ROUND_TIMERS.resume);
    setHrTime(ROUND_TIMERS.hr);
    setRetryStage(null);
    showToast.info("Interview reset. Upload a new resume to begin.");
  };

  // ─── Retry a failed round
  const retryFailedRound = (stageName) => {
    setRetryStage(stageName);
    const stageId =
      stageName === "Aptitude" ? "aptitude"
        : stageName === "Tech MCQ" ? "techMCQ"
          : stageName === "Resume Interview" ? "resume"
            : "hr";

    if (stageId === "aptitude") { setAptAnswers({}); setAptSkipped(new Set()); setAptIdx(0); setAptTime(ROUND_TIMERS.aptitude); }
    if (stageId === "techMCQ") { setTechMCQAnswers({}); setTechMCQSkipped(new Set()); setTechMCQIdx(0); setTechMCQTime(ROUND_TIMERS.techMCQ); }
    if (stageId === "resume") { setResumeAnswers({}); setIntIdx(0); setResumeTime(ROUND_TIMERS.resume); }
    if (stageId === "hr") { setHrAnswers({}); setIntIdx(0); setHrTime(ROUND_TIMERS.hr); }

    const updated = { ...roundResults };
    delete updated[stageId];
    setRoundResults(updated);
    setActiveStage(stageId);
    setCurrentRoundResult(null);
    setScreen("process");
    showToast.info(`Retrying ${stageName} round. Good luck!`);
  };

  // ─── TIMER EFFECTS ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "process" || activeStage !== "aptitude") return;
    aptTimerRef.current = setInterval(() => {
      setAptTime(t => {
        if (t <= 1) { clearInterval(aptTimerRef.current); submitAptitude(); return 0; }
        if (t === 300) showToast.warn("⏰ 5 minutes remaining in Aptitude!");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(aptTimerRef.current);
  }, [screen, activeStage]);

  useEffect(() => {
    if (screen !== "process" || activeStage !== "techMCQ") return;
    techMCQTimerRef.current = setInterval(() => {
      setTechMCQTime(t => {
        if (t <= 1) { clearInterval(techMCQTimerRef.current); submitTechMCQ(); return 0; }
        if (t === 300) showToast.warn("⏰ 5 minutes remaining in Tech MCQ!");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(techMCQTimerRef.current);
  }, [screen, activeStage]);

  useEffect(() => {
    if (screen !== "process" || activeStage !== "resume") return;
    resumeTimerRef.current = setInterval(() => {
      setResumeTime(t => {
        if (t <= 1) { clearInterval(resumeTimerRef.current); return 0; }
        if (t === 300) showToast.warn("⏰ 5 minutes remaining in Resume round!");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(resumeTimerRef.current);
  }, [screen, activeStage]);

  useEffect(() => {
    if (screen !== "process" || activeStage !== "hr") return;
    hrTimerRef.current = setInterval(() => {
      setHrTime(t => {
        if (t <= 1) { clearInterval(hrTimerRef.current); return 0; }
        if (t === 300) showToast.warn("⏰ 5 minutes remaining in HR Round!");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(hrTimerRef.current);
  }, [screen, activeStage]);

  // ─── CAMERA ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeStage === "resume" || activeStage === "hr") {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mediaStream.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          showToast.success("Camera & microphone connected!");
        }).catch(() => showToast.warn("Camera/mic not available. Using text input."));
    }
    return () => { mediaStream.current?.getTracks().forEach(t => t.stop()); };
  }, [activeStage]);

  // ─── FILE DROP ───────────────────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") { setFile(f); showToast.success(`Resume uploaded: ${f.name}`); }
    else showToast.error("Please upload a PDF file only.");
  };

  // ─── API CALLS ───────────────────────────────────────────────────────────────
  const handleStartInterview = async () => {
    setApiError(null);
    setLoadingMsg("🤖 Gemini AI is analyzing your resume…");
    setScreen("loading");
    showToast.info("Analyzing resume with Gemini AI…");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const data = await api.startInterview(fd);
      setInterviewData(data);
      setScreen("process");
      setActiveStage("aptitude");
      showToast.success("Resume analyzed! Interview starting now.");
      speak("Welcome! Your AI interview has begun. Starting with the Aptitude Test.");
    } catch (e) { setApiError(e.message); setScreen("error"); showToast.error(e.message); }
  };

  const submitAptitude = async () => {
    clearInterval(aptTimerRef.current);
    const answeredCount = Object.keys(aptAnswers).length;
    if (answeredCount < 5) {
      showToast.warn(`Please answer at least 5 questions. (${answeredCount} answered)`);
      return;
    }
    setLoadingMsg("📊 Evaluating your aptitude answers…");
    setScreen("loading");
    try {
      const questions = interviewData.aptitude;
      const answers = questions.map((q, i) => ({ question: q.question, answer: aptAnswers[i] || "Unanswered", correct: q.correct }));
      const result = await api.analyzeRound({ roundName: "Aptitude", questions: questions.map(q => q.question), answers, field: interviewData.field });
      const updated = { ...roundResults, aptitude: result };
      setRoundResults(updated);
      setCurrentRoundResult({ ...result, roundName: "Aptitude" });
      setScreen("roundResult");
      if (result.status === "Qualified") showToast.success(`Aptitude: ${result.score}% — Qualified! 🎉`);
      else showToast.error(`Aptitude: ${result.score}% — Not qualified.`);
    } catch (e) { setApiError(e.message); setScreen("error"); showToast.error(e.message); }
  };

  // ─── TECH MCQ SUBMIT (NEW) ──────────────────────────────────────────────────
  const submitTechMCQ = async () => {
    clearInterval(techMCQTimerRef.current);
    const answeredCount = Object.keys(techMCQAnswers).length;
    if (answeredCount < 3) {
      showToast.warn(`Please answer at least 3 Tech MCQ questions. (${answeredCount} answered)`);
      return;
    }
    setLoadingMsg("💻 Evaluating your Tech MCQ answers…");
    setScreen("loading");
    try {
      const questions = interviewData.tech_mcq || [];
      const answers = questions.map((q, i) => ({
        question: q.question,
        answer: techMCQAnswers[i] || "Unanswered",
        correct: q.correct,
      }));
      const result = await api.analyzeRound({
        roundName: "Tech MCQ",
        questions: questions.map(q => q.question),
        answers,
        field: interviewData.field,
      });
      const updated = { ...roundResults, techMCQ: result };
      setRoundResults(updated);
      setCurrentRoundResult({ ...result, roundName: "Tech MCQ" });
      setScreen("roundResult");
      if (result.status === "Qualified") showToast.success(`Tech MCQ: ${result.score}% — Qualified! 🎉`);
      else showToast.error(`Tech MCQ: ${result.score}% — Not qualified.`);
    } catch (e) { setApiError(e.message); setScreen("error"); showToast.error(e.message); }
  };

  // ─── RESUME INTERVIEW SUBMIT ─────────────────────────────────────────────────
  const submitResume = async () => {
    clearInterval(resumeTimerRef.current);
    setLoadingMsg("🧠 Analyzing your Resume interview…");
    setScreen("loading");
    try {
      const questions = interviewData.technical_questions;
      const answers = questions.map((_, i) => resumeAnswers[i] || "No answer");
      const result = await api.analyzeRound({
        roundName: "Resume Interview",
        questions,
        answers,
        field: interviewData.field,
      });
      const updated = { ...roundResults, resume: result };
      setRoundResults(updated);
      setCurrentRoundResult({ ...result, roundName: "Resume Interview" });
      setIntIdx(0); setResumeTime(ROUND_TIMERS.resume);
      setScreen("roundResult");
      if (result.status === "Qualified") showToast.success(`Resume Round: ${result.score}% — Qualified! 🎉`);
      else showToast.error(`Resume Round: ${result.score}% — Not qualified.`);
    } catch (e) { setApiError(e.message); setScreen("error"); showToast.error(e.message); }
  };

  const submitHR = async () => {
    clearInterval(hrTimerRef.current);
    setLoadingMsg("🎤 Analyzing your HR performance…");
    setScreen("loading");
    try {
      const questions = interviewData.hr_questions;
      const answers = questions.map((_, i) => hrAnswers[i] || "No answer");
      const result = await api.analyzeRound({ roundName: "HR Round", questions, answers, field: interviewData.field });
      const allResults = { ...roundResults, hr: result };
      setRoundResults(allResults);
      setLoadingMsg("🏆 Generating your final report…");
      showToast.info("Generating final report…");
      const final = await api.finalizeInterview({ allRoundResults: allResults, field: interviewData.field });
      setFinalReport(final);
      setScreen("result");
      if (final.isShortlisted) showToast.success("🎉 Congratulations! You've been SHORTLISTED!");
      else showToast.warn("Interview complete. Review your feedback to improve.");
    } catch (e) { setApiError(e.message); setScreen("error"); showToast.error(e.message); }
  };

  // ─── PROCEED AFTER ROUND ────────────────────────────────────────────────────
  const proceedAfterRound = () => {
    const field = interviewData.field;
    if (currentRoundResult?.roundName === "Aptitude") {
      // MCA goes to Tech MCQ first, MBA goes directly to Resume
      const nextStage = field === "MCA" ? "techMCQ" : "resume";
      setActiveStage(nextStage);
      speak(`Aptitude complete. Starting ${field === "MCA" ? "Tech MCQ" : "Resume"} round.`);
    } else if (currentRoundResult?.roundName === "Tech MCQ") {
      setActiveStage("resume");
      speak("Tech MCQ done. Starting Resume Interview.");
    } else if (currentRoundResult?.roundName === "Resume Interview") {
      setActiveStage("hr");
      speak("Resume round done. Starting HR round.");
    }
    setCurrentRoundResult(null);
    setIntIdx(0);
    setScreen("process");
  };

  // ─── VOICE RECOGNITION ──────────────────────────────────────────────────────
  const toggleRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast.error("Speech recognition not supported."); return; }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      showToast.info("Recording stopped.");
    } else {
      const rec = new SR();
      rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
      rec.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join(" ");
        setVoiceAnswer(transcript);
      };
      rec.onend = () => setIsRecording(false);
      rec.start();
      recognitionRef.current = rec;
      setIsRecording(true);
      showToast.success("Recording started. Speak your answer…");
    }
  };

  // ─── SKIP APTITUDE ───────────────────────────────────────────────────────────
  const skipAptQuestion = () => {
    const totalApt = interviewData?.aptitude?.length || 45;
    setAptSkipped(prev => { const s = new Set(prev); s.add(aptIdx); return s; });
    if (aptIdx < totalApt - 1) setAptIdx(p => p + 1);
    showToast.info(`Question ${aptIdx + 1} skipped.`);
  };

  const skipTechMCQQuestion = () => {
    const total = interviewData?.tech_mcq?.length || 20;
    setTechMCQSkipped(prev => { const s = new Set(prev); s.add(techMCQIdx); return s; });
    if (techMCQIdx < total - 1) setTechMCQIdx(p => p + 1);
    showToast.info(`Tech MCQ Question ${techMCQIdx + 1} skipped.`);
  };

  // ─── SIDEBAR ─────────────────────────────────────────────────────────────────
  const SidebarTracker = () => {
    const field = interviewData?.field || "MCA";
    const visibleStages = getStagesForField(field);
    const currentIdx = visibleStages.findIndex(s => s.id === activeStage);
    return (
      <div className="hidden lg:flex flex-col gap-3 w-64 mr-8 sticky top-8 self-start">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2 px-2">Interview Pipeline</p>
        {visibleStages.map((s, idx) => {
          const done = currentIdx > idx;
          const active = currentIdx === idx;
          return (
            <div key={s.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${active ? "bg-violet-600/15 border-violet-500/60 shadow-[0_0_20px_rgba(108,60,225,0.2)]"
                : done ? "border-cyan-500/30 bg-cyan-500/5" : "border-zinc-100 opacity-25"
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${active ? "bg-violet-600 shadow-lg shadow-violet-600/40"
                  : done ? "bg-cyan-600/30 text-cyan-400" : "bg-zinc-50"
                }`}>
                {done ? <FaCheckCircle className="text-cyan-400" /> : s.icon}
              </div>
              <div>
                <p className="font-black text-base leading-none">{s.label}</p>
                <p className="text-xs text-zinc-500 mt-1">{done ? "Completed" : active ? "In Progress" : "Pending"}</p>
              </div>
            </div>
          );
        })}
        {interviewData && (
          <div className="mt-4 p-5 rounded-2xl bg-white border border-zinc-100">
            <p className="text-xs font-mono text-zinc-500 mb-2">CANDIDATE</p>
            <p className="font-black text-base">{interviewData.field} Track</p>
            <p className="text-xs text-violet-400 mt-1">{file?.name}</p>
          </div>
        )}
      </div>
    );
  };

  // ─── HEADER ──────────────────────────────────────────────────────────────────
  const Header = () => {
    const timerVal = getCurrentTimerValue();
    const warning = timerVal < 300;
    return (
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex items-center justify-between mb-8 p-6
        bg-transparent/50 backdrop-blur-2xl border border-sky-200 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-violet-600 to-cyan-600 p-4 rounded-xl shadow-lg shadow-violet-600/30">
            <FaRobot className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">AI Interview System</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">{interviewData?.field} · {activeStage.toUpperCase()} ROUND</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border font-mono font-black text-xl transition-all ${warning ? "border-red-500/60 bg-red-500/10 text-red-400 animate-pulse" : "border-zinc-200 bg-zinc-50 text-zinc-800"
          }`}>
          <FaClock className="text-lg" />
          {formatTime(timerVal)}
        </div>
      </div>
    );
  };

  // ─── QUESTION TRACKER (reusable for Aptitude & Tech MCQ) ─────────────────────
  const QuestionTracker = ({ total, current, setIndex, answers, skipped, color = "purple" }) => {
    const colorMap = {
      purple: "bg-violet-500 border-violet-300 shadow-[0_0_8px_rgba(108,60,225,0.8)]",
      cyan: "bg-cyan-500 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    };
    return (
      <div className="flex flex-wrap gap-1.5 p-4 bg-white rounded-2xl border border-zinc-100 mb-4">
        {Array.from({ length: total }, (_, i) => {
          const isAnswered = answers[i] !== undefined;
          const isSkipped = skipped.has(i) && !isAnswered;
          const isCurrent = i === current;
          return (
            <button key={i} onClick={() => setIndex(i)}
              title={isAnswered ? `Q${i + 1}: Answered` : isSkipped ? `Q${i + 1}: Skipped` : `Q${i + 1}: Not attempted`}
              className={`w-7 h-7 rounded-full text-[10px] font-black transition-all border flex items-center justify-center
                ${isCurrent
                  ? `${colorMap[color]} scale-110`
                  : isAnswered
                    ? "bg-cyan-600/80 border-cyan-400/60 text-zinc-800"
                    : isSkipped
                      ? "bg-amber-500/60 border-amber-400/50 text-amber-100"
                      : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-violet-500/50"
                }`}
            >
              {i + 1}
            </button>
          );
        })}
        <div className="w-full flex items-center gap-6 mt-2 pt-2 border-t border-zinc-100">
          {[
            { cls: "bg-cyan-600/80 border-cyan-400/60", label: `Answered (${Object.keys(answers).length})` },
            { cls: "bg-amber-500/60 border-amber-400/50", label: `Skipped (${skipped.size})` },
            { cls: "bg-zinc-50 border-zinc-200", label: `Unanswered (${total - Object.keys(answers).length - skipped.size})` },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border ${cls}`} />
              <span className="text-xs text-zinc-500 font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-zinc-800 font-sans overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeButton={true} toastStyle={neonToastStyle} style={{ zIndex: 99999 }} />

      {/* ── ANIMATED BOXES BACKGROUND (Overrides local background to show global grid) ─────────────────────────────────────────────── */}
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

      {/* ── SOCIAL SHARE MODAL ──────────────────────────────────────────────── */}
      <SocialShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} finalReport={finalReport} roundResults={roundResults} />

      <div className="relative z-10 px-4 py-6 lg:px-10 lg:py-8 w-full max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">

          {/* ══ UPLOAD ══════════════════════════════════════════════════════════ */}
          {screen === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center justify-center min-h-screen">
              <div className="w-full max-w-md">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-400 bg-amber-400 shadow-[0_0_20px_rgba(225,160,62,0.4)]">
                    <span className="text-black text-base">✦</span>
                    <p className="text-sm font-black tracking-wide text-black">Your next opportunity begins with one upload. Make it count.</p>
                    <span className="text-black text-base">✦</span>
                  </div>
                </motion.div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 shadow-2xl shadow-violet-600/30"
                    style={{ background: "linear-gradient(135deg, rgba(108,60,225,0.3), rgba(177,62,225,0.2))", border: "1px solid rgba(108,60,225,0.4)" }}>
                    <FaRobot className="text-4xl text-violet-400" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-3 whitespace-nowrap text-center flex justify-center w-full mx-auto">
                    <span className="text-blue-500">AI INTERVIEW GATEWAY</span>
                  </h1>
                  <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Upload your PDF resume. Gemini AI will analyze it and generate a fully personalized multi-round interview.
                  </p>
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`mb-6 border-2 border-dashed rounded-2xl transition-all duration-300 ${file ? "border-cyan-500/70 bg-cyan-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                      : isDragging ? "border-violet-400/70 bg-violet-500/5 scale-[1.01]"
                        : "border-zinc-200 hover:border-violet-500/50 hover:bg-white"
                    }`}
                >
                  <label className="flex flex-col items-center py-8 px-6 cursor-pointer">
                    <input type="file" hidden accept=".pdf" onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) { setFile(f); showToast.success(`Resume uploaded: ${f.name}`); }
                    }} />
                    {file ? (
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                        <FaCheckCircle className="text-5xl text-cyan-400 mx-auto mb-3" />
                        <p className="font-black text-cyan-300 text-lg">{file.name}</p>
                        <p className="text-cyan-600 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB · PDF Ready</p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <FaUpload className="text-4xl text-zinc-500 mx-auto mb-3" />
                        <p className="font-black text-zinc-600 text-sm uppercase tracking-widest mb-1">Drop your resume here</p>
                        <p className="text-gray-600 text-xs">or click to browse · PDF only</p>
                      </div>
                    )}
                  </label>
                </div>

                <NeonBtn color="purple" size="lg" disabled={!file} onClick={handleStartInterview} className="w-full">
                  <FaRobot /> ANALYZE RESUME & BEGIN <FaArrowRight />
                </NeonBtn>

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  {[["🧠", "AI-Generated Questions"], ["⚡", "Real-time Evaluation"], ["📊", "Smart Final Report"]].map(([e, t]) => (
                    <div key={t} className="p-3 rounded-2xl bg-white border border-zinc-100">
                      <div className="text-2xl mb-1.5">{e}</div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ LOADING ════════════════════════════════════════════════════════ */}
          {screen === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingOverlay message={loadingMsg} />
            </motion.div>
          )}

          {/* ══ ERROR ══════════════════════════════════════════════════════════ */}
          {screen === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-screen">
              <ErrorPanel message={apiError} onRetry={resetInterview} />
            </motion.div>
          )}

          {/* ══ ROUND RESULT ═══════════════════════════════════════════════════ */}
          {screen === "roundResult" && currentRoundResult && (
            <motion.div key="roundResult" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-screen">
              <div className="max-w-3xl w-full">
                <div className={`relative overflow-hidden p-12 rounded-[3rem] border text-center ${currentRoundResult.status === "Qualified"
                    ? "bg-cyan-900/10 border-cyan-500/30 shadow-[0_0_60px_rgba(16,185,129,0.1)]"
                    : "bg-red-900/10 border-red-200"
                  }`}>
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  {currentRoundResult.status === "Qualified"
                    ? <FaTrophy className="text-7xl text-amber-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                    : <FaExclamationTriangle className="text-7xl text-red-400 mx-auto mb-6" />
                  }
                  <h2 className="text-5xl font-black tracking-tighter mb-2">{currentRoundResult.roundName}</h2>
                  <p className="text-7xl font-black my-6">{currentRoundResult.score}<span className="text-3xl text-zinc-500">%</span></p>
                  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-black text-base mb-8 ${currentRoundResult.status === "Qualified"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-red-500/20 text-red-600 border border-red-500/40"
                    }`}>
                    {currentRoundResult.status === "Qualified" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    {currentRoundResult.status}
                  </div>
                  {/* <p className="text-zinc-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">{currentRoundResult.summary}</p> */}
                  {currentRoundResult.feedback?.length > 0 && (
                    <div className="bg-white rounded-2xl p-8 mb-8 text-left space-y-4">
                      {currentRoundResult.feedback.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-base text-zinc-700">
                          <FaChevronRight className="text-violet-400 mt-1 flex-shrink-0" /><span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentRoundResult.status === "Qualified"
                    ? <NeonBtn color="green" size="lg" onClick={proceedAfterRound} className="mx-auto">
                      Continue to Next Round <FaArrowRight />
                    </NeonBtn>
                    : (
                      <div className="flex flex-wrap items-center gap-4 justify-center w-full max-w-3xl mx-auto mt-6">
                        <NeonBtn color="pink" size="lg" onClick={() => retryFailedRound(currentRoundResult.roundName)} className="px-8 justify-center whitespace-nowrap">
                          Retry This Round
                        </NeonBtn>
                        {currentRoundResult.roundName !== "HR Round" && (
                          <NeonBtn color="ghost" size="lg" onClick={proceedAfterRound} className="px-8 justify-center border-gray-500/50 hover:bg-gray-500/10 hover:text-zinc-800 whitespace-nowrap">
                            Skip & Continue
                          </NeonBtn>
                        )}
                        <NeonBtn color="ghost" size="lg" onClick={resetInterview} className="px-8 justify-center border-gray-500/50 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/40 whitespace-nowrap">
                          Start Over
                        </NeonBtn>
                      </div>
                    )
                  }
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ PROCESS ════════════════════════════════════════════════════════ */}
          {screen === "process" && interviewData && (
            <motion.div key="process" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Header />
              <div className="flex items-start">
                <SidebarTracker />
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">

                    {/* ── APTITUDE ────────────────────────────────────────────── */}
                    {activeStage === "aptitude" && (() => {
                      const q = interviewData.aptitude[aptIdx];
                      if (!q) return null;
                      const totalApt = interviewData.aptitude.length;
                      return (
                        <motion.div key={`apt-${aptIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                          <QuestionTracker total={totalApt} current={aptIdx} setIndex={setAptIdx} answers={aptAnswers} skipped={aptSkipped} color="purple" />
                          <div className="bg-sky-50 backdrop-blur-xl border border-sky-200 rounded-[2.5rem] overflow-hidden">
                            <div className="flex items-center justify-between px-10 py-6 border-b border-zinc-100">
                              <div>
                                <p className="text-sm font-mono text-violet-400 uppercase tracking-widest mb-1">{getAptSection()}</p>
                                <h3 className="text-3xl font-black tracking-tighter">Question {aptIdx + 1} / {totalApt}</h3>
                              </div>
                              <div className="flex gap-2">
                                {[0, 1, 2].map(i => (
                                  <div key={i} className={`w-12 h-2 rounded-full transition-all ${Math.floor(aptIdx / 15) >= i ? "bg-violet-500 shadow-[0_0_8px_rgba(108,60,225,0.6)]" : "bg-zinc-50"}`} />
                                ))}
                              </div>
                            </div>
                            <div className="px-10 pt-6"><GlowBar value={aptIdx + 1} max={totalApt} color="purple" /></div>
                            <div className="px-10 py-8">
                              <div className="bg-white border border-zinc-100 rounded-2xl p-8 mb-8 shadow-inner">
                                <p className="text-2xl font-bold leading-relaxed text-zinc-800">{q.question}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oi) => {
                                  const labels = ["A", "B", "C", "D"];
                                  const selected = aptAnswers[aptIdx] === opt;
                                  return (
                                    <button key={oi} onClick={() => {
                                      setAptAnswers(prev => ({ ...prev, [aptIdx]: opt }));
                                      setAptSkipped(prev => { const s = new Set(prev); s.delete(aptIdx); return s; });
                                    }}
                                      className={`flex items-center gap-5 p-6 rounded-2xl border text-left font-semibold transition-all duration-200 ${selected ? "bg-violet-600/20 border-violet-400/60 shadow-[0_0_15px_rgba(108,60,225,0.2)] scale-[1.01]"
                                          : "bg-white border-sky-200 hover:border-violet-500/40 hover:bg-zinc-50"
                                        }`}>
                                      <span className={`w-10 h-10 rounded-xl text-base font-black flex items-center justify-center flex-shrink-0 ${selected ? "bg-violet-600 text-zinc-800 shadow-lg shadow-violet-600/30" : "bg-zinc-100 text-zinc-600"
                                        }`}>{labels[oi]}</span>
                                      <span className="text-lg text-zinc-800">{opt}</span>
                                      {selected && <FaCheckCircle className="ml-auto text-violet-400 text-xl" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex gap-4 px-10 pb-8 items-center bg-sky-100/50 p-4 border-t border-sky-100 flex-wrap">
                              <NeonBtn color="ghost" size="md" disabled={aptIdx === 0} onClick={() => setAptIdx(p => Math.max(0, p - 1))}>
                                <FaArrowLeft /> Prev
                              </NeonBtn>
                              <NeonBtn color="cyan" size="md" disabled={aptIdx >= totalApt - 1} onClick={() => setAptIdx(p => p + 1)}>
                                Next <FaArrowRight />
                              </NeonBtn>
                              <NeonBtn color="yellow" size="md" onClick={skipAptQuestion} disabled={aptAnswers[aptIdx] !== undefined}>
                                <FaForward /> Skip
                              </NeonBtn>
                              <NeonBtn color="purple" size="md" onClick={submitAptitude} className="ml-auto">
                                Submit Section <FaCheckCircle />
                              </NeonBtn>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* ── TECH MCQ (Only for MCA / Tech students) ─────────────── */}
                    {activeStage === "techMCQ" && (() => {
                      const techMCQs = interviewData.tech_mcq || [];
                      const q = techMCQs[techMCQIdx];
                      if (!q) return (
                        <motion.div key="techMCQ-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="p-10 text-center text-zinc-500">
                          <p className="text-2xl font-black mb-4">Tech MCQ data not available</p>
                          <NeonBtn color="cyan" onClick={proceedAfterRound}>Skip to Resume Round <FaArrowRight /></NeonBtn>
                        </motion.div>
                      );
                      const totalTechMCQ = techMCQs.length;
                      return (
                        <motion.div key={`techMCQ-${techMCQIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                          {/* Tech MCQ tracker */}
                          <QuestionTracker total={totalTechMCQ} current={techMCQIdx} setIndex={setTechMCQIdx} answers={techMCQAnswers} skipped={techMCQSkipped} color="cyan" />

                          <div className="bg-sky-50 backdrop-blur-xl border border-sky-200 rounded-[2.5rem] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-10 py-6 border-b border-zinc-100"
                              style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.05), transparent)" }}>
                              <div>
                                <p className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-1">
                                  Tech MCQ · {q.category || interviewData.detectedLanguages || "Programming"}
                                </p>
                                <h3 className="text-3xl font-black tracking-tighter">Question {techMCQIdx + 1} / {totalTechMCQ}</h3>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs px-3 py-1.5 rounded-full font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                                  {q.difficulty || "Medium"}
                                </span>
                                <span className="text-xs px-3 py-1.5 rounded-full font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300">
                                  {q.language || "General"}
                                </span>
                              </div>
                            </div>

                            <div className="px-10 pt-6"><GlowBar value={techMCQIdx + 1} max={totalTechMCQ} color="cyan" /></div>

                            <div className="px-10 py-8">
                              <div className="bg-white/90 border border-cyan-500/10 rounded-2xl p-8 mb-8 shadow-inner">
                                <p className="text-2xl font-bold leading-relaxed text-zinc-800">{q.question}</p>
                                {/* Code snippet if present */}
                                {q.code && (
                                  <pre className="mt-4 bg-zinc-50 border border-zinc-100 rounded-xl p-4 text-sm text-cyan-300 font-mono overflow-x-auto">
                                    {q.code}
                                  </pre>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oi) => {
                                  const labels = ["A", "B", "C", "D"];
                                  const selected = techMCQAnswers[techMCQIdx] === opt;
                                  return (
                                    <button key={oi} onClick={() => {
                                      setTechMCQAnswers(prev => ({ ...prev, [techMCQIdx]: opt }));
                                      setTechMCQSkipped(prev => { const s = new Set(prev); s.delete(techMCQIdx); return s; });
                                    }}
                                      className={`flex items-center gap-5 p-6 rounded-2xl border text-left font-semibold transition-all duration-200 ${selected
                                          ? "bg-cyan-600/15 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.01]"
                                          : "bg-white border-sky-200 hover:border-cyan-500/40 hover:bg-zinc-50"
                                        }`}>
                                      <span className={`w-10 h-10 rounded-xl text-base font-black flex items-center justify-center flex-shrink-0 ${selected ? "bg-cyan-600 text-zinc-800 shadow-lg shadow-cyan-600/30" : "bg-zinc-100 text-zinc-600"
                                        }`}>{labels[oi]}</span>
                                      <span className="text-lg text-zinc-800 font-mono">{opt}</span>
                                      {selected && <FaCheckCircle className="ml-auto text-cyan-400 text-xl" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex gap-4 px-10 pb-8 items-center bg-sky-100/50 p-4 border-t border-sky-100 flex-wrap">
                              <NeonBtn color="ghost" size="md" disabled={techMCQIdx === 0} onClick={() => setTechMCQIdx(p => Math.max(0, p - 1))}>
                                <FaArrowLeft /> Prev
                              </NeonBtn>
                              <NeonBtn color="cyan" size="md" disabled={techMCQIdx >= totalTechMCQ - 1} onClick={() => setTechMCQIdx(p => p + 1)}>
                                Next <FaArrowRight />
                              </NeonBtn>
                              <NeonBtn color="yellow" size="md" onClick={skipTechMCQQuestion} disabled={techMCQAnswers[techMCQIdx] !== undefined}>
                                <FaForward /> Skip
                              </NeonBtn>
                              <NeonBtn color="cyan" size="md" onClick={submitTechMCQ} className="ml-auto">
                                Submit Tech MCQ <FaCheckCircle />
                              </NeonBtn>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* ── RESUME / HR INTERVIEW ────────────────────────────────── */}
                    {(activeStage === "resume" || activeStage === "hr") && (() => {
                      const isHR = activeStage === "hr";
                      const questions = isHR ? interviewData.hr_questions : interviewData.technical_questions;
                      const answers = isHR ? hrAnswers : resumeAnswers;
                      const setAnswer = isHR ? setHrAnswers : setResumeAnswers;
                      const totalQs = questions.length;
                      const curQ = questions[intIdx];
                      const curAns = answers[intIdx] || "";
                      const colorTheme = isHR ? "pink" : "yellow";

                      return (
                        <div className="flex flex-col gap-6">
                          <QuestionTracker total={totalQs} current={intIdx} setIndex={(i) => { setVoiceAnswer(""); setIntIdx(i); }} answers={answers} skipped={new Set()} color={colorTheme} />
                          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                            {/* Camera panel (DOES NOT REMOUNT ON QUESTION CHANGE) */}
                            <div className="lg:col-span-3 space-y-6">
                              <div className="aspect-video bg-transparent rounded-3xl border-2 border-zinc-100 overflow-hidden relative shadow-2xl w-full">
                                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black animate-pulse shadow-lg">
                                  <FaVideo className="text-sm" /> LIVE
                                </div>
                                <div className="absolute bottom-5 left-5 right-5">
                                  <GlowBar value={intIdx + 1} max={totalQs} color={colorTheme} label={`Q${intIdx + 1}/${totalQs}`} />
                                </div>
                              </div>

                              <div className={`p-6 rounded-3xl border ${isHR ? "bg-cyan-600/10 border-cyan-500/20" : "bg-amber-600/10 border-amber-500/20"}`}>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${isHR ? "bg-cyan-600/40 text-cyan-300" : "bg-amber-600/40 text-amber-300"}`}>
                                    {isHR ? <FaUserTie /> : <FaRobot />}
                                  </div>
                                  <div>
                                    <p className="font-black text-lg">{isHR ? "HR Officer" : "Technical Lead"}</p>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">AI Interviewer</p>
                                  </div>
                                </div>
                                <p className="text-sm text-zinc-600 italic bg-slate-50 p-4 rounded-xl">"{curQ}"</p>
                                <button onClick={() => speak(curQ)}
                                  className={`mt-4 text-xs font-bold flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isHR ? "text-cyan-400 hover:bg-cyan-500/10" : "text-amber-400 hover:bg-amber-500/10"}`}>
                                  <FaPlay className="text-[10px]" /> Replay Question
                                </button>
                              </div>

                              <button onClick={toggleRecording}
                                className={`w-full py-5 rounded-2xl border-2 font-black text-base flex items-center justify-center gap-3 transition-all ${isRecording
                                    ? "bg-red-600/20 border-red-500/60 text-red-600 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                                  }`}>
                                {isRecording ? <><FaStop className="text-xl" /> STOP RECORDING</> : <><FaMicrophone className="text-xl" /> START VOICE ANSWER</>}
                              </button>
                            </div>

                            {/* Answer panel (REMOUNTS ON QUESTION CHANGE SO ANIMATION PLAYS) */}
                            <div className="lg:col-span-4 flex flex-col">
                              <AnimatePresence mode="wait">
                                <motion.div key={`int-${activeStage}-${intIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col space-y-6">
                                  <div className={`p-8 rounded-3xl border-l-4 bg-white/90 border border-zinc-100 shadow-lg ${isHR ? "border-l-cyan-500" : "border-l-amber-500"}`}>
                                    <div className="flex items-center justify-between mb-5">
                                      <span className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${isHR ? "text-cyan-300 border-cyan-500/30 bg-cyan-500/10" : "text-amber-300 border-amber-500/30 bg-amber-500/10"
                                        }`}>
                                        {isHR ? "HR Round" : "Resume Interview"}
                                      </span>
                                      <span className="text-sm text-zinc-500 font-mono font-bold">Question {intIdx + 1} of {totalQs}</span>
                                    </div>
                                    <h2 className="text-3xl font-black leading-snug">{curQ}</h2>
                                  </div>

                                  <div className="relative flex-1 flex flex-col">
                                    <textarea
                                      className="flex-1 w-full min-h-[250px] bg-white/90 border border-zinc-200 rounded-3xl p-8 text-base leading-relaxed
                                        focus:border-violet-500/60 outline-none transition-all placeholder:text-gray-600 resize-none shadow-inner"
                                      placeholder="Type your answer here, or use the voice input button to accurately dictate your answers..."
                                      maxLength={50000}
                                      value={curAns + (voiceAnswer ? (curAns ? " " : "") + voiceAnswer : "")}
                                      onChange={(e) => {
                                        setVoiceAnswer("");
                                        setAnswer(prev => ({ ...prev, [intIdx]: e.target.value }));
                                      }}
                                    />
                                    {voiceAnswer && (
                                      <div className="absolute top-4 right-8 bg-transparent/80 px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 animate-pulse border border-amber-500/30 flex items-center gap-2 shadow-lg">
                                        <FaMicrophone /> Transcribing...
                                      </div>
                                    )}
                                    <div className="absolute bottom-6 right-8 text-sm font-mono text-zinc-500 bg-zinc-50 px-3 py-1 rounded-lg">
                                      {curAns.length + voiceAnswer.length} chars
                                    </div>
                                  </div>
                                </motion.div>
                              </AnimatePresence>

                              <div className="flex gap-4 items-center border-t border-zinc-100 pt-6 mt-6 flex-wrap">
                                <NeonBtn color="ghost" size="sm" disabled={intIdx === 0} onClick={() => {
                                  if (voiceAnswer) setAnswer(prev => ({ ...prev, [intIdx]: (prev[intIdx] || "") + " " + voiceAnswer }));
                                  setVoiceAnswer(""); setIntIdx(p => Math.max(0, p - 1));
                                }}>
                                  <FaArrowLeft /> Prev
                                </NeonBtn>
                                <NeonBtn color="green" size="sm" onClick={() => {
                                  if (voiceAnswer) setAnswer(prev => ({ ...prev, [intIdx]: (prev[intIdx] || "") + " " + voiceAnswer }));
                                  setVoiceAnswer("");
                                  showToast.success("Answer Submitted successfully!");
                                  if (intIdx < totalQs - 1) {
                                    setTimeout(() => { setIntIdx(p => p + 1); speak(questions[intIdx + 1]); }, 500);
                                  }
                                }}>
                                  <FaCheckCircle /> Submit Answer
                                </NeonBtn>
                                <NeonBtn color="cyan" size="sm" disabled={intIdx >= totalQs - 1}
                                  onClick={() => {
                                    if (voiceAnswer) setAnswer(prev => ({ ...prev, [intIdx]: (prev[intIdx] || "") + " " + voiceAnswer }));
                                    setVoiceAnswer(""); setIntIdx(p => p + 1); speak(questions[intIdx + 1]);
                                  }}>
                                  Next Question <FaArrowRight />
                                </NeonBtn>
                                <NeonBtn color={colorTheme} size="sm" disabled={Object.keys(answers).length === 0}
                                  onClick={() => {
                                    if (voiceAnswer) setAnswer(prev => ({ ...prev, [intIdx]: (prev[intIdx] || "") + " " + voiceAnswer }));
                                    setVoiceAnswer("");
                                    if (isHR) submitHR(); else submitResume();
                                  }} className="animate-pulse shadow-xl border-2 ml-auto">
                                  Submit Round <FaCheckCircle />
                                </NeonBtn>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ FINAL RESULT ═══════════════════════════════════════════════════ */}
          {screen === "result" && finalReport && (
            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="py-10">
              {/* Hero */}
              <div className={`relative overflow-hidden rounded-[3rem] p-12 mb-8 border text-center ${finalReport.isShortlisted
                  ? "bg-gradient-to-b from-cyan-900/15 to-transparent border-cyan-500/20"
                  : "bg-gradient-to-b from-red-900/15 to-transparent border-red-500/20"
                }`}>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                {finalReport.isShortlisted
                  ? <FaTrophy className="text-[100px] text-amber-400 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(250,204,21,0.5)]" />
                  : <FaExclamationTriangle className="text-[100px] text-red-400 mx-auto mb-6" />
                }
                <h1 className="text-8xl font-black tracking-tighter mb-4 italic"
                  style={finalReport.isShortlisted
                    ? { background: "linear-gradient(135deg, #34d399, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                    : {}
                  }>
                  {finalReport.isShortlisted ? "SHORTLISTED!" : "NOT SHORTLISTED"}
                </h1>
                <div className="text-left bg-slate-50 border border-zinc-100 rounded-2xl p-6 max-w-4xl mx-auto mb-8 shadow-inner">
                  {Array.isArray(finalReport.hiringDossier) ? finalReport.hiringDossier.map((d, i) => (
                    <div key={i} className="flex gap-4 mb-3 last:mb-0">
                      <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                      <p className="text-zinc-600 text-lg leading-relaxed">{d}</p>
                    </div>
                  )) : (
                    <p className="text-zinc-600 text-lg leading-relaxed text-center">{finalReport.hiringDossier}</p>
                  )}
                </div>
                <div className="inline-flex items-center justify-center gap-3 text-6xl font-black bg-white/90 px-10 py-5 rounded-3xl border border-zinc-100 shadow-xl">
                  {finalReport.finalScore}<span className="text-3xl text-zinc-500">/ 100</span>
                </div>
              </div>

              {/* Score grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: "Aptitude", score: roundResults.aptitude?.score, color: "teal", icon: "🧠" },
                  { label: "Tech MCQ", score: roundResults.techMCQ?.score, color: "cyan", icon: "💻" },
                  { label: "Resume", score: roundResults.resume?.score, color: "yellow", icon: "📋" },
                  { label: "HR Round", score: roundResults.hr?.score, color: "emerald", icon: "🎤" },
                ].filter(s => s.score !== undefined).map(s => (
                  <ScoreCard key={s.label} {...s} />
                ))}
              </div>

              {/* Additional AI Metrics */}
              {finalReport.communicationLevel && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white/90 border border-violet-500/10 rounded-[2rem] p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-violet-500/5 group-hover:bg-violet-500/10 transition-colors" />
                    <p className="text-sm font-mono text-violet-300 uppercase tracking-widest mb-1 relative z-10 text-center">Communication</p>
                    <p className="text-3xl font-black text-zinc-800 relative z-10 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] text-center mb-4">{finalReport.communicationLevel}</p>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 relative z-10">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${String(finalReport.communicationLevel).toLowerCase().includes('excellent') ? 100 : String(finalReport.communicationLevel).toLowerCase().includes('good') ? 75 : String(finalReport.communicationLevel).toLowerCase().includes('average') ? 50 : 25}%` }} transition={{ duration: 1 }} className="h-full bg-violet-500 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-white/90 border border-cyan-500/10 rounded-[2rem] p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                    <p className="text-sm font-mono text-cyan-300 uppercase tracking-widest mb-1 relative z-10 text-center">Confidence</p>
                    <p className="text-3xl font-black text-zinc-800 relative z-10 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)] text-center mb-4">{finalReport.confidenceLevel}</p>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 relative z-10">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${String(finalReport.confidenceLevel).toLowerCase().includes('high') ? 100 : String(finalReport.confidenceLevel).toLowerCase().includes('medium') ? 60 : 30}%` }} transition={{ duration: 1 }} className="h-full bg-cyan-500 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-white/90 border border-cyan-500/10 rounded-[2rem] p-6 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                    <p className="text-sm font-mono text-cyan-300 uppercase tracking-widest mb-1 relative z-10 text-center">Correctness</p>
                    <p className="text-3xl font-black text-zinc-800 relative z-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] text-center mb-4">{finalReport.correctnessScore ?? "N/A"}{finalReport.correctnessScore ? "%" : ""}</p>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 relative z-10">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${finalReport.correctnessScore || 0}%` }} transition={{ duration: 1 }} className="h-full bg-cyan-500 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10 items-stretch">
                <div className="bg-white/90 border border-zinc-100 rounded-[2.5rem] p-10 flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-violet-600/20 rounded-xl text-violet-400 text-2xl"><FaBriefcase /></div>
                    <h3 className="font-black text-2xl">Job Recommendations</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    {finalReport.suggestedRoles?.length > 0 ? finalReport.suggestedRoles.map((role, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 hover:border-violet-500/40 transition-all shadow-lg">
                        <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center text-sm font-black text-violet-400 flex-shrink-0">{i + 1}</div>
                        <div className="flex-1"><p className="font-bold text-lg text-zinc-800">{role}</p></div>
                        <FaStar className="text-amber-400 text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] flex-shrink-0" />
                      </div>
                    )) : <p className="text-zinc-500 italic">No specific roles recommended at this time.</p>}
                  </div>
                </div>

                <div className="bg-white/90 border border-zinc-100 rounded-[2.5rem] p-10 flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-cyan-600/20 rounded-xl text-cyan-400 text-2xl"><FaChartBar /></div>
                    <h3 className="font-black text-2xl">Skills to Improve</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    {finalReport.skillsToImprove?.length > 0 ? finalReport.skillsToImprove.map((skill, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.6)] flex-shrink-0" />
                        <p className="text-base text-zinc-700">{skill}</p>
                      </div>
                    )) : <p className="text-zinc-500 italic">You're doing great! No specific skills flagged for improvement.</p>}
                  </div>
                </div>
              </div>

              {/* Round summaries */}
              <div className="bg-white/90 border border-zinc-100 rounded-[2.5rem] p-10 mb-10">
                <h3 className="font-black text-2xl mb-8 flex items-center gap-3"><span className="text-3xl">📝</span> Round Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(roundResults).map(([round, result]) => (
                    <div key={round} className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-black text-lg uppercase tracking-widest text-zinc-700">{round}</p>
                        <span className={`text-sm font-black px-4 py-1.5 rounded-full ${result.status === "Qualified"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-red-500/20 text-red-600 border border-red-200"
                          }`}>{result.score}%</span>
                      </div>
                      {result.feedback?.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {result.feedback.map((f, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-violet-400 mt-1">▸</span>
                              <p className="text-sm text-zinc-600 leading-relaxed">{f}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center flex-wrap">
                <NeonBtn color="purple" size="lg" disabled={isPdfGenerating}
                  onClick={async () => {
                    setIsPdfGenerating(true);
                    showToast.info("Generating PDF report…");
                    try {
                      await generatePDFReport({ interviewData, finalReport, roundResults });
                      showToast.success("PDF report downloaded successfully!");
                    } catch (err) {
                      console.error("PDF generation failed:", err);
                      showToast.error("PDF generation failed. Please try again.");
                    } finally { setIsPdfGenerating(false); }
                  }}
                  className="flex items-center gap-3 shadow-xl">
                  {isPdfGenerating ? <><FaSpinner className="animate-spin" /> Generating PDF…</> : <><FaFileDownload /> Download PDF Report</>}
                </NeonBtn>
                <NeonBtn color="cyan" size="lg" onClick={() => setShowShareModal(true)} className="flex items-center gap-3">
                  <FaShareAlt /> Share Results
                </NeonBtn>
                <NeonBtn color="ghost" size="lg" onClick={resetInterview} className="flex items-center gap-3">
                  Start New Interview
                </NeonBtn>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewApp;


// ─────────────────────────────────────────────────────────────────────────────
// BACKEND CONTROLLER (interviewController.js) — unchanged logic, updated prompt
// to also generate tech_mcq for MCA students
// ─────────────────────────────────────────────────────────────────────────────

/*
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");

// 1. START INTERVIEW
exports.startInterview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded. Please upload a PDF." });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.trim().substring(0, 5000);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json", candidateCount: 1 }
    });

    const prompt = `
      You are an expert AI Recruitment Officer. Analyze this resume and generate a complete interview dataset.

      TASK:
      1. Field Identification: Decide if the candidate is "MCA" (Technical) or "MBA" (Management).
      2. Aptitude (45 Qs): Generate 15 Numerical, 15 Verbal, and 15 Reasoning MCQs.
      3. Tech MCQ (MCA ONLY - 20 Qs): Auto-detect languages/frameworks from resume (Java, Python, SQL, React, etc.)
         and generate 20 MCQs testing technical knowledge in those specific areas. Skip this for MBA.
      4. Interview Rounds:
         - 20 Resume-based technical questions about their own projects, education, and experience.
         - 20 HR/Behavioral situational questions.

      STRICT JSON OUTPUT FORMAT:
      {
        "field": "MCA" | "MBA",
        "detectedLanguages": "Java, Python, SQL" (MCA only - comma separated),
        "aptitude": [
          { "id": 1, "section": "Numerical", "question": "...", "options": ["A","B","C","D"], "correct": "A" }
        ],
        "tech_mcq": [   <-- INCLUDE ONLY IF field === "MCA"
          {
            "id": 1,
            "language": "Python",
            "difficulty": "Medium",
            "question": "...",
            "code": null,  (or a code snippet string if needed)
            "options": ["A","B","C","D"],
            "correct": "B"
          }
        ],
        "technical_questions": ["Q1 about your project...", "Q2 about your education...", ...],
        "hr_questions": ["Tell me about yourself...", "Describe a challenge...", ...]
      }

      RESUME CONTENT:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const responseData = JSON.parse(result.response.text());
    res.status(200).json(responseData);

  } catch (error) {
    console.error("Start Interview Error:", error);
    res.status(500).json({ error: "Internal Server Error: Failed to generate interview profile." });
  }
};

// 2. ANALYZE ROUND (unchanged)
exports.analyzeRound = async (req, res) => {
  try {
    const { roundName, questions, answers, field } = req.body;
    if (!roundName || !questions || !answers) {
      return res.status(400).json({ error: "Missing required data for analysis." });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = `
      Analyze the ${roundName} performance for an ${field} student.
      Questions: ${JSON.stringify(questions)}
      User Answers: ${JSON.stringify(answers)}
      Evaluate based on accuracy (for MCQs) and depth/logic/confidence (for Technical/HR).
      Return ONLY this JSON:
      { "score": number(0-100), "status": "Qualified"|"Not Qualified", "feedback": ["point1","point2"], "summary": "Short paragraph" }
    `;
    const result = await model.generateContent(prompt);
    res.status(200).json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze the interview round." });
  }
};

// 3. FINALIZE INTERVIEW (unchanged)
exports.finalizeInterview = async (req, res) => {
  try {
    const { allRoundResults, field } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = `
      Provide a final recruitment decision for this ${field} candidate.
      Previous Round Stats: ${JSON.stringify(allRoundResults)}
      Return ONLY JSON:
      {
        "finalScore": number,
        "isShortlisted": boolean,
        "suggestedRoles": ["Role A","Role B","Role C"],
        "hiringDossier": "A detailed executive summary for the hiring manager.",
        "skillsToImprove": ["Skill 1","Skill 2"]
      }
    `;
    const result = await model.generateContent(prompt);
    res.status(200).json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Finalize Error:", error);
    res.status(500).json({ error: "Final report generation failed." });
  }
};
*/