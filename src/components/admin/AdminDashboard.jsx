import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaUserGraduate, FaFileAlt, FaComments, FaEdit, FaTrash, FaUserTie,
  FaBuilding, FaEnvelope, FaPhone, FaChartPie, FaCopy, FaCheckCircle,
  FaUsers, FaSignOutAlt, FaBars, FaTimes, FaPlus, FaCamera, FaDownload,
  FaFileExcel, FaCog, FaRocket, FaTwitter, FaLinkedin, FaWhatsapp
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSettings from "./AdminSettings";

// --- INVITE CARD COMPONENT ---
const InviteCard = ({ userInfo }) => {
  const [copied, setCopied] = useState(false);
  const teacherCode = userInfo?.user?.teacherCode;

  if (!teacherCode) return null;

  const inviteLink = `${window.location.origin}/register?ref=${teacherCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-indigo-100 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-50 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <FaUsers className="text-indigo-600" size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Invite Your Students</h3>
          </div>
          <p className="text-slate-500 text-sm font-medium max-w-xl mb-4">
            Share this link. Students who register with it will automatically be added to your dashboard.
          </p>
          <div className="flex gap-3">
             <a href={`https://twitter.com/intent/tweet?text=Join my class on TalentMatch!&url=${encodeURIComponent(inviteLink)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition"><FaTwitter size={18} /></a>
             <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition"><FaLinkedin size={18} /></a>
             <a href={`https://wa.me/?text=Join%20my%20class%20on%20TalentMatch!%20${encodeURIComponent(inviteLink)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition"><FaWhatsapp size={18} /></a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto bg-slate-50 border border-slate-200 p-2 rounded-2xl">
          <div className="px-4 py-2 font-mono text-indigo-600 font-bold text-sm tracking-wider select-all">
            {teacherCode}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-md transition-all flex-1 justify-center"
          >
            {copied ? <FaCheckCircle size={16} /> : <FaCopy size={16} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
function AdminDashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data States
  const [students, setStudents] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [analyzedResumes, setAnalyzedResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);

  // Modals & Forms for Students
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", contact: "", college: "" });

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: "", email: "", contact: "", college: "", course: "N/A", password: "" });

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData.user.role === "admin" || parsedData.user.role === "superadmin") {
        setUserInfo(parsedData);
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [studentsRes, resumesRes, analyzedResumesRes, interviewsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/students", config),
        axios.get("http://localhost:5000/api/admin/resumes/all", config),
        axios.get("http://localhost:5000/api/admin/analyzed-resumes/all", config),
        axios.get("http://localhost:5000/api/admin/interviews/all", config)
      ]);
      setStudents(studentsRes.data.data || []);
      setResumes(resumesRes.data.data || []);
      setAnalyzedResumes(analyzedResumesRes.data.data || []);
      setInterviews(interviewsRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      fetchAdminData();
    }
  }, [userInfo]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- STUDENT CRUD ACTIONS ---
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...addFormData,
        role: "user",
        teacherCode: userInfo.user.teacherCode
      });
      setIsAddingStudent(false);
      setAddFormData({ name: "", email: "", contact: "", college: "", course: "", password: "" });
      fetchAdminData();
      toast.success("Student added successfully!");
    } catch (error) {
      toast.error("Failed to add student: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student permanently?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/admin/user/delete/${id}`, config);
      fetchAdminData();
      toast.success("Student deleted");
    } catch (error) {
      toast.error("Failed to delete student: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student._id);
    setEditFormData({ name: student.name, email: student.email, contact: student.contact, college: student.college, course: student.course || "" });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put("http://localhost:5000/api/admin/user/update", {
        userId: editingStudent,
        ...editFormData
      }, config);
      setEditingStudent(null);
      fetchAdminData();
      toast.success("Student updated successfully!");
    } catch (error) {
      toast.error("Failed to update student: " + (error.response?.data?.message || error.message));
    }
  };

  if (!userInfo) return null;

  // --- CHART CALCULATIONS ---
  const totalAnalyzed = analyzedResumes.length || 1;
  const highScores = analyzedResumes.filter(r => r.atsScore >= 75).length;
  const medScores = analyzedResumes.filter(r => r.atsScore >= 50 && r.atsScore < 75).length;
  const lowScores = analyzedResumes.filter(r => r.atsScore < 50).length;
  const completedInterviews = interviews.filter(i => i.status === 'Completed').length;
  const pendingInterviews = interviews.length - completedInterviews;

  const getChartData = (dataArray) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let thisWeek = 0; let thisMonth = 0; let older = 0;
    dataArray.forEach(item => {
      const date = new Date(item.createdAt);
      if (date >= oneWeekAgo) thisWeek++;
      else if (date >= oneMonthAgo) thisMonth++;
      else older++;
    });

    return [
      { name: 'This Week', value: thisWeek },
      { name: 'This Month', value: thisMonth },
      { name: 'Older', value: older }
    ];
  };

  const resumeChartData = getChartData(resumes);
  const interviewChartData = getChartData(interviews);

  const getGrowthData = (dataArray) => {
    const counts = {};
    dataArray.forEach(item => {
      const d = new Date(item.createdAt);
      const m = d.toLocaleString('en-US', { month: 'short' });
      counts[m] = (counts[m] || 0) + 1;
    });
    let total = 0;
    return Object.entries(counts).map(([month, count]) => {
      total += count;
      return { month, students: total };
    }).reverse();
  };
  const studentGrowthData = getGrowthData(students).length ? getGrowthData(students) : [{ month: 'Initial', students: 0 }];

  const COLORS = ['#8b5cf6', '#06b6d4', '#475569'];

  const downloadCSV = (data, filename) => {
    if (!data.length) return toast.warn("No data to export");
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = (data, filename, title) => {
    if (!data.length) return toast.warn("No data to export");
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, 20);
      const tableColumn = Object.keys(data[0]);
      const tableRows = data.map(item => Object.values(item).map(val => String(val || 'N/A')));
      autoTable(doc, { startY: 30, head: [tableColumn], body: tableRows });
      doc.save(`${filename}.pdf`);
    } catch (err) {
      toast.error("Failed to generate PDF. Check data formatting.");
    }
  };

  const generateInterviewPDF = (interview) => {
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

    doc.save(`TalentMatch_Interview_${interview.user?.name || "Candidate"}.pdf`);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />

      {/* --- VERTICAL SIDEBAR --- */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 text-slate-800 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col shadow-2xl md:shadow-none`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaRocket className="text-white text-xl" />
             </div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
               Talent Match
             </h2>
          </div>
          <button className="md:hidden text-slate-800" onClick={() => setIsSidebarOpen(false)}><FaTimes size={24} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: <FaChartPie /> },
            { id: 'students', label: 'Students', icon: <FaUsers /> },
            { id: 'resumes', label: 'Resumes', icon: <FaFileAlt /> },
            { id: 'ats-reports', label: 'ATS Reports', icon: <FaUserGraduate /> },
            { id: 'interviews', label: 'Interviews', icon: <FaComments /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mb-2"
          >
            <FaCog className="text-lg" /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold tracking-widest uppercase text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <FaSignOutAlt className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-slate-50">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-6 bg-white border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-800">Dashboard</h2>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-800"><FaBars size={24} /></button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

          {/* USER PROFILE HEADER */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center gap-6">

              <button
                onClick={() => setActiveTab('settings')}
                className="relative group w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl shadow-inner border-2 border-white overflow-hidden"
                title="Edit Profile"
              >
                {userInfo.user.avatar ? (
                  <img src={userInfo.user.avatar} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <FaUserTie className="group-hover:opacity-0 transition-opacity" />
                )}
                <div className="absolute inset-0 bg-zinc-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera size={24} />
                </div>
              </button>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">{userInfo.user.name}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-2"><FaEnvelope className="text-indigo-400" /> {userInfo.user.email}</span>
                  <span className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full uppercase tracking-widest text-[10px] font-bold">
                    {userInfo.user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right hidden md:block">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Current Date</p>
              <p className="text-slate-800 font-black">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          <InviteCard userInfo={userInfo} />

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('students')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-105 transition-all">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Students</p>
                    <h2 className="text-4xl font-black text-slate-800">{students.length}</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl"><FaUserGraduate /></div>
                </div>
                <div onClick={() => setActiveTab('resumes')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-105 transition-all">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Resumes Built</p>
                    <h2 className="text-4xl font-black text-slate-800">{resumes.length}</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl"><FaFileAlt /></div>
                </div>
                <div onClick={() => setActiveTab('interviews')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-105 transition-all">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Interviews</p>
                    <h2 className="text-4xl font-black text-slate-800">{interviews.length}</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl"><FaComments /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6">ATS Score Distribution</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2"><span className="text-green-600">High (&gt;75%)</span><span className="text-slate-500">{highScores} Resumes</span></div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(highScores / totalAnalyzed) * 100}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2"><span className="text-orange-500">Medium (50-75%)</span><span className="text-slate-500">{medScores} Resumes</span></div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400 rounded-full" style={{ width: `${(medScores / totalAnalyzed) * 100}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2"><span className="text-red-500">Low (&lt;50%)</span><span className="text-slate-500">{lowScores} Resumes</span></div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${(lowScores / totalAnalyzed) * 100}%` }}></div></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Mock Interview Status</h3>
                  <div className="flex items-center justify-center h-48 relative">
                    <div className="w-full flex h-16 rounded-2xl overflow-hidden shadow-inner">
                      <div className="bg-green-500 h-full flex items-center justify-center text-white font-bold text-xs" style={{ width: `${(completedInterviews / Math.max(interviews.length, 1)) * 100}%` }}>{completedInterviews > 0 && 'COMPLETED'}</div>
                      <div className="bg-orange-300 h-full flex items-center justify-center text-white font-bold text-xs" style={{ width: `${(pendingInterviews / Math.max(interviews.length, 1)) * 100}%` }}>{pendingInterviews > 0 && 'PENDING'}</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600"><div className="w-3 h-3 rounded-full bg-green-500"></div> Completed ({completedInterviews})</span>
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600"><div className="w-3 h-3 rounded-full bg-orange-300"></div> Pending ({pendingInterviews})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
                  <h3 className="text-lg font-black text-slate-800 mb-4 w-full">Resumes Built (Timeline)</h3>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={resumeChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {resumeChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
                  <h3 className="text-lg font-black text-slate-800 mb-4 w-full">Student Growth</h3>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={studentGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="students" stroke="#0ea5e9" strokeWidth={4} dot={{r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2}} activeDot={{r: 8}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-800">Student Registry</h2>
                <div className="flex gap-3">
                  <button onClick={() => downloadCSV(students.map(s => ({ Name: s.name, Email: s.email, Phone: s.contact, College: s.college, Course: s.course, Date: new Date(s.createdAt).toLocaleDateString() })), 'Students_Registry')} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-100 transition-colors shadow-sm border border-green-100"><FaFileExcel /> Export CSV</button>
                  <button onClick={() => downloadPDF(students.map(s => ({ Name: s.name, Email: s.email, Phone: s.contact, College: s.college, Course: s.course, Date: new Date(s.createdAt).toLocaleDateString() })), 'Students_Registry', 'Registered Students Database')} className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors shadow-sm border border-red-100"><FaDownload /> Export PDF</button>
                  <button onClick={() => setIsAddingStudent(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-indigo-700 transition-colors">
                    <FaPlus /> Add Student
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="p-5 font-bold">Profile</th>
                      <th className="p-5 font-bold">Contact Info</th>
                      <th className="p-5 font-bold">Course</th>
                      <th className="p-5 font-bold text-center">ATS Max Match</th>
                      <th className="p-5 font-bold text-center">Interviews</th>
                      <th className="p-5 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      // Fetch individual student stats based on existing data
                      const studentAts = analyzedResumes.filter(r => (r.userId?._id || r.userId) === student._id);
                      const highestAts = studentAts.length > 0 ? Math.max(...studentAts.map(r => r.atsScore)) : null;
                      const studentInterviews = interviews.filter(i => (i.user?._id || i.user) === student._id).length;

                      return (
                        <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">{student.name.charAt(0).toUpperCase()}</div>
                              <div>
                                <p className="font-bold text-slate-800">{student.name}</p>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="text-sm text-slate-600 flex items-center gap-2"><FaEnvelope className="text-slate-400" /> {student.email}</p>
                              <p className="text-sm text-slate-600 flex items-center gap-2"><FaPhone className="text-slate-400" /> {student.contact || "N/A"}</p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="text-sm text-slate-600 font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded inline-block">{student.course}</p>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            {highestAts !== null ? (
                              <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${highestAts >= 75 ? 'bg-green-100 text-green-700' : highestAts >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                {highestAts}%
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs font-bold">N/A</span>
                            )}
                          </td>
                          <td className="p-5 text-center">
                            <span className="bg-slate-100 text-slate-700 font-black px-3 py-1 rounded-lg">{studentInterviews}</span>
                          </td>
                          <td className="p-5 text-center flex justify-center gap-2 mt-2">
                            <button onClick={() => handleEditClick(student)} className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" title="Edit"><FaEdit /></button>
                            <button onClick={() => handleDeleteStudent(student._id)} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors" title="Delete"><FaTrash /></button>
                          </td>
                        </tr>
                      );
                    })}
                    {students.length === 0 && <tr><td colSpan="6" className="p-10 text-center text-slate-400">No students registered yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESUMES TAB */}
          {activeTab === 'resumes' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3"><FaFileAlt className="text-purple-500" /> Student Resumes Built</h2>
                <div className="flex gap-3">
                  <button onClick={() => downloadCSV(resumes.map(r => ({ Name: r.personal?.name || 'N/A', Title: r.personal?.title || 'N/A', Template: r.templateType, Date: new Date(r.createdAt).toLocaleDateString() })), 'Resumes_Report')} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-100 transition-colors shadow-sm border border-green-100"><FaFileExcel /> Export CSV</button>
                  <button onClick={() => downloadPDF(resumes.map(r => ({ Name: r.personal?.name || 'N/A', Title: r.personal?.title || 'N/A', Template: r.templateType, Date: new Date(r.createdAt).toLocaleDateString() })), 'Resumes_Report', 'Student Resumes Report')} className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors shadow-sm border border-red-100"><FaDownload /> Export PDF</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {resumes.map(resume => (
                  <div key={resume._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-purple-500 hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-lg">{resume.personal?.name?.charAt(0) || "R"}</div>
                      <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest">{resume.templateType} UI</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{resume.personal?.name || "Anonymous"}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-4">{resume.personal?.title || "Role Not Specified"}</p>
                    <p className="text-sm font-medium text-slate-600 bg-slate-50 py-2 border border-slate-100 px-3 rounded-lg flex items-center gap-2">
                      <FaEnvelope className="text-purple-400 text-xs" /> {resume.userId?.email || resume.personal?.email || "N/A"}
                    </p>
                    <button onClick={() => downloadPDF([resume.personal || { Name: "Anonymous" }], `Resume_${resume.personal?.name || "Unknown"}`, "Student Built Resume Details")} className="w-full mt-4 bg-purple-50 text-purple-600 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-purple-100 transition flex justify-center items-center gap-2"><FaDownload /> Download Data</button>
                  </div>
                ))}
                {resumes.length === 0 && <div className="text-slate-400 p-10 col-span-3 text-center">No resumes found.</div>}
              </div>
            </div>
          )}

          {/* ATS REPORTS TAB */}
          {activeTab === 'ats-reports' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3"><FaChartPie className="text-blue-500" /> ATS Screen Reports</h2>
                <div className="flex gap-3">
                  <button onClick={() => downloadCSV(analyzedResumes.map(r => ({ Name: r.userId?.name || 'Anonymous', File: r.fileName || 'N/A', Score: r.atsScore, Date: new Date(r.createdAt).toLocaleDateString() })), 'ATS_Reports')} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-100 transition-colors shadow-sm border border-green-100"><FaFileExcel /> Export CSV</button>
                  <button onClick={() => downloadPDF(analyzedResumes.map(r => ({ Name: r.userId?.name || 'Anonymous', File: r.fileName || 'N/A', Score: r.atsScore + "%", Date: new Date(r.createdAt).toLocaleDateString() })), 'ATS_Reports', 'ATS Analysis Reports')} className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors shadow-sm border border-red-100"><FaDownload /> Export PDF</button>
                </div>
              </div>
              {analyzedResumes.map(report => (
                <div key={report._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full lg:w-1/3">
                    <div className={`min-w-16 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 ${report.atsScore >= 75 ? 'bg-green-50 text-green-500 border-green-100' : report.atsScore >= 50 ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                      <FaChartPie />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 truncate">{report.fileName || "Uploaded Resume"}</h3>
                      <p className="text-sm font-medium text-slate-500">{report.userId?.name || "Anonymous"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100 w-48 shrink-0 gap-3">
                    <div className="text-center">
                      <p className={`text-3xl font-black ${report.atsScore >= 75 ? 'text-green-600' : report.atsScore >= 50 ? 'text-orange-600' : 'text-red-600'}`}>{report.atsScore}%</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Match</p>
                    </div>
                    <div className="flex w-full">
                      {/* REMOVED View CV BUTTON. Report takes full width. */}
                      <button onClick={() => downloadPDF([{ File: report.fileName || 'N/A', Score: report.atsScore + "%", Strengths: report.strengths?.join(", ") || 'None', Weaknesses: report.weaknesses?.join(", ") || 'None' }], `ATS_Report_${report.userId?.name || 'Candidate'}`, "ATS Analysis Report")} className="w-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-100 transition"><FaDownload size={12} /> Download Report</button>
                    </div>
                  </div>
                </div>
              ))}
              {analyzedResumes.length === 0 && <div className="text-slate-400 p-10 text-center bg-white rounded-3xl border border-slate-100">No ATS Reports found.</div>}
            </div>
          )}

          {/* INTERVIEWS TAB */}
          {activeTab === 'interviews' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3"><FaComments className="text-pink-500" /> Mock Interview Logs</h2>
                <div className="flex gap-3">
                  <button onClick={() => downloadCSV(interviews.map(i => ({ Candidate: i.user?.name || 'Candidate', Status: i.status, Date: new Date(i.createdAt).toLocaleDateString() })), 'Interview_Logs')} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-100 transition-colors shadow-sm border border-green-100"><FaFileExcel /> Export CSV</button>
                  <button onClick={() => downloadPDF(interviews.map(i => ({ Candidate: i.user?.name || 'Candidate', Status: i.status, Date: new Date(i.createdAt).toLocaleDateString() })), 'Interview_Logs', 'Mock Interview Reports')} className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors shadow-sm border border-red-100"><FaDownload /> Export PDF</button>
                </div>
              </div>
              {interviews.map(interview => (
                <div key={interview._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 ${interview.status === 'Completed' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-orange-50 text-orange-500 border-orange-100'}`}>
                      <FaComments />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{interview.user?.name || "Candidate"}</h3>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md ${interview.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{interview.status}</span>
                    </div>
                  </div>
                  {interview.status === 'Completed' && (
                    <div className="flex shrink-0">
                      <button onClick={() => generateInterviewPDF(interview)} className="w-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-100 transition">
                        <FaDownload size={12} /> Download Report
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {interviews.length === 0 && <div className="text-slate-400 p-10 text-center bg-white rounded-3xl border border-slate-100">No interview records found.</div>}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <AdminSettings userInfo={userInfo} setUserInfo={setUserInfo} />
          )}

        </div>
      </main>

      {/* --- FULL PAGE MODALS (ADD, EDIT) --- */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-3xl mx-auto mt-10 md:mt-20 mb-20 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><FaPlus size={24} /></div>
                Register New Student
              </h2>
              <button onClick={() => setIsAddingStudent(false)} className="text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-3 rounded-full transition-colors"><FaTimes size={20} /></button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Full Name</label>
                <input type="text" value={addFormData.name} onChange={e => setAddFormData({ ...addFormData, name: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" required placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Email Address</label>
                <input type="email" value={addFormData.email} onChange={e => setAddFormData({ ...addFormData, email: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" required placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Contact Number</label>
                  <input type="text" value={addFormData.contact} onChange={e => setAddFormData({ ...addFormData, contact: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="+1 234 567 8900" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">College</label>
                  <input type="text" value={addFormData.college} onChange={e => setAddFormData({ ...addFormData, college: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="University Name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Course</label>
                  <input type="text" value={addFormData.course} onChange={e => setAddFormData({ ...addFormData, course: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" required placeholder="B.Sc Computer Science" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Temporary Password</label>
                  <input type="text" value={addFormData.password} onChange={e => setAddFormData({ ...addFormData, password: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" required placeholder="Password123!" />
                </div>
              </div>

              <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Register Student</button>
                <button type="button" onClick={() => setIsAddingStudent(false)} className="flex-1 bg-slate-100 text-slate-600 font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-slate-200 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Student Full Page Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-3xl mx-auto mt-10 md:mt-20 mb-20 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FaEdit size={24} /></div>
                Edit Student Record
              </h2>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-3 rounded-full transition-colors"><FaTimes size={20} /></button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Full Name</label>
                <input type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Email Address</label>
                <input type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Contact Number</label>
                  <input type="text" value={editFormData.contact} onChange={e => setEditFormData({ ...editFormData, contact: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">College</label>
                  <input type="text" value={editFormData.college} onChange={e => setEditFormData({ ...editFormData, college: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">Course</label>
                <input type="text" value={editFormData.course} onChange={e => setEditFormData({ ...editFormData, course: e.target.value })} className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>

              <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">Save Changes</button>
                <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 bg-slate-100 text-slate-600 font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-slate-200 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;