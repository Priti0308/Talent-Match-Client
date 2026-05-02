import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { 
  FaHistory, FaChartLine, FaRobot, FaFilePdf, FaCheckCircle, FaTimesCircle, FaDownload, FaBrain, FaFileAlt, FaSpinner, FaUser, FaUserEdit, FaSave, FaCompass, FaAward, FaLock 
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate, useLocation } from "react-router-dom";

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

const PATHWAY_EMOJIS = {
  "Full-Stack Architecture": { emoji: "🚀", color: "from-cyan-500 to-blue-600" },
  "AI & Machine Learning": { emoji: "🧠", color: "from-purple-500 to-cyan-600" },
  "DevSecOps Engineering": { emoji: "🛡️", color: "from-cyan-500 to-purple-600" },
  "Data Analytics": { emoji: "📈", color: "from-blue-500 to-cyan-600" },
  "Cloud Solutions Architect": { emoji: "🌩️", color: "from-sky-500 to-blue-500" },
  "Blockchain Engineer": { emoji: "💠", color: "from-orange-500 to-amber-600" },
  "Product Management": { emoji: "🎯", color: "from-amber-500 to-orange-600" },
  "Strategic Finance": { emoji: "💰", color: "from-cyan-500 to-red-600" },
  "Marketing Strategy": { emoji: "🔥", color: "from-purple-500 to-cyan-600" },
  "Human Resources": { emoji: "🤝", color: "from-yellow-500 to-amber-600" },
  "Operations Management": { emoji: "⚙️", color: "from-stone-500 to-neutral-600" }
};


const NeuralNetworkChart = () => {
  // 4-5-3-3 Architecture
  const layers = [4, 5, 3, 3];
  const width = 600;
  const height = 400;
  const paddingX = 80;
  const paddingY = 40;
  const layerSpacing = (width - paddingX * 2) / (layers.length - 1);
  
  const nodes = [];
  const edges = [];
  
  // Calculate node positions
  layers.forEach((nodeCount, layerIdx) => {
    const x = paddingX + layerIdx * layerSpacing;
    const nodeSpacing = (height - paddingY * 2) / Math.max(1, (nodeCount - 1));
    const startY = (height - (nodeCount - 1) * nodeSpacing) / 2;
    
    for (let i = 0; i < nodeCount; i++) {
      const y = startY + i * nodeSpacing;
      nodes.push({ id: `${layerIdx}-${i}`, x, y, layer: layerIdx });
    }
  });

  // Calculate edges
  for (let l = 0; l < layers.length - 1; l++) {
    const currentLayerNodes = nodes.filter(n => n.layer === l);
    const nextLayerNodes = nodes.filter(n => n.layer === l + 1);
    
    currentLayerNodes.forEach(source => {
      nextLayerNodes.forEach(target => {
        edges.push({ source, target });
      });
    });
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-white shadow-sm border border-zinc-200 rounded-3xl mb-10 overflow-hidden relative">
      <h3 className="text-lg font-bold text-zinc-800 mb-2 uppercase tracking-widest flex items-center gap-2 self-start"><FaBrain className="text-sky-500"/> AI Engine Architecture</h3>
      <p className="text-sm text-zinc-500 self-start mb-6">TalentMatch Neural Network Model (4-5-3-3)</p>
      
      <div className="w-full max-w-3xl overflow-x-auto custom-scrollbar pb-4 flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]" style={{ maxWidth: '800px' }}>
          {edges.map((edge, i) => (
            <line 
              key={`edge-${i}`}
              x1={edge.source.x} 
              y1={edge.source.y} 
              x2={edge.target.x} 
              y2={edge.target.y} 
              stroke="#d4d4d8" 
              strokeWidth="1.5"
            />
          ))}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle 
                cx={node.x} 
                cy={node.y} 
                r="16" 
                fill="#87CEEB" 
                stroke="#27272a" 
                strokeWidth="2"
                className="hover:fill-sky-400 transition-colors cursor-pointer"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

function Dashboard() {
  const [atsHistory, setAtsHistory] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [pathwayResult, setPathwayResult] = useState(null);
  const [globalPathwayStats, setGlobalPathwayStats] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ name: '', contact: '', college: '', course: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openProfile && userProfile) {
      setShowProfileModal(true);
      setIsEditingProfile(!!location.state?.editProfile);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, userProfile]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [atsRes, interviewRes, profileRes, pathwayRes, globalStatsRes] = await Promise.all([
          axios.get("/api/resume/history", { headers }).catch(e => ({ data: [] })),
          axios.get("/api/interview/history", { headers }).catch(e => ({ data: [] })),
          axios.get("/api/auth/profile", { headers }).catch(e => {
            const userInfo = localStorage.getItem("userInfo");
            return { data: { user: userInfo ? JSON.parse(userInfo).user : null } };
          }),
          axios.get("/api/pathway/my-result", { headers }).catch(e => ({ data: { data: [] } })),
          axios.get("/api/pathway/stats", { headers }).catch(e => ({ data: { data: [] } }))
        ]);

        const atsHistoryData = Array.isArray(atsRes.data) ? atsRes.data : (atsRes.data?.data || []);
        const interviewHistoryData = Array.isArray(interviewRes.data) ? interviewRes.data : (interviewRes.data?.data || []);

        setAtsHistory(atsHistoryData);
        setInterviewHistory(interviewHistoryData);
        
        if (pathwayRes.data && pathwayRes.data.data && pathwayRes.data.data.length > 0) {
           setPathwayResult(pathwayRes.data.data[0]); 
        }
        if (globalStatsRes.data && globalStatsRes.data.data) {
           setGlobalPathwayStats(globalStatsRes.data.data);
        }
        if (profileRes.data && profileRes.data.user) {
          setUserProfile(profileRes.data.user);
          setProfileFormData({
            name: profileRes.data.user.name || '',
            contact: profileRes.data.user.contact || '',
            college: profileRes.data.user.college || '',
            course: profileRes.data.user.course || '',
            avatar: profileRes.data.user.avatar || ''
          });
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileFormData({ ...profileFormData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

    const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.put("/api/auth/profile", profileFormData, { headers });
      if (res.data.success) {
        setUserProfile(res.data.user);
        setIsEditingProfile(false);
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (userInfo.user) {
          userInfo.user = res.data.user;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        alert("Profile updated successfully!");
        window.dispatchEvent(new Event("profileUpdated"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  
  const generateATS_PDF = (result) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const purple = [124, 58, 237], dark = [10, 10, 10];

    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("TALENT MATCH — ATS ANALYSIS", 15, 15);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleString()} | File: ${result.fileName || 'Document.pdf'}`, 15, 22);

    doc.setFillColor(...purple);
    doc.roundedRect(155, 8, 40, 20, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`${result.atsScore}`, 165, 20);
    doc.setFontSize(8);
    doc.text("SCORE / 100", 165, 25);

    let currentY = 45;

    autoTable(doc, {
      startY: currentY,
      head: [['Matched Skills', 'Missing Keywords']],
      body: [[result.skillsMatched?.join(", ") || "None", result.missingKeywords?.join(", ") || "None"]],
      headStyles: { fillColor: dark, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } }
    });
    currentY = doc.lastAutoTable.finalY + 8;

    autoTable(doc, {
      startY: currentY,
      head: [['Optimization Metrics', 'Strength/Impact']],
      body: result.atsFactors?.map(f => [f.name, `${f.score}%`]) || [],
      headStyles: { fillColor: purple, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      theme: 'striped'
    });
    currentY = doc.lastAutoTable.finalY + 8;

    autoTable(doc, {
      startY: currentY,
      head: [['Key Strengths', 'Areas to Improve']],
      body: result.strengths?.map((s, i) => [s, result.weaknesses?.[i] || ""]) || [],
      headStyles: { fillColor: [40, 40, 40], fontSize: 9 },
      styles: { fontSize: 7, cellPadding: 2.5 }
    });
    currentY = doc.lastAutoTable.finalY + 8;

    if (result.interviewQuestions?.length) {
      autoTable(doc, {
        startY: currentY,
        head: [['Top 5 Interview Prep Questions']],
        body: result.interviewQuestions.slice(0, 5).map(q => [q]),
        headStyles: { fillColor: [236, 72, 153], fontSize: 9 },
        styles: { fontSize: 7, cellPadding: 2 }
      });
    }

    doc.save(`TalentMatch_ATS_Report.pdf`);
  };

  const generatePDF = (interview) => {
    const doc = new jsPDF();
    const date = new Date(interview.createdAt).toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("TalentMatch AI Report", 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Interview Date: ${date}`, 14, 30);
    doc.text(`Status: ${interview.analysis?.isShortlisted ? 'Shortlisted' : 'Not Shortlisted'}`, 14, 38);

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Score / Level']],
      body: [
        ['Overall Score', `${interview.analysis?.finalScore || 0}%`],
        ['Communication Level', interview.analysis?.communicationLevel || 'N/A'],
        ['Confidence Level', interview.analysis?.confidenceLevel || 'N/A'],
        ['Correctness Score', `${interview.analysis?.correctnessScore || 0}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [168, 85, 247] } 
    });

    if (interview.analysis?.hiringDossier && interview.analysis.hiringDossier.length > 0) {
      doc.text("Hiring Manager Dossier:", 14, doc.lastAutoTable.finalY + 15);
      doc.setFontSize(10);
      interview.analysis.hiringDossier.forEach((point, i) => {
        const lines = doc.splitTextToSize(`• ${point}`, 180);
        doc.text(lines, 14, doc.lastAutoTable.finalY + 25 + (i * 10));
      });
    }

    doc.save(`TalentMatch_Interview_${interview._id.slice(-6)}.pdf`);
  };

  // Recharts Data Prep
  const atsChartData = [...atsHistory].reverse().map((item, idx) => ({
    name: `Scan ${idx + 1}`,
    score: item.atsScore
  }));

  const interviewChartData = [...interviewHistory].reverse().map((item, idx) => ({
    name: `Int. ${idx + 1}`,
    score: item.analysis?.finalScore || 0
  }));

  const pieData = [
    { name: "Shortlisted", value: interviewHistory.filter(i => i.analysis?.isShortlisted).length },
    { name: "Rejected", value: interviewHistory.filter(i => !i.analysis?.isShortlisted).length }
  ].filter(d => d.value > 0);

  const highestScore = interviewHistory.reduce((max, int) => Math.max(max, int.analysis?.finalScore || 0), 0);
  const isCertified = highestScore > 85;

  const downloadBadge = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1000, 1000);
    bgGrad.addColorStop(0, "#050505");
    bgGrad.addColorStop(1, "#110a1f");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 1000);

    // Glowing orb behind badge
    const glow = ctx.createRadialGradient(500, 500, 100, 500, 500, 400);
    glow.addColorStop(0, "rgba(168, 85, 247, 0.4)");
    glow.addColorStop(1, "rgba(6, 182, 212, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1000, 1000);

    // Badge outer border
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(500, 500, 400, 0, 2 * Math.PI);
    ctx.fillStyle = "#0A0A0A";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Gradient ring
    const ringGrad = ctx.createLinearGradient(100, 100, 900, 900);
    ringGrad.addColorStop(0, "#00ffff");
    ringGrad.addColorStop(0.5, "#38bdf8");
    ringGrad.addColorStop(1, "#ff00ff");
    ctx.beginPath();
    ctx.arc(500, 500, 400, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = ringGrad;
    ctx.stroke();

    // Inner details - dashed ring
    ctx.beginPath();
    ctx.arc(500, 500, 370, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.setLineDash([15, 15]);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Text content
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Icon or top text
    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("🚀 TALENT MATCH", 500, 320);

    // Main title
    ctx.font = "900 65px sans-serif";
    const titleGrad = ctx.createLinearGradient(200, 0, 800, 0);
    titleGrad.addColorStop(0, "#00ffff");
    titleGrad.addColorStop(1, "#ff00ff");
    ctx.fillStyle = titleGrad;
    ctx.fillText("INTERVIEW CERTIFIED", 500, 420);

    // Line separator
    ctx.beginPath();
    ctx.moveTo(350, 490);
    ctx.lineTo(650, 490);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.stroke();

    // Candidate Name
    ctx.font = "bold 60px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(userProfile?.name?.toUpperCase() || "CANDIDATE", 500, 580);

    // Score
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`VERIFIED TOP SCORE: ${highestScore}%`, 500, 680);

    const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "gray";
    ctx.fillText(`Issued: ${date}`, 500, 750);

    // Download
    const link = document.createElement("a");
    link.download = `TalentMatch_Badge_${userProfile?.name?.replace(/\s+/g, '_') || 'Certified'}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800/40 via-purple-900/10 to-gray-800/40 animate-pulse border border-zinc-100" />
            <div className="flex flex-col gap-2">
              <div className="w-48 md:w-64 h-8 bg-gradient-to-r from-gray-800/40 to-gray-700/20 animate-pulse rounded-lg" />
              <div className="w-64 md:w-96 h-4 bg-gradient-to-r from-gray-800/30 to-gray-700/10 animate-pulse rounded-md" />
            </div>
          </div>
          <div className="w-32 h-12 bg-gradient-to-r from-gray-800/40 via-cyan-900/10 to-gray-800/40 animate-pulse rounded-xl" />
        </div>
        
        {/* Top Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-gradient-to-br from-gray-800/30 via-purple-900/5 to-gray-900/30 animate-[pulse_2s_infinite] border border-zinc-100" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-3xl bg-gradient-to-r from-gray-800/30 via-purple-900/5 to-gray-900/30 animate-[pulse_2.5s_infinite] border border-zinc-100" />
          <div className="h-80 rounded-3xl bg-gradient-to-r from-gray-800/30 via-cyan-900/5 to-gray-900/30 animate-[pulse_2s_infinite] border border-zinc-100" delay="0.2s" />
        </div>

        {/* Bottom Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-gradient-to-br from-gray-800/20 via-cyan-900/5 to-gray-900/20 animate-[pulse_1.5s_infinite] border border-zinc-100" />
          <div className="h-64 rounded-3xl bg-gradient-to-br from-gray-800/20 via-blue-900/5 to-gray-900/20 animate-[pulse_2.2s_infinite] border border-zinc-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-800 font-sans overflow-x-hidden pt-28 pb-20 px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
      
      {/* ── GRADIENT BACKGROUND ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(56,189,248,0.3)]">
              <FaChartLine className="text-3xl text-zinc-800" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">{userProfile?.name ? `${userProfile.name}'s Dashboard` : "Your Dashboard"}</h1>
              <p className="text-zinc-500">Track your ATS optimization and Mock Interview progression</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 px-5 py-3 bg-white shadow-sm border border-zinc-200 hover:bg-zinc-100 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform overflow-hidden">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Profile</div>
              <div className="text-zinc-800 text-sm font-medium">{userProfile?.name || 'User'}</div>
            </div>
          </button>
        </div>

        {/* PROFILE MODAL */}
        {showProfileModal && userProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent/80 backdrop-blur-sm p-4">
            <div className="bg-transparent border border-zinc-200 rounded-[2.5rem] w-full max-w-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-4">
                   <h3 className="text-2xl font-black tracking-tighter text-zinc-800 flex items-center gap-3">
                     <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
                       <FaUser />
                     </div>
                     My Profile
                   </h3>
                   <div className="flex gap-3">
                     {!isEditingProfile && (
                       <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 bg-white shadow-sm hover:bg-zinc-100 border border-zinc-200 text-zinc-700 bg-white border border-zinc-200 rounded-xl text-xs font-bold uppercase hover:bg-zinc-50 tracking-widest flex items-center gap-2 transition-colors">
                         <FaUserEdit /> Edit
                       </button>
                     )}
                     <button onClick={() => { setIsEditingProfile(false); setShowProfileModal(false); }} className="w-10 h-10 bg-white shadow-sm hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl flex items-center justify-center transition-colors">
                       <FaTimesCircle className="text-xl" />
                     </button>
                   </div>
                </div>

                <div>
                  {isEditingProfile ? (
                     <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="md:col-span-2 flex flex-col items-center mb-2">
                         <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-sky-300 bg-white flex items-center justify-center relative group shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                           {profileFormData.avatar ? (
                             <img src={profileFormData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             <FaUser className="text-4xl text-zinc-500" />
                           )}
                           <div className="absolute inset-0 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <label htmlFor="avatar-upload" className="text-[10px] text-zinc-800 uppercase font-bold tracking-widest cursor-pointer w-full h-full flex flex-col items-center justify-center text-center">
                                Change
                              </label>
                              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                           </div>
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                         <input type="text" value={profileFormData.name} onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors" required />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Contact / WhatsApp</label>
                         <input type="text" value={profileFormData.contact} onChange={(e) => setProfileFormData({...profileFormData, contact: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors" required />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">College/University</label>
                         <input type="text" value={profileFormData.college} onChange={(e) => setProfileFormData({...profileFormData, college: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors" required />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Course/Specialization</label>
                         <input type="text" value={profileFormData.course} onChange={(e) => setProfileFormData({...profileFormData, course: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors" required />
                       </div>
                       <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-200">
                         <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-3 bg-white shadow-sm hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors">
                           Cancel
                         </button>
                         <button type="submit" disabled={updatingProfile} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-zinc-800 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50">
                           {updatingProfile ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
                         </button>
                       </div>
                     </form>
                  ) : (
                     <div className="flex flex-col gap-6">
                       <div className="flex items-center gap-6 mb-2 border-b border-zinc-100 pb-6">
                         <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 bg-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                           {userProfile.avatar ? (
                             <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             <FaUser className="text-4xl text-zinc-500" />
                           )}
                         </div>
                         <div>
                           <h4 className="text-2xl font-bold text-zinc-800">{userProfile.name}</h4>
                           <div className="text-sm text-sky-600 font-medium">Dashboard Member • {userProfile.college}</div>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl p-5">
                           <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Full Name</div>
                           <div className="text-lg text-zinc-800 font-medium">{userProfile.name}</div>
                         </div>
                         <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl p-5">
                           <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Email Address</div>
                           <div className="text-lg text-zinc-800 font-medium">{userProfile.email}</div>
                         </div>
                         <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl p-5">
                           <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Contact</div>
                           <div className="text-lg text-zinc-800 font-medium">{userProfile.contact}</div>
                         </div>
                         <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl p-5">
                           <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Education</div>
                           <div className="text-lg text-zinc-800 font-medium">{userProfile.course} <span className="text-zinc-500 text-sm">at</span> {userProfile.college}</div>
                         </div>
                       </div>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 backdrop-blur-md hover:bg-zinc-100 transition-colors flex flex-col justify-center items-center text-center">
            <FaFileAlt className="text-3xl text-sky-600 mb-4" />
            <div className="text-3xl font-black text-zinc-800">{atsHistory.length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Resumes Scanned</div>
          </motion.div>
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 backdrop-blur-md hover:bg-zinc-100 transition-colors flex flex-col justify-center items-center text-center">
            <FaRobot className="text-3xl text-blue-500 mb-4" />
            <div className="text-3xl font-black text-zinc-800">{interviewHistory.length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Interviews Taken</div>
          </motion.div>
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 backdrop-blur-md hover:bg-zinc-100 transition-colors flex flex-col justify-center items-center text-center">
            <FaCheckCircle className="text-3xl text-green-400 mb-4" />
            <div className="text-3xl font-black text-zinc-800">{interviewHistory.filter(i => i.analysis?.isShortlisted).length}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Shortlists Generated</div>
          </motion.div>
          
          {/* NEW RESUME BUILDER SHORTCUT TILE */}
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}} 
            onClick={() => navigate('/resume-builder')}
            className="bg-gradient-to-br from-slate-500/20 to-sky-500/20 border border-slate-400/30 rounded-3xl p-6 backdrop-blur-md hover:from-purple-500/40 hover:to-cyan-500/40 cursor-pointer transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_20px_rgba(56,189,248,0.3)] flex flex-col justify-between group">
            <div className="flex justify-between items-start">
               <FaUserEdit className="text-3xl text-sky-500 group-hover:scale-110 transition-transform" />
               <div className="px-2 py-1 bg-slate-200 text-slate-500 text-[9px] font-black rounded uppercase tracking-widest border border-zinc-200">NEW FEATURE</div>
            </div>
            <div>
              <div className="text-xl font-black text-zinc-800 leading-tight mt-6">AI Resume<br/>Builder</div>
            </div>
          </motion.div>

          {/* NEW PATHFINDER RESULT STAT TILE */}
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.5}} 
            onClick={() => navigate('/career-path')}
            className={`bg-gradient-to-br ${pathwayResult && PATHWAY_EMOJIS[pathwayResult.recommendedPathway] ? PATHWAY_EMOJIS[pathwayResult.recommendedPathway].color : 'from-cyan-900 to-purple-900'} border border-white/20 rounded-3xl p-6 backdrop-blur-md hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-center items-center text-center shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] group relative overflow-hidden`}
          >
             <div className="absolute top-0 right-0 p-12 bg-white shadow-sm rounded-full blur-[40px]" />
             <div className="text-xs font-bold uppercase tracking-widest text-zinc-800/80 mb-4">Your True Fit</div>
             {pathwayResult ? (
                <>
                  <div className="text-6xl mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-125 transition-transform origin-center">
                    {PATHWAY_EMOJIS[pathwayResult.recommendedPathway]?.emoji || "🗺️"}
                  </div>
                  <div className="text-lg font-black text-zinc-800 leading-tight">{pathwayResult.recommendedPathway}</div>
                </>
             ) : (
                <>
                  <div className="text-6xl mb-3 drop-shadow-[0_0_30px_rgba(56,189,248,0.8)] group-hover:scale-125 animate-pulse group-hover:animate-none transition-all origin-center">
                    🧭
                  </div>
                  <div className="text-sm font-bold text-zinc-800 leading-tight">Take Validation Quiz</div>
                </>
             )}
          </motion.div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* INTERVIEW PROGRESSION AREA CHART */}
          <div className="lg:col-span-2 bg-transparent border border-zinc-200 rounded-3xl p-6 pb-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] pointer-events-none"></div>
            <h3 className="text-lg font-bold text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-2"><FaChartLine className="text-blue-500"/> Interview Performance</h3>
            <div className="h-72 w-full">
              {interviewChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={interviewChartData}>
                    <defs>
                      <linearGradient id="colorScorePink" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" axisLine={false} tickLine={false} />
                    <YAxis stroke="#71717a" domain={[0, 100]} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#38bdf8', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScorePink)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No interview data available</div>
              )}
            </div>
          </div>

          {/* ATS SCORE LINE CHART */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 pb-2">
             <h3 className="text-lg font-bold text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-2"><FaFileAlt className="text-sky-600"/> ATS Progression</h3>
             <div className="h-72 w-full">
               {atsChartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={atsChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" axisLine={false} tickLine={false} />
                      <YAxis stroke="#71717a" domain={[0, 100]} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#0284c7', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="score" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#050505', strokeWidth: 2, r: 4, stroke: '#0284c7' }} />
                    </LineChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No ATS scans available</div>
               )}
             </div>
          </div>

        </div>

        {/* PIE CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* SUCCESS RATE PIE CHART */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 flex flex-col items-center w-full">
             <h3 className="text-lg font-bold text-zinc-800 mb-4 uppercase tracking-widest w-full text-left flex items-center gap-2"><FaChartLine className="text-sky-600"/> Success Rate</h3>
             <div className="h-64 min-h-[260px] w-full flex-1">
               {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Shortlisted" ? "#E11D48" : "#94a3b8"} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#333', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
               ) : (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Not enough data</div>
               )}
             </div>
             <div className="flex gap-4 w-full justify-center mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-xs text-zinc-500">Shortlisted</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div><span className="text-xs text-zinc-500">Rejected</span></div>
             </div>
          </div>

          {/* GLOBAL ROADMAP DISTRIBUTION BAR CHART */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 flex flex-col w-full">
            <h3 className="text-lg font-bold text-zinc-800 mb-4 uppercase tracking-widest text-left flex items-center gap-2"><FaCompass className="text-sky-600"/> Community Roadmaps</h3>
            <div className="h-64 min-h-[260px] w-full flex-1">
               {globalPathwayStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={globalPathwayStats} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#71717a" axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} width={120} tick={{fontSize: 10}} />
                      <RechartsTooltip cursor={{fill: '#f4f4f510'}} contentStyle={{ backgroundColor: '#fff', borderColor: '#38bdf8', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={15}>
                        {globalPathwayStats.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               ) : (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Not enough roadmap data</div>
               )}
            </div>
          </div>

        </div>

        
        
        {/* SIDE-BY-SIDE: RECENT MOCK INTERVIEWS & CAREER ACHIEVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* LEFT: MOCK INTERVIEWS */}
          <div>
            {interviewHistory.length > 0 ? (
              <div>
                <h3 className="text-xl font-black text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-3">
                  <FaRobot className="text-purple-500 text-2xl" /> Recent Mock Interviews
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {interviewHistory.slice(0, 2).map((interview, index) => (
                    <div key={index} className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm hover:border-purple-500/30 transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-[50px] pointer-events-none"></div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{new Date(interview.createdAt).toLocaleDateString()}</span>
                        <span className={`${interview.analysis?.isShortlisted ? 'text-green-600 bg-green-50' : 'text-zinc-600 bg-zinc-100'} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                          {interview.analysis?.isShortlisted ? 'Shortlisted' : 'Reviewed'}
                        </span>
                      </div>
                      
                      <div className="text-3xl font-black text-zinc-800 mb-6">{interview.analysis?.finalScore || 0}% <span className="text-sm text-zinc-500 font-medium">Overall</span></div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-zinc-600">Aptitude Round</span>
                          <span className="text-sm font-black text-sky-500">{interview.analysis?.roundBreakdowns?.aptitude?.score || 0}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full" style={{ width: `${interview.analysis?.roundBreakdowns?.aptitude?.score || 0}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm font-bold text-zinc-600">Resume/Tech</span>
                          <span className="text-sm font-black text-purple-500">{interview.analysis?.roundBreakdowns?.techMCQ?.score || interview.analysis?.roundBreakdowns?.resume?.score || 0}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${interview.analysis?.roundBreakdowns?.techMCQ?.score || interview.analysis?.roundBreakdowns?.resume?.score || 0}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm font-bold text-zinc-600">HR / Behavioral</span>
                          <span className="text-sm font-black text-amber-500">{interview.analysis?.roundBreakdowns?.hr?.score || 0}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${interview.analysis?.roundBreakdowns?.hr?.score || 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-black text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-3">
                  <FaRobot className="text-zinc-300 text-2xl" /> Recent Mock Interviews
                </h3>
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center h-[300px]">
                  <FaRobot className="text-5xl text-zinc-200 mb-4" />
                  <p className="text-zinc-500 font-medium">No recent mock interviews taken.</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CAREER ACHIEVEMENTS */}
          <div>
            <h3 className="text-xl font-black text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-3">
              <FaAward className="text-yellow-400 text-2xl" /> Career Achievements
            </h3>
            
            <div className={`relative overflow-hidden rounded-3xl p-8 border h-[90%] ${isCertified ? 'bg-gradient-to-br from-[#1a1025] to-[#050f1a] border-sky-300 shadow-[0_0_40px_rgba(6,182,212,0.2)]' : 'bg-white shadow-sm border-zinc-200'}`}>
              {isCertified && (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[80px]"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px]"></div>
                </>
              )}
              
              <div className="flex flex-col items-center text-center gap-6 relative z-10 h-full justify-center">
                <div className={`w-32 h-32 shrink-0 rounded-full flex items-center justify-center border-[4px] relative ${isCertified ? 'border-cyan-400 bg-transparent shadow-[0_0_30px_#00ffff]' : 'border-gray-700 bg-gray-900 border-dashed opacity-50'}`}>
                   {isCertified ? (
                     <div className="text-center">
                       <FaAward className="text-5xl text-blue-500 mx-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                       <div className="text-[8px] font-black uppercase text-sky-600 tracking-widest mt-1">Certified</div>
                     </div>
                   ) : (
                     <FaLock className="text-3xl text-zinc-500" />
                   )}
                   {isCertified && (
                     <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="48" fill="none" stroke="url(#badgeGrad)" strokeWidth="4" strokeDasharray="20 10" />
                       <defs>
                         <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                           <stop offset="0%" stopColor="#00ffff" />
                           <stop offset="100%" stopColor="#ff00ff" />
                         </linearGradient>
                       </defs>
                     </svg>
                   )}
                </div>

                <div>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCertified ? 'text-sky-600' : 'text-zinc-500'}`}>
                    {isCertified ? 'Unlocked Achievement' : 'Locked Achievement'}
                  </div>
                  <h4 className={`text-2xl font-black mb-2 ${isCertified ? 'text-zinc-800' : 'text-zinc-500'}`}>
                    Interview Certified
                  </h4>
                  <p className="text-base text-zinc-500 font-medium leading-relaxed mb-6">
                    {isCertified 
                      ? 'You have proven your skills to our AI Interviewer! Show off your Talent Match Certification on LinkedIn.'
                      : 'Score higher than 85% on a Mock Interview to unlock the verified Talent Match Certification badge image for LinkedIn.'}
                  </p>
                  
                  {isCertified && (
                    <button onClick={downloadBadge} className="px-6 py-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all w-full sm:w-auto mx-auto">
                      <FaDownload /> Download Badge
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* COMPREHENSIVE HISTORY LISTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* ATS RESUMES LIST */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-2">
              <FaFileAlt className="text-sky-600" /> ATS Resume History
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {atsHistory.length > 0 ? atsHistory.map((resume) => {
                const dateObj = new Date(resume.createdAt);
                const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
                const fullDate = dateObj.toLocaleDateString();
                return (
                  <div key={resume._id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-white transition-colors gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-sky-50 border border-sky-300 text-sky-600">
                          <FaFileAlt className="text-xl" />
                       </div>
                       <div>
                         <h4 className="font-bold text-zinc-800 text-sm">{resume.fileName || 'Document.pdf'}</h4>
                         <div className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-2">
                           <span>{dayName}, {fullDate}</span> • <span>Score: <strong className="text-sky-600">{resume.atsScore}%</strong></span>
                         </div>
                       </div>
                    </div>
                    <button onClick={() => generateATS_PDF(resume)} className="shrink-0 px-4 py-2 bg-zinc-100 hover:bg-white/20 text-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                      <FaDownload /> Download
                    </button>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 text-sm py-4 text-center border border-dashed border-zinc-200 rounded-2xl">No Resumes Scanned Yet.</div>
              )}
            </div>
          </div>

          {/* RECENT MOCK INTERVIEWS LIST */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-zinc-800 mb-6 uppercase tracking-widest flex items-center gap-2">
              <FaRobot className="text-blue-500" /> Mock Interview Reports
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {interviewHistory.length > 0 ? interviewHistory.map((interview) => {
                const dateObj = new Date(interview.createdAt);
                const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
                const fullDate = dateObj.toLocaleDateString();
                return (
                  <div key={interview._id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-white transition-colors gap-4">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 ${interview.analysis?.isShortlisted ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-400/10 border-slate-400/50 text-slate-500'}`}>
                           {interview.analysis?.isShortlisted ? <FaCheckCircle className="text-xl" /> : <FaTimesCircle className="text-xl" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-800 text-sm">Attempt on {dayName}</h4>
                          <div className="text-xs text-zinc-500 flex gap-3 mt-1 flex-wrap">
                            <span>{fullDate}</span>
                            <span>Score: <strong className="text-sky-600">{interview.analysis?.finalScore || 0}%</strong></span>
                          </div>
                        </div>
                     </div>
                     <button onClick={() => generatePDF(interview)} className="shrink-0 px-4 py-2 bg-zinc-100 hover:bg-white/20 text-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                       <FaDownload /> PDF Report
                     </button>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 text-sm py-4 text-center border border-dashed border-zinc-200 rounded-2xl">No Mock Interviews Taken Yet.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;