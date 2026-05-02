import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";


import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaPython,
  FaJava, FaPhp, FaGitAlt, FaGithub, FaDocker, FaBootstrap,
  FaAngular, FaVuejs, FaSass,
  FaUserGraduate, FaChalkboardTeacher, FaEye, FaEyeSlash
} from "react-icons/fa";

import {
  SiMongodb, SiExpress, SiMysql, SiPostgresql, SiTailwindcss,
  SiVite, SiFirebase, SiNextdotjs,
} from "react-icons/si";

function Register() {
  const navigate = useNavigate();
  // 🚨 1. Add searchParams to grab the referral code from the URL
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    college: "",
    course: "",
    // 🚨 2. Auto-fill the code if they clicked an invite link
    teacherCode: searchParams.get("ref") || "",
    role: "user", // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase character.";
    if (!/[0-9]/.test(password)) return "Password must contain at least 1 number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least 1 special symbol.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const passError = validatePassword(formData.password);
    if (passError) {
      setErrorMsg(passError);
      return;
    }

    const dataToSend = { ...formData };
    delete dataToSend.confirmPassword;

    // If it's an admin registering, they don't need a teacherCode attached to them
    if (dataToSend.role === "admin") {
      delete dataToSend.teacherCode;
    }

    try {
      await axios.post("https://talent-match-9rsc.onrender.com/api/auth/register", dataToSend);
      setSuccessMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration Failed");
    }
  };

  // 🚨 3. Add teacherCode to the array of fields
  const allFields = ["name", "email", "contact", "college", "course", "teacherCode", "password", "confirmPassword"];

  // Teachers don't have courses and they don't use invite codes (they generate them!)
  const visibleFields = formData.role === "admin"
    ? allFields.filter(field => field !== "course" && field !== "teacherCode")
    : allFields;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-x-hidden py-10 px-4 md:px-12 object-contain" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* 🌌 FAINT Animated Gradient Background - REMOVED */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0"></div>

      {/* 🚀 HIGHER VISIBILITY Floating Tech Icons */}
      <div className="fixed inset-0 pointer-events-none opacity-80 z-0">
        <FaReact className="icon large text-cyan-400 top-[12%] left-[8%]" />
        <FaHtml5 className="icon medium text-orange-500 top-[40%] left-[5%]" />
        <FaCss3Alt className="icon medium text-blue-500 top-[78%] left-[25%]" />
        <FaJsSquare className="icon large text-yellow-400 top-[22%] left-[72%]" />
        <FaBootstrap className="icon small text-purple-600 top-[60%] left-[15%]" />
        <FaAngular className="icon small text-red-600 top-[15%] left-[50%]" />
        <FaVuejs className="icon small text-green-400 top-[85%] left-[60%]" />
        <FaSass className="icon small text-pink-400 top-[30%] left-[88%]" />
        <SiTailwindcss className="icon medium text-cyan-400 top-[50%] left-[45%]" />
        <SiNextdotjs className="icon small text-zinc-400 top-[10%] left-[30%]" />
        <SiVite className="icon small text-purple-400 top-[75%] left-[80%]" />

        <FaNodeJs className="icon large text-green-500 top-[70%] left-[82%]" />
        <SiExpress className="icon small text-zinc-500 top-[65%] left-[55%]" />
        <FaPython className="icon medium text-yellow-500 top-[35%] left-[65%]" />
        <FaJava className="icon medium text-red-500 top-[18%] left-[85%]" />
        <FaPhp className="icon small text-indigo-400 top-[55%] left-[75%]" />
        <FaDocker className="icon medium text-blue-400 top-[88%] left-[10%]" />
        <FaGitAlt className="icon small text-orange-600 top-[5%] left-[65%]" />
        <FaGithub className="icon small text-zinc-400 top-[95%] left-[40%]" />

        <SiMongodb className="icon medium text-green-600 top-[45%] left-[20%]" />
        <SiMysql className="icon small text-blue-500 top-[28%] left-[58%]" />
        <SiPostgresql className="icon small text-blue-300 top-[82%] left-[48%]" />
        <SiFirebase className="icon small text-yellow-500 top-[38%] left-[92%]" />
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row-reverse items-center justify-between gap-16 md:bg-white/40 md:backdrop-blur-3xl md:border border-white md:p-12 md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

        {/* RIGHT COLUMN: Infographic AI Robot */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 relative group">
          {/* Faint Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-blue-500/10 rounded-full blur-[100px] group-hover:from-sky-400/15 group-hover:to-blue-500/15 transition-all duration-700 pointer-events-none"></div>

          {/* REGISTER IMAGE */}
          <img src="/img/sign-up.png" alt="Register" className="w-full max-w-lg drop-shadow-[0_20px_40px_rgba(14,165,233,0.2)] z-10" />

          <h2 className="text-4xl font-black text-zinc-800 mt-8 tracking-tighter text-center opacity-90">
            Create Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">Account</span>
          </h2>
          <p className="text-zinc-500 text-lg mt-4 text-center max-w-md font-medium px-4">
            Join TalentMatch today to build your resume, practice interviews, and boost your career.
          </p>
        </div>

        {/* LEFT COLUMN: Faint Pink Gradient Form */}
        <div className="w-full md:w-1/2 flex justify-center z-10">
          {/* Faint form border wrapper */}
          <div className="w-full max-w-xl p-[1px] rounded-[2.5rem] bg-gradient-to-br from-pink-200 via-rose-100 to-pink-200 shadow-sm hover:shadow-md transition-shadow duration-500">
            <form
              onSubmit={handleSubmit}
              className="w-full h-full p-10 md:p-14 rounded-[2.4rem] bg-white/90 backdrop-blur-3xl flex flex-col"
            >
              <div className="md:hidden block text-center mb-8">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">Register</h2>
                <p className="text-zinc-500 text-lg mt-2 font-medium">Create your account</p>
              </div>

              {successMsg && (
                <p className="text-center text-green-600 text-base font-bold tracking-widest uppercase mb-6 animate-pulse p-4 rounded-xl border border-green-200 bg-green-50">
                  {successMsg}
                </p>
              )}

              {errorMsg && (
                <p className="text-center text-red-600 text-sm font-bold tracking-wide uppercase mb-6 p-4 rounded-xl border border-red-200 bg-red-50">
                  {errorMsg}
                </p>
              )}

              {/* --- ROLE SELECTION TAB --- */}
              <div className="flex bg-zinc-50 p-1.5 rounded-2xl border border-zinc-200 mb-8 relative">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "user" })}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm uppercase tracking-widest font-bold transition-all ${formData.role === "user"
                      ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm"
                      : "text-zinc-500 hover:text-sky-500"
                    }`}
                >
                  <FaUserGraduate className="text-lg opacity-80" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm uppercase tracking-widest font-bold transition-all ${formData.role === "admin"
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm"
                      : "text-zinc-500 hover:text-rose-600"
                    }`}
                >
                  <FaChalkboardTeacher className="text-lg opacity-80" /> Teacher
                </button>
              </div>

              {/* Scrollable Form Container */}
              <div className="max-h-[48vh] overflow-y-auto px-2 space-y-5 custom-scrollbar pr-3 mb-2">
                {visibleFields.map((field, index) => (
                  <div key={index} className="relative group">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-zinc-500 group-hover:text-sky-500 transition-colors">
                      {field === "name" ? "Full Name" :
                        field === "email" ? "Email Address" :
                          field === "contact" ? "Contact Number" :
                            field === "college" ? "College Name" :
                              field === "course" ? "Course Details" :
                                field === "teacherCode" ? "Teacher Invite Code (Optional)" :
                                  field === "password" ? "Password" : "Confirm Password"}
                    </label>
                    <input
                      type={field.toLowerCase().includes("password") ? (showPassword ? "text" : "password") : field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      placeholder={
                        field === "name" ? "e.g. John Doe" :
                          field === "email" ? "user@example.com" :
                            field === "contact" ? "+1 234 567 8900" :
                              field === "college" ? "e.g. College Name" :
                                field === "course" ? "e.g. Master of Computer Applications" :
                                  field === "teacherCode" ? "e.g. PROF-ABC123" : "••••••••••••"
                      }
                      onChange={handleChange}
                      required={field !== "teacherCode"} // 🚨 Invite code is strictly optional
                      className={`w-full p-4 bg-white border border-zinc-200 rounded-2xl text-lg text-zinc-800 font-medium focus:outline-none focus:ring-1 transition-all placeholder-zinc-300
                        ${formData.role === "admin"
                          ? "focus:border-rose-400 focus:ring-rose-500/20 focus:bg-rose-50/30"
                          : "focus:border-pink-400 focus:ring-sky-400/20 focus:bg-sky-50/30"}
                        ${field === "teacherCode" && searchParams.get("ref") ? "border-pink-400 shadow-[0_4px_15px_rgba(14,165,233,0.15)]" : ""}  
                      `}
                    />

                    {/* 🚨 Glow effect message if auto-filled via link */}
                    {field === "teacherCode" && searchParams.get("ref") && (
                      <p className="absolute -bottom-6 left-1 text-sky-500 text-xs font-bold tracking-widest uppercase animate-pulse">
                        ✨ Code auto-applied from invite link!
                      </p>
                    )}

                    {field.toLowerCase().includes("password") && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 bottom-4 text-zinc-400 hover:text-sky-500 scale-125 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className={`w-full py-5 mt-6 text-white font-bold text-lg uppercase tracking-widest rounded-2xl hover:-translate-y-0.5 transition-all duration-300 shadow-md border border-zinc-200
                  ${formData.role === "admin"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)]"
                    : "bg-gradient-to-r from-sky-400 to-blue-500 hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)]"}`}
              >
                {formData.role === "admin" ? "Register as Teacher" : "Register as Student"}
              </button>

              <p className="mt-8 text-center text-zinc-500 text-base font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-500 font-bold hover:text-rose-600 hover:underline transition-colors drop-shadow-sm">
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>

      {/* Scrollbar style */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(14,165,233,0.4); }
      `}} />
    </div>
  );
}

export default Register;