import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Briefcase, GraduationCap, Code2, Sparkles, ChevronRight, ChevronLeft,
  Save, CheckCircle2, Plus, Trash2, LayoutTemplate, Eye, X, FileText, Award, Wand2, Loader2, Star, Download, Share2, Edit3, Type, Layers, UploadCloud, GripVertical, Palette
} from "lucide-react";
import axios from "axios";
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
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
const toastOptions = { position: "top-right", autoClose: 3000, style: neonToastStyle };
const showToast = {
  success: (msg) => toast.success(msg, { ...toastOptions, icon: "✅", progressStyle: { background: "linear-gradient(90deg, #a78bfa, #f472b6)" } }),
  error: (msg) => toast.error(msg, { ...toastOptions, icon: "❌", style: { ...neonToastStyle, color: "#f87171", border: "1px solid rgba(248,113,113,0.4)" }, progressStyle: { background: "linear-gradient(90deg, #f87171, #fb923c)" } }),
  info: (msg) => toast.info(msg, { ...toastOptions, icon: "🔥", progressStyle: { background: "linear-gradient(90deg, #38bdf8, #818cf8)" } })
};

// ============================================================
// 🎨 ANIMATED BACKGROUND
// ============================================================
const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 25%, #f8fafc 50%, #ffffff 75%, #f8fafc 100%)"}}>
    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[65vw] h-[65vw] rounded-full -top-1/4 -left-1/4" 
      style={{ background: "radial-gradient(circle, #bae6fd 0%, transparent 70%)", filter: "blur(140px)", opacity: 0.4 }} />
    <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0], y: [0, -80, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[55vw] h-[55vw] rounded-full top-1/4 right-[-10%]" 
      style={{ background: "radial-gradient(circle, #e0e7ff 0%, transparent 70%)", filter: "blur(130px)", opacity: 0.35 }} />
    <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 60, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[70vw] h-[70vw] rounded-full -bottom-1/3 -right-1/4" 
      style={{ background: "radial-gradient(circle, #f3e8ff 0%, transparent 70%)", filter: "blur(160px)", opacity: 0.3 }} />
    <div className="absolute inset-0 opacity-[0.05]"
      style={{ backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
  </div>
);

// ============================================================
// 🧠 MOCK AI SKILL DATABASE FOR AUTOCOMPLETE
// ============================================================
const SKILL_DATABASE = [
  "R", "R Programming", "RDBMS", "React", "React Native", "Ruby", "Ruby on Rails", "Rust", "Redux", 
  "Python", "PostgreSQL", "PHP", "Node.js", "Next.js", "NoSQL", "NestJS", "Java", "JavaScript", 
  "TypeScript", "C", "C++", "C#", "Go", "Swift", "Kotlin", "Dart", "Flutter", "Angular", "Vue.js", 
  "Svelte", "HTML5", "CSS3", "Tailwind CSS", "Sass", "Docker", "Kubernetes", "AWS", "Azure", "GCP", 
  "CI/CD Pipelines", "DevOps", "Git", "GitHub", "MongoDB", "MySQL", "Redis", "GraphQL", "REST APIs",
  "Machine Learning", "AI/ML", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Canva", "Figma", "UI/UX"
];

// ============================================================
// 🧩 UI COMPONENTS
// ============================================================
const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4 w-full">
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all shadow-inner"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4 w-full">
    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 outline-none resize-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all shadow-inner custom-scrollbar"
    />
  </div>
);

const NeonTag = ({ label, onRemove }) => (
  <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wide">
    {label}
    <button onClick={onRemove} className="hover:text-cyan-200 hover:bg-cyan-500/20 rounded-full p-0.5 transition-colors">
      <X size={12} />
    </button>
  </motion.span>
);

// ============================================================
// 🚀 MAIN BUILDER COMPONENT
// ============================================================
const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Dashboard
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [savedResumes, setSavedResumes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  // PDF Gen reference
  const previewRef = useRef(null);

  // Autocomplete State
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Default Template Empty State
  const initialData = {
    templateType: "modern",
    personal: { name: "", title: "", email: "", phone: "", location: "", github: "", linkedin: "" },
    summary: "",
    experience: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: []
  };

  const [data, setData] = useState(initialData);
  const TOTAL_STEPS = 7;

  const steps = [
    { id: 1, title: "Identity", icon: User },
    { id: 2, title: "Summary", icon: FileText },
    { id: 3, title: "Experience", icon: Briefcase },
    { id: 4, title: "Projects", icon: Code2 },
    { id: 5, title: "Education", icon: GraduationCap },
    { id: 6, title: "Skills", icon: Sparkles },
    { id: 7, title: "Finish", icon: Award },
  ];

  // ============================================================
  // DASHBOARD FETCHING & CRUD
  // ============================================================
  const fetchResumes = async () => {
    setIsLoadingDashboard(true);
    let token = localStorage.getItem('token');
    try { token = token || JSON.parse(localStorage.getItem('userInfo')).token; } catch(e) {}
    try {
      const res = await axios.get("/api/builder", { headers: { Authorization: `Bearer ${token}` } });
      setSavedResumes(res.data.data);
    } catch (err) {
      console.error(err);
      showToast.error("Failed to sync your saved resumes.");
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (currentStep === 0) fetchResumes();
  }, [currentStep]);

  useEffect(() => {
    if (currentStep > 0 && data.personal.name && data.personal.title && data.personal.email) {
      const timer = setTimeout(() => {
        handleSaveToCloud(true);
      }, 5000); // 5 sec auto save debounce
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleCreateNew = () => {
    setShowTemplateSelector(true);
  };

  const handleStartWithTemplate = (type) => {
    setEditingId(null);
    setShowTemplateSelector(false);
    setData({
      templateType: type,
      themeColor: '#bae6fd',
      personal: { photo: "", name: "", title: "", email: "", phone: "", location: "", github: "", linkedin: "" },
      summary: "",
      experience: [{ id: 1, role: "", company: "", date: "", desc: "" }],
      projects: [{ id: 1, name: "", year: "", desc: "" }],
      education: [{ id: 1, degree: "", school: "", year: "", score: "" }],
      skills: [],
      certifications: [],
      achievements: []
    });
    setCurrentStep(1);
  };

  const handleEditResume = (resumeObj) => {
    setEditingId(resumeObj._id);
    setData({
      templateType: resumeObj.templateType || 'modern',
      personal: resumeObj.personal || initialData.personal,
      summary: resumeObj.summary || "",
      experience: resumeObj.experience || [],
      projects: resumeObj.projects || [],
      education: resumeObj.education || [],
      skills: resumeObj.skills || [],
      certifications: resumeObj.certifications || [],
      achievements: resumeObj.achievements || []
    });
    setCurrentStep(1);
  };

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Permanently delete this resume format?")) return;
    let token = localStorage.getItem('token');
    try { token = token || JSON.parse(localStorage.getItem('userInfo')).token; } catch(err) {}
    try {
      await axios.delete(`/api/builder/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast.success("Resume deleted permanently.");
      setSavedResumes(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      showToast.error("Delete failed.");
    }
  };

  // --- Core Helpers ---
  const handleDragStart = (e, index) => { setDraggedItem(index); e.dataTransfer.effectAllowed = 'move'; };
  const handleDrop = (e, index, key) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const items = [...data[key]];
    const dragged = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, dragged);
    setData(prev => ({ ...prev, [key]: items }));
    setDraggedItem(null);
  };
  const handleDragOver = (e) => e.preventDefault();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2*1024*1024) { showToast.error('Photo must be < 2MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => updatePersonal('photo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updatePersonal = (field, val) => setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: val } }));
  const addArrayItem = (key, defaultObj) => setData(prev => ({ ...prev, [key]: [...prev[key], { id: Date.now(), ...defaultObj }] }));
  const updateArrayItem = (key, id, field, val) => setData(prev => ({ ...prev, [key]: prev[key].map(item => item.id === id ? { ...item, [field]: val } : item) }));
  const removeArrayItem = (key, id) => setData(prev => ({ ...prev, [key]: prev[key].filter(item => item.id !== id) }));

  // --- Simulated AI Summary ---
  const handleAIGenerateSummary = async () => {
    if (!data.summary && data.skills.length === 0 && !data.personal.title) {
        showToast.error('Please enter a role or some skills first!');
        return;
    }
    setIsGeneratingAI(true);
    let token = localStorage.getItem('token');
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        token = token || userInfo.token;
    } catch(e) {}
    try {
        const res = await axios.post('/api/resume/ai-suggest', {
            section: 'summary',
            currentText: data.summary,
            role: data.personal.title,
            skills: data.skills
        }, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data && res.data.success) {
            setData(prev => ({ ...prev, summary: res.data.text }));
            showToast.success('AI Enhanced Summary!');
        }
    } catch (err) {
        console.error(err);
        showToast.error('AI Generation Failed.');
    } finally {
        setIsGeneratingAI(false);
    }
  };

  // --- Autocomplete ---
  const handleSkillInputChange = (e) => {
    const val = e.target.value;
    setSkillInput(val);
    if (val.trim().length > 0) {
      const filtered = SKILL_DATABASE.filter(s => s.toLowerCase().includes(val.toLowerCase()) && !data.skills.includes(s));
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else setShowSuggestions(false);
  };

  const handleAddSkill = (skill) => {
    if (skill.trim() && !data.skills.includes(skill.trim())) {
      setData(prev => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) handleAddSkill(suggestions[0]);
      else handleAddSkill(skillInput);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SAVE & EXPORT CORE ---
  const handleSaveToCloud = async (isAutoSave = false) => {
    const { personal } = data;
    if (!personal.name?.trim() || !personal.title?.trim() || !personal.email?.trim()) {
      if (!isAutoSave) showToast.error("Name, Role Title, and Email are required to save.");
      if (!isAutoSave) setCurrentStep(1); 
      return false;
    }
    
    if (!isAutoSave) setIsSaving(true);
    let token = localStorage.getItem('token');
    try { token = token || JSON.parse(localStorage.getItem('userInfo')).token; } catch(e) {}
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      if (editingId) res = await axios.put(`/api/builder/${editingId}`, data, { headers });
      else res = await axios.post("/api/builder/save", data, { headers });
      
      if (res.data.success) {
        if (!isAutoSave) showToast.success("Resume Sync Complete!");
        if (!editingId) setEditingId(res.data.data._id); // So further saves act as puts
        return true;
      }
    } catch (err) {
      showToast.error("Cloud synchronization failed.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = async () => {
    if (!previewRef.current) return;
    
    // Auto-save first
    const saved = await handleSaveToCloud();
    if (!saved) return; // Validation failed
    
    showToast.info("Rendering High-Fidelity PDF...");
    try {
      // 1. Temporarily increase scale for ultra-sharp rendering
      const domElement = previewRef.current;
      const originalTransform = domElement.style.transform;
      // Convert to canvas
      const dataUrl = await toPng(domElement, { 
        quality: 1, 
        pixelRatio: 3, // Retina quality
        style: { transform: 'scale(1)', margin: 0 }
      });
      domElement.style.transform = originalTransform;

      // 2. Create PDF
      const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (domElement.offsetHeight * pdfWidth) / domElement.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personal.name || 'Professional'}_Resume.pdf`);
      showToast.success("PDF Downloaded!");
    } catch (error) {
      console.error(error);
      showToast.error("PDF engine failure.");
    }
  };

  const handleShare = async () => {
    const saved = await handleSaveToCloud();
    if (!saved) return;
    
    const shareData = {
      title: `${data.personal.name}'s Interactive Resume`,
      text: `Check out my verified AI-Generated professional resume created via TalentMatch!`,
      url: window.location.href, // If you implement public routes later, put it here
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast.success("Share module opened!");
      } else {
        await navigator.clipboard.writeText(`Hi! I'm ${data.personal.name}, a ${data.personal.title}. Connect with me!`);
        showToast.success("Summary copied to clipboard!");
      }
    } catch (err) {
      console.log('Share canceled');
    }
  };

  // ============================================================
  // RENDER HELPERS
  // ============================================================
  
  const getTemplateStyles = () => {
    if (data.templateType === 'classic') return { font: 'font-serif', bg: 'bg-white', text: 'text-zinc-900', border: 'border-zinc-300', headerBg: 'bg-zinc-100', accent: 'text-zinc-800' };
    if (data.templateType === 'neon') return { font: 'font-sans', bg: 'bg-white', text: 'text-zinc-700', border: 'border-zinc-200', headerBg: 'bg-transparent', accent: 'text-cyan-400' };
    if (data.templateType === 'canva') return { font: 'font-sans', bg: 'bg-zinc-900', text: 'text-zinc-100', border: 'border-transparent', headerBg: 'bg-zinc-800', accent: 'text-cyan-400' };
    if (data.templateType === 'executive') return { font: 'font-sans', bg: 'bg-white', text: 'text-zinc-800', border: 'border-zinc-200', headerBg: 'bg-transparent', accent: 'text-[#7B5AA6]' };
    // Modern default
    return { font: 'font-sans', bg: 'bg-white', text: 'text-zinc-800', border: 'border-zinc-200', headerBg: 'bg-white', accent: 'text-purple-600' };
  };

  const tStyles = getTemplateStyles();

  return (
    <div className="min-h-screen bg-transparent text-zinc-800 font-sans relative selection:bg-purple-500/30" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeButton={true} toastStyle={neonToastStyle} style={{ zIndex: 99999 }} />
      <AnimatedBackground />

      {/* ============================================================ */}
      {/* STEP 0: DASHBOARD VIEW */}
      {/* ============================================================ */}
      {currentStep === 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 min-h-screen flex flex-col">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tighter mb-2 flex items-center gap-3">
                RESUME <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">DASHBOARD</span>
              </h1>
              <p className="text-zinc-500 text-lg">Manage your custom AI-generated resumes and ATS-optimized profiles.</p>
            </div>
            <button onClick={handleCreateNew} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-zinc-800 font-black hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all">
              <Plus size={20} /> BUILD NEW RESUME
            </button>
          </div>

          {isLoadingDashboard ? (
            <div className="flex-1 flex justify-center items-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Card */}
              <div onClick={handleCreateNew} className="h-64 border-2 border-dashed border-zinc-300 rounded-3xl bg-white hover:bg-zinc-50 flex flex-col justify-center items-center cursor-pointer transition-all hover:border-purple-500/50 group">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-4">
                  <LayoutTemplate size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-700">Start from Scratch</h3>
                <p className="text-sm text-zinc-500 mt-2">Pick a template to drop into.</p>
              </div>

              {/* Template Selection Modal */}
              <AnimatePresence>
                {showTemplateSelector && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-transparent/80 backdrop-blur-xl flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white border border-zinc-200 rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative">
                      <button onClick={() => setShowTemplateSelector(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-800"><X size={24} /></button>
                      <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><LayoutTemplate className="text-purple-500" /> SELECT TEMPLATE</h2>
                      <p className="text-zinc-500 mb-8">Choose a starting professional layout layout. You can change this later.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          { id: 'modern', name: 'Modern Fast', color: 'bg-purple-500', desc: 'Clean, ATS friendly, highly balanced.' },
                          { id: 'neon', name: 'Neon Hacker', color: 'bg-cyan-500', desc: 'Dark theme, developer focused.' },
                          { id: 'classic', name: 'Classic Exec', color: 'bg-zinc-300', desc: 'Traditional serif, highly professional.' },
                          { id: 'canva', name: 'Creative Canva', color: 'bg-cyan-500', desc: 'Sidebar layout, high design.' },
                          { id: 'executive', name: 'Executive Pro', color: 'bg-[#7B5AA6]', desc: 'Two-column purple themed professional layout.' }
                        ].map(t => (
                          <div key={t.id} onClick={() => handleStartWithTemplate(t.id)} className="group cursor-pointer">
                            <div className="h-48 rounded-2xl border border-zinc-200 bg-transparent overflow-hidden relative mb-4 group-hover:border-zinc-200 transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                              <div className={`absolute top-0 left-0 w-full h-8 ${t.color}/20 flex items-center px-4`}><div className={`w-3 h-3 rounded-full ${t.color}`} /></div>
                              <div className="pt-12 px-4 space-y-2">
                                <div className="h-4 w-3/4 bg-zinc-100 rounded-sm" />
                                <div className="h-2 w-1/2 bg-zinc-50 rounded-sm" />
                                <div className="h-2 w-full bg-zinc-50 rounded-sm mt-4" />
                                <div className="h-2 w-full bg-zinc-50 rounded-sm" />
                                <div className="h-2 w-4/5 bg-zinc-50 rounded-sm" />
                              </div>
                            </div>
                            <h3 className="font-bold text-zinc-800 text-lg">{t.name}</h3>
                            <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Saved Resumes */}
              {savedResumes.map(r => (
                <div key={r._id} onClick={() => handleEditResume(r)} className="h-64 bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-3xl p-6 relative group overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/20 to-transparent blur-3xl rounded-full" />
                  
                  <div className="flex justify-between items-start mb-6 align-top">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                      <Briefcase size={20} />
                    </div>
                    <button onClick={(e) => handleDeleteResume(r._id, e)} className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors z-20">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-zinc-800 truncate">{r.personal?.name || "Untitled Resume"}</h3>
                  <p className="text-cyan-400 text-sm font-semibold mb-4 truncate">{r.personal?.title || "No Role Specified"}</p>
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-xs text-zinc-500">
                    <div className="flex items-center gap-1"><Layers size={14} /> Theme: <span className="capitalize text-zinc-700">{r.templateType || 'modern'}</span></div>
                    <div className="flex items-center gap-1"><Edit3 size={14} /> Edit</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* STEPS 1-7: THE BUILDER UI */}
      {/* ============================================================ */}
      {currentStep > 0 && (
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10 py-8 flex flex-col lg:flex-row gap-8 h-screen">
          
          {/* LEFT PANE: WIZARD FORM */}
          <div className="flex-1 flex flex-col h-full bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-[2.5rem] shadow-xl shadow-purple-500/10 overflow-hidden">
            
            {/* Header & Stepper */}
            <div className="p-6 border-b border-zinc-200 bg-slate-50 shrink-0 relative flex flex-col">
              <div className="flex justify-between items-center mb-6 w-full">
                <div className="flex-1 flex justify-start">
                  <button onClick={() => setCurrentStep(0)} className="text-zinc-500 hover:text-zinc-800 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 shrink-0">
                    <ChevronLeft size={14} /> Back to Dashboard
                  </button>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="hidden sm:flex items-center gap-2 bg-zinc-50 rounded-xl p-1 border border-zinc-200 overflow-x-auto shrink-0">
                    {['classic', 'modern', 'neon', 'canva', 'executive'].map(theme => (
                      <button key={theme} onClick={() => setData(p => ({...p, templateType: theme}))} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${data.templateType === theme ? 'bg-purple-500 text-zinc-800' : 'text-zinc-500 hover:text-zinc-700'}`}>
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex justify-end gap-2 z-20">
                  <button onClick={handleSaveToCloud} disabled={isSaving} className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold hover:bg-green-500 hover:text-zinc-800 transition-colors uppercase tracking-widest">
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save Draft
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between relative px-2 mt-2">
                <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-zinc-50 -z-10" />
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isPassed = step.id < currentStep;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                      <motion.div 
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isActive ? "bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-zinc-800" : 
                          isPassed ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-transparent text-zinc-600 border border-zinc-200"
                        }`}
                        onClick={() => isPassed && setCurrentStep(step.id)}
                      >
                        {isPassed ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                      </motion.div>
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider hidden sm:block pointer-events-none ${isActive ? "text-purple-300" : "text-zinc-600"}`}>{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="h-full">
                  
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">Personal Intelligence</h2>
                      
                      {/* Photo Upload and Theme Color Block */}
                      <div className="flex gap-6 items-center mb-6 bg-white p-4 border border-zinc-100 rounded-2xl">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Profile Photo</label>
                            <label className="cursor-pointer flex items-center justify-center w-16 h-16 rounded-full border border-dashed border-zinc-300 hover:border-purple-400 bg-zinc-50 overflow-hidden transition-all group">
                                {data.personal.photo ? (
                                    <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <UploadCloud size={20} className="text-zinc-500 group-hover:text-purple-400" />
                                )}
                                <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Theme Color</label>
                            <div className="flex gap-3">
                                {['#bae6fd', '#bae6fd', '#eab308', '#ef4444', '#e0e7ff'].map(c => (
                                    <button key={c} onClick={() => setData(prev => ({...prev, themeColor: c}))} className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110" style={{ background: c, borderColor: data.themeColor === c ? 'white' : 'transparent' }} />
                                ))}
                            </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" value={data.personal.name} onChange={e => updatePersonal('name', e.target.value)} placeholder="e.g. Sam Altman" />
                        <InputField label="Target Role" value={data.personal.title} onChange={e => updatePersonal('title', e.target.value)} placeholder="e.g. Principal Lead Engineer" />
                        <InputField label="Email Address" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} type="email" placeholder="sam@openai.com" />
                        <InputField label="Phone Number" value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+1 (415) 555-0000" />
                        <InputField label="GitHub URL" value={data.personal.github} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/samAlt" />
                        <InputField label="LinkedIn URL" value={data.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/samaltman" />
                        <InputField label="Current Location" value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="San Francisco, CA" />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 h-full flex flex-col">
                      <div className="flex justify-between items-end mb-4 border-b border-zinc-200 pb-2">
                        <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest">Executive Summary</h2>
                        <button onClick={handleAIGenerateSummary} disabled={isGeneratingAI} className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 border border-purple-500/30 bg-purple-500/10 px-4 py-2 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/60 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                          {isGeneratingAI ? <Loader2 size={14} className="animate-spin text-purple-400" /> : <Wand2 size={14} className="text-purple-400" />}
                          {isGeneratingAI ? "GENERATING..." : "AI AUTO-WRITE"}
                        </button>
                      </div>
                      <div className="relative flex-1">
                        {isGeneratingAI && (
                          <div className="absolute inset-0 z-10 bg-zinc-50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-500/30"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles className="text-purple-400 w-8 h-8" /></motion.div></div>
                        )}
                        <textarea value={data.summary} onChange={e => setData(prev => ({...prev, summary: e.target.value}))} placeholder="Over 8+ years of experience architecting highly scalable microservices... Proven track record migrating legacy monoliths to AWS resulting in 40% cost reductions..." className="w-full h-48 bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-800 outline-none resize-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all shadow-inner custom-scrollbar leading-relaxed" />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-2">
                        <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest">Work History</h2>
                        <button onClick={() => addArrayItem('experience', { role: "", company: "", date: "", desc: "" })} className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 flex items-center gap-1"><Plus size={14} /> ADD ROLE</button>
                      </div>
                      {data.experience.map((exp, index) => (
                        <div key={exp.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index, 'experience')} className="p-5 bg-white border border-zinc-100 rounded-2xl relative group mb-4 hover:border-purple-500/30 transition-all cursor-move">
                          <button onClick={() => removeArrayItem('experience', exp.id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                          <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"><GripVertical size={16} className="text-zinc-600" /></div>
                          <div className="grid grid-cols-2 gap-4">
                            <InputField label="Job Title" value={exp.role} onChange={e => updateArrayItem('experience', exp.id, 'role', e.target.value)} placeholder="Senior Full-Stack Engineer" />
                            <InputField label="Company" value={exp.company} onChange={e => updateArrayItem('experience', exp.id, 'company', e.target.value)} placeholder="Stripe Inc." />
                            <div className="col-span-2 flex gap-4">
                              <div className="w-1/3"><InputField label="Duration" value={exp.date} onChange={e => updateArrayItem('experience', exp.id, 'date', e.target.value)} placeholder="Sep 2022 - Present" /></div>
                              <div className="w-2/3"><TextAreaField label="Core Achievements" value={exp.desc} onChange={e => updateArrayItem('experience', exp.id, 'desc', e.target.value)} placeholder="- Architected Payment Processing pipeline achieving 99.999% uptime.&#10;- Mentored 5 junior engineers and scaled team velocity by 25%." rows={2} /></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-2">
                        <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest">Key Projects</h2>
                        <button onClick={() => addArrayItem('projects', { name: "", year: "", desc: "" })} className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 flex items-center gap-1"><Plus size={14} /> ADD PROJECT</button>
                      </div>
                      {data.projects.map((proj, index) => (
                        <div key={proj.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index, 'projects')} className="p-5 bg-white border border-zinc-100 rounded-2xl relative group mb-4 hover:border-cyan-500/30 transition-all cursor-move">
                          <button onClick={() => removeArrayItem('projects', proj.id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                          <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"><GripVertical size={16} className="text-zinc-600" /></div>
                          <div className="flex gap-4">
                            <div className="w-2/3"><InputField label="Project Name" value={proj.name} onChange={e => updateArrayItem('projects', proj.id, 'name', e.target.value)} placeholder="e.g. Distributed Quantum Router" /></div>
                            <div className="w-1/3"><InputField label="Year" value={proj.year} onChange={e => updateArrayItem('projects', proj.id, 'year', e.target.value)} placeholder="2025" /></div>
                          </div>
                          <TextAreaField label="Technical Details" value={proj.desc} onChange={e => updateArrayItem('projects', proj.id, 'desc', e.target.value)} placeholder="Constructed a robust GraphQL layer linking 4 distinct database silos, allowing front-end load times to decrease by 300ms. Built using Apollo, NextJS, and Redis." rows={2} />
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-2">
                        <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest">Academic History</h2>
                        <button onClick={() => addArrayItem('education', { degree: "", school: "", year: "", score: "" })} className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 flex items-center gap-1"><Plus size={14} /> ADD DEGREE</button>
                      </div>
                      {data.education.map((edu, index) => (
                        <div key={edu.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index, 'education')} className="p-5 bg-white border border-zinc-100 rounded-2xl relative group mb-4 hover:border-cyan-500/30 transition-all cursor-move">
                          <button onClick={() => removeArrayItem('education', edu.id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                          <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"><GripVertical size={16} className="text-zinc-600" /></div>
                          <InputField label="Degree Name" value={edu.degree} onChange={e => updateArrayItem('education', edu.id, 'degree', e.target.value)} placeholder="e.g. Master of Science in Artificial Intelligence" />
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1"><InputField label="Institution" value={edu.school} onChange={e => updateArrayItem('education', edu.id, 'school', e.target.value)} placeholder="Stanford University" /></div>
                            <div className="col-span-1"><InputField label="Year" value={edu.year} onChange={e => updateArrayItem('education', edu.id, 'year', e.target.value)} placeholder="2018 - 2022" /></div>
                            <div className="col-span-1"><InputField label="CGPA / %" value={edu.score} onChange={e => updateArrayItem('education', edu.id, 'score', e.target.value)} placeholder="3.9 GPA" /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">Technical Proficiency</h2>
                      <div className="mb-6 relative" ref={suggestionRef}>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Search & Add Skill</label>
                        <input
                          type="text" value={skillInput} onChange={handleSkillInputChange} onKeyDown={handleSkillKeyDown}
                          placeholder="e.g. PostgreSQL, Redis, Rust..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                        />
                        <AnimatePresence>
                          {showSuggestions && suggestions.length > 0 && (
                            <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl overflow-hidden z-50 shadow-2xl">
                              {suggestions.map((sg, idx) => (
                                <li key={idx} onClick={() => handleAddSkill(sg)} className="px-4 py-3 text-sm text-zinc-700 hover:bg-cyan-500/20 hover:text-cyan-300 cursor-pointer transition-colors border-b border-zinc-100 last:border-none flex items-center gap-2"><Code2 size={14} className="text-cyan-500 opacity-50" /> {sg}</li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex flex-wrap gap-2 p-6 bg-slate-50 border border-zinc-100 rounded-2xl min-h-[150px]">
                        <AnimatePresence>
                          {data.skills.map((skill, index) => <NeonTag key={index} label={skill} onRemove={() => setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))} />)}
                        </AnimatePresence>
                        {data.skills.length === 0 && <span className="text-zinc-600 text-sm italic">Type above to attach hard technical skills to your profile...</span>}
                      </div>
                    </div>
                  )}

                  {currentStep === 7 && (
                    <div className="h-full flex flex-col">
                      <h2 className="text-xl font-black text-zinc-800 uppercase tracking-widest mb-6 shrink-0 border-b border-zinc-200 pb-2">Final Polish: Accolades</h2>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        
                        {/* Certifications */}
                        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col">
                          <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-2">
                            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2"><Award size={16}/> Certifications</h3>
                            <button onClick={() => addArrayItem('certifications', { name: "", issuer: "", year: "" })} className="text-zinc-500 hover:text-yellow-400 p-1"><Plus size={16} /></button>
                          </div>
                          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                            {data.certifications.map((cert, index) => (
                              <div key={cert.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index, 'certifications')} className="relative group bg-white p-3 rounded-xl border border-zinc-100 cursor-move hover:border-yellow-500/30 transition-all">
                                 <button onClick={() => removeArrayItem('certifications', cert.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                 <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"><GripVertical size={14} className="text-zinc-600" /></div>
                                 <input value={cert.name} onChange={e => updateArrayItem('certifications', cert.id, 'name', e.target.value)} placeholder="e.g. CKA: Kubernetes Administrator" className="w-[90%] bg-transparent text-sm text-zinc-800 outline-none mb-1 font-semibold" />
                                 <div className="flex gap-2">
                                   <input value={cert.issuer} onChange={e => updateArrayItem('certifications', cert.id, 'issuer', e.target.value)} placeholder="Issuer (e.g. Linux Found.)" className="w-2/3 bg-transparent text-xs text-zinc-500 outline-none" />
                                   <input value={cert.year} onChange={e => updateArrayItem('certifications', cert.id, 'year', e.target.value)} placeholder="2025" className="w-1/3 bg-transparent text-xs text-zinc-500 outline-none border-l border-zinc-200 pl-2" />
                                 </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col">
                          <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-2">
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2"><Star size={16}/> Achievements</h3>
                            <button onClick={() => addArrayItem('achievements', { title: "", desc: "" })} className="text-zinc-500 hover:text-cyan-400 p-1"><Plus size={16} /></button>
                          </div>
                          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                            {data.achievements.map((achv, index) => (
                              <div key={achv.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index, 'achievements')} className="relative group bg-white p-3 rounded-xl border border-zinc-100 cursor-move hover:border-cyan-500/30 transition-all">
                                 <button onClick={() => removeArrayItem('achievements', achv.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                 <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"><GripVertical size={14} className="text-zinc-600" /></div>
                                 <input value={achv.title} onChange={e => updateArrayItem('achievements', achv.id, 'title', e.target.value)} placeholder="e.g. Top Open Source Contributor" className="w-[90%] bg-transparent text-sm text-zinc-800 outline-none mb-1 font-semibold" />
                                 <textarea value={achv.desc} onChange={e => updateArrayItem('achievements', achv.id, 'desc', e.target.value)} placeholder="Ranked top 10 globally in..." rows={2} className="w-full bg-transparent text-xs text-zinc-500 outline-none resize-none custom-scrollbar" />
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation Engine */}
            <div className="p-4 sm:p-6 border-t border-zinc-200 bg-white/90 flex flex-wrap justify-between items-center shrink-0 gap-4">
              <button onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} disabled={currentStep === 1} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-50 text-zinc-500 text-sm font-bold hover:bg-zinc-100 hover:text-zinc-800 transition-all disabled:opacity-30">
                <ChevronLeft size={16} /> BACK
              </button>
              
              {currentStep < TOTAL_STEPS ? (
                <button onClick={() => setCurrentStep(prev => Math.min(TOTAL_STEPS, prev + 1))} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-bold hover:bg-purple-500 hover:text-zinc-800 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  NEXT <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={handleSaveToCloud} disabled={isSaving} className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-green-500 transition-colors tooltip relative group">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  </button>
                  <button onClick={handleShare} className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-blue-500 transition-colors">
                    <Share2 size={16} />
                  </button>
                  <button onClick={generatePDF} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-zinc-800 text-sm font-black tracking-widest hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all">
                    <Download size={16} /> PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT PANE: LIVE PREVIEW ENGINE WITH DYNAMIC TEMPLATES */}
          {/* ============================================================ */}
          <div className="hidden lg:flex w-[45%] flex-col relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-cyan-500/10 blur-xl opacity-50 shadow-2xl rounded-[2.5rem]" />
            
            <div className={`relative h-full ${tStyles.bg} rounded-[2.5rem] p-6 shadow-2xl overflow-y-auto custom-scrollbar border-8 border-white transition-colors duration-500`}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-500/20">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2"><Eye size={12} /> Render Engine</h3>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">A4 Format</span>
              </div>

              {/* PDF Target Container */}
              <div ref={previewRef} className={`min-h-[842px] ${tStyles.bg} ${tStyles.text} ${tStyles.font} shadow-sm flex flex-col relative`}>
                
                {

                data.templateType === 'executive' ? (
                  <div className="bg-white p-[25px] flex flex-col font-sans leading-[1.3] text-[#333] w-full min-h-[842px]">
                    <div className="text-left mb-[20px]">
                      <div className="text-[28px] font-bold text-[#7B5AA6] mb-[5px]">{data.personal.name || "JOHN DOE"}</div>
                      <div className="text-[16px] text-[#666] mb-[10px]">{data.personal.title || "PROFESSIONAL TITLE"}</div>
                    </div>

                    <div className="bg-[#f8f9fa] p-[12px] border-l-[4px] border-[#7B5AA6] mb-[20px]">
                      <h3 className="text-[#7B5AA6] text-[14px] font-bold mb-[8px] uppercase">Summary</h3>
                      <div className="text-[12px] leading-[1.6]">{data.summary}</div>
                    </div>

                    <div className="flex gap-[25px]">
                      <div className="flex-[2] flex flex-col gap-[18px]">
                        
                        {data.experience.length > 0 && data.experience[0].role !== "" && (
                          <div>
                            <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Professional Experience</h2>
                            {data.experience.map(exp => (
                              <div key={exp.id} className="mb-[12px]">
                                <div className="font-bold text-[13px] text-[#333]">{exp.role}</div>
                                <div className="text-[11px] text-[#666] mb-[2px]">
                                  {exp.company} <span className="text-[11px] text-[#666] float-right text-right">{exp.date}</span>
                                </div>
                                <div className="mt-[6px] text-[11px] leading-[1.4] ml-[15px]">
                                  <p>{exp.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {data.projects.length > 0 && data.projects[0].name !== "" && (
                          <div>
                            <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Projects</h2>
                            {data.projects.map(proj => (
                              <div key={proj.id} className="mb-[8px]">
                                <div className="font-bold text-[12px] text-[#333] mb-[2px]">
                                  {proj.name} <span className="text-[11px] text-[#666] float-right text-right">{proj.year}</span>
                                </div>
                                <div className="text-[11px] leading-[1.3] pl-[12px]">
                                  <p>{proj.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {data.education.length > 0 && data.education[0].degree !== "" && (
                          <div>
                            <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Education</h2>
                            {data.education.map(edu => (
                              <div key={edu.id} className="mb-[10px]">
                                <div className="font-bold text-[12px] text-[#333]">{edu.school}</div>
                                <div className="text-[11px] text-[#666] mb-[2px]">
                                  {edu.degree} <span className="text-[11px] text-[#666] float-right text-right">{edu.year}</span>
                                </div>
                                <div className="text-[11px] text-[#666]">{edu.score}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                      </div>

                      <div className="flex-[1] flex flex-col gap-[18px]">
                        
                        {data.skills.length > 0 && (
                          <div>
                            <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Skills</h2>
                            <div className="text-[11px] leading-[1.6]">
                              <div className="flex flex-wrap gap-[4px]">
                                {data.skills.map(skill => (
                                  <span key={skill}>• {skill}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {data.achievements.length > 0 && data.achievements[0].title !== "" && (
                          <div>
                            <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Accreditation</h2>
                            {data.achievements.map(achv => (
                              <div key={achv.id} className="text-[11px] mb-[3px]">
                                • {achv.title}
                              </div>
                            ))}
                          </div>
                        )}

                        <div>
                          <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Contact</h2>
                          <div className="text-[12px] leading-[1.6]">
                            {data.personal.location && <div>• {data.personal.location}</div>}
                            {data.personal.phone && <div>• {data.personal.phone}</div>}
                            {data.personal.email && <div>• {data.personal.email}</div>}
                            {data.personal.linkedin && <div>• {data.personal.linkedin}</div>}
                            {data.personal.github && <div>• {data.personal.github}</div>}
                          </div>
                        </div>

                        {data.certifications.length > 0 && data.certifications[0].name !== "" && (
                          <div>
                            <h2 className="text-[#7B5AA6] text-[13px] font-bold uppercase mb-[8px] border-b-[2px] border-[#7B5AA6] pb-[2px]">Certifications</h2>
                            {data.certifications.map(cert => (
                              <div key={cert.id} className="text-[11px] mb-[3px]">
                                • {cert.name} {cert.year ? `(${cert.year})` : ""}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                ) : 
data.templateType === 'canva' ? (
                  <div className="flex h-full min-h-[842px] w-full items-stretch">
                    {/* Canva Sidebar */}
                    <div className="w-[35%] bg-slate-100 text-zinc-800 p-6 flex flex-col gap-6 border-r-4 border-cyan-500 shrink-0">
                      <div>
                        <h1 className="text-3xl font-black uppercase tracking-widest leading-none mb-1 break-words">{data.personal.name || "JOHN DOE"}</h1>
                        <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] mb-4">{data.personal.title || "PROFESSIONAL TITLE"}</p>
                      </div>
                      
                      <div className="space-y-3 text-[10px] font-medium pb-4 border-b border-zinc-200">
                        {data.personal.email && <div className="break-all">{data.personal.email}</div>}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {data.personal.github && <div className="break-all">GH: {data.personal.github}</div>}
                        {data.personal.linkedin && <div className="break-all">IN: {data.personal.linkedin}</div>}
                        {data.personal.location && <div>{data.personal.location}</div>}
                      </div>

                      {data.skills.length > 0 && (
                        <div>
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-cyan-400 mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                              <span key={skill} className="text-[9px] bg-zinc-100 px-2 py-1 rounded-sm font-semibold">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {data.education.length > 0 && data.education[0].degree !== "" && (
                        <div>
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-cyan-400 mb-3">Education</h3>
                          <div className="space-y-4">
                            {data.education.map(edu => (
                              <div key={edu.id}>
                                <div className="text-[10px] font-bold uppercase leading-tight">{edu.degree}</div>
                                <div className="text-[9px] opacity-70 mt-1">{edu.school} | {edu.year}</div>
                                <div className="text-[9px] text-indigo-300 font-bold mt-0.5">{edu.score}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Canva Main Area */}
                    <div className="w-[65%] bg-zinc-50 p-8 text-zinc-900 flex flex-col gap-6 pb-12 shrink-0">
                      {data.summary && (
                        <div>
                          <h3 className="text-[12px] font-black uppercase tracking-widest text-zinc-800 border-b-2 border-cyan-500 mb-3 pb-1 inline-block">Profile</h3>
                          <p className="text-[11px] leading-relaxed text-justify opacity-90 font-medium">{data.summary}</p>
                        </div>
                      )}

                      {data.experience.length > 0 && data.experience[0].role !== "" && (
                        <div>
                          <h3 className="text-[12px] font-black uppercase tracking-widest text-zinc-800 border-b-2 border-cyan-500 mb-3 pb-1 inline-block">Experience</h3>
                          <div className="space-y-5">
                            {data.experience.map(exp => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="font-bold text-[12px] uppercase text-zinc-900">{exp.role}</span>
                                  <span className="text-[10px] font-bold text-cyan-600 bg-indigo-50 px-2 py-0.5 rounded-sm">{exp.date}</span>
                                </div>
                                <div className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wide">{exp.company}</div>
                                <p className="text-[11px] leading-relaxed whitespace-pre-wrap opacity-90 font-medium">{exp.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.projects.length > 0 && data.projects[0].name !== "" && (
                        <div>
                          <h3 className="text-[12px] font-black uppercase tracking-widest text-zinc-800 border-b-2 border-cyan-500 mb-3 pb-1 inline-block">Projects</h3>
                          <div className="space-y-4">
                            {data.projects.map(proj => (
                              <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="font-bold text-[11px] uppercase text-zinc-900 tracking-wider">{proj.name}</span>
                                  <span className="text-[9px] font-bold text-zinc-500">{proj.year}</span>
                                </div>
                                <p className="text-[10px] leading-relaxed whitespace-pre-wrap opacity-90 font-medium">{proj.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 md:p-8 flex-1 flex flex-col w-full">
                    {/* Header: Name, Contact, Extras */}
                    <div className={`text-center pb-5 mb-5 border-b-[3px] ${tStyles.border}`}>
                      <h1 className="text-3xl font-black uppercase tracking-tighter block mb-1" style={{letterSpacing: '-1px'}}>{data.personal.name || "JOHN DOE"}</h1>
                      
                      {/* Line 2: Contact, Git, LinkedIn */}
                      <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-500 text-[11px] mt-2 font-sans font-medium">
                        {data.personal.email && <span>{data.personal.email}</span>}
                        {data.personal.phone && <span>• {data.personal.phone}</span>}
                        {data.personal.github && <span>• {data.personal.github}</span>}
                        {data.personal.linkedin && <span>• {data.personal.linkedin}</span>}
                      </div>

                      {/* Line 3: Title and Location */}
                      <div className="flex items-center justify-center gap-3 mt-2 text-xs">
                        <span className={`${tStyles.accent} font-bold uppercase tracking-widest`}>{data.personal.title || "PROFESSIONAL TITLE"}</span>
                        {data.personal.location && <span className="text-zinc-500">• {data.personal.location}</span>}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 space-y-6">
                      
                      {data.summary && (
                        <div>
                          <h3 className={`text-[11px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Career Profile</h3>
                          <p className="text-[11px] opacity-90 leading-relaxed text-justify px-1">{data.summary}</p>
                        </div>
                      )}

                      {data.experience.length > 0 && data.experience[0].role !== "" && (
                        <div>
                          <h3 className={`text-[11px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Experience</h3>
                          <div className="space-y-4 px-1">
                            {data.experience.map(exp => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                  <span className={`font-bold text-[12px] uppercase ${tStyles.text}`}>{exp.role}</span>
                                  <span className={`text-[10px] font-bold ${tStyles.accent}`}>{exp.date}</span>
                                </div>
                                <div className="text-[11px] font-semibold opacity-70 mb-1">{exp.company}</div>
                                <p className="text-[11px] opacity-90 leading-relaxed whitespace-pre-wrap">{exp.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.projects.length > 0 && data.projects[0].name !== "" && (
                        <div>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Key Projects</h3>
                          <div className="space-y-3 px-1">
                            {data.projects.map(proj => (
                              <div key={proj.id}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                  <span className={`font-bold text-[12px] uppercase ${tStyles.text}`}>{proj.name}</span>
                                  <span className="text-[10px] font-bold opacity-60">{proj.year}</span>
                                </div>
                                <p className="text-[11px] opacity-90 leading-relaxed whitespace-pre-wrap">{proj.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.education.length > 0 && data.education[0].degree !== "" && (
                        <div>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Academic Qualifications</h3>
                          <div className="px-1 space-y-2">
                            {data.education.map(edu => (
                              <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                  <span className={`font-bold text-[12px] uppercase ${tStyles.text}`}>{edu.degree}</span>
                                  <span className="text-[10px] font-semibold opacity-60">{edu.year}</span>
                                </div>
                                <div className="flex justify-between items-baseline mt-0.5">
                                  <span className="text-[11px] opacity-80">{edu.school}</span>
                                  <span className={`text-[10px] font-bold ${tStyles.accent}`}>{edu.score}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.skills.length > 0 && (
                        <div>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Core Competencies</h3>
                          <div className="flex flex-wrap gap-1.5 px-1">
                            {data.skills.map((skill, i) => (
                              <span key={i} className={`text-[10px] border px-2 py-0.5 rounded-md font-semibold ${data.templateType === 'neon' ? 'bg-transparent border-zinc-300 text-cyan-400' : 'bg-zinc-100 border-zinc-200 text-zinc-800'}`}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Two Column Section for Certs & Awards */}
                      {(data.certifications.length > 0 || data.achievements.length > 0) && (
                        <div className="grid grid-cols-2 gap-6 pt-2">
                          {data.certifications.length > 0 && data.certifications[0].name !== "" && (
                            <div>
                               <h3 className={`text-[10px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Certifications</h3>
                              <div className="space-y-2 px-1">
                                {data.certifications.map(cert => (
                                  <div key={cert.id} className="text-[10px] leading-tight">
                                    <span className="font-bold block mb-0.5">{cert.name}</span>
                                    <span className="opacity-70">{cert.issuer} {cert.year && `• ${cert.year}`}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {data.achievements.length > 0 && data.achievements[0].title !== "" && (
                            <div>
                               <h3 className={`text-[10px] font-black uppercase tracking-widest ${tStyles.text} border-b ${tStyles.border} mb-2.5 pb-1 ${tStyles.headerBg ? `px-2 py-1 ${tStyles.headerBg} rounded-sm` : ''}`}>Achievements</h3>
                              <div className="space-y-2 px-1">
                                {data.achievements.map(achv => (
                                  <div key={achv.id} className="text-[10px] leading-tight">
                                    <span className="font-bold block mb-0.5">{achv.title}</span>
                                    <span className="opacity-70">{achv.desc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default ResumeBuilder;