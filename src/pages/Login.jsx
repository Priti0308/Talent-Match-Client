import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaPython,
  FaJava, FaPhp, FaGitAlt, FaGithub, FaDocker, FaBootstrap,
  FaAngular, FaVuejs, FaSass,
  FaEye, FaEyeSlash // Icons for Show/Hide
} from "react-icons/fa";

import {
  SiMongodb, SiExpress, SiMysql, SiPostgresql, SiTailwindcss,
  SiVite, SiFirebase, SiNextdotjs,
} from "react-icons/si";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Keep your existing line (it's good for storing the user's role)
      localStorage.setItem("userInfo", JSON.stringify(data));

      // 🚨 ADD THIS NEW LINE: Save the token explicitly!
      localStorage.setItem("token", data.token);

      const role = data.user.role;

      if (role === "superadmin") {
        navigate("/super-admin");
      }
      else if (role === "admin") {
        navigate("/admin");
      }
      else if (role === "user") {
        navigate("/");
      }
      else {
        navigate("/home");
      }

    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid Credentials";

      alert(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden px-4 md:px-12 py-10" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* 🌌 FAINT Animated Gradient Background - REMOVED (Handled by App.jsx) */}
      <div className="absolute inset-0 pointer-events-none z-0"></div>

      {/* 🚀 HIGHER VISIBILITY Floating Icons */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
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
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-16 md:bg-white/40 md:backdrop-blur-3xl md:border border-white md:p-12 md:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

        {/* LEFT COLUMN: Animated Target Robot */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 relative group">
          <div className="absolute inset-0 bg-sky-400/10 rounded-full blur-[100px] group-hover:bg-sky-400/15 transition-all duration-700 pointer-events-none"></div>

          {/* LOGIN IMAGE */}
          <img src="/img/login.png" alt="Login" className="w-full max-w-lg drop-shadow-[0_20px_40px_rgba(14,165,233,0.2)] z-10" />

          <h2 className="text-4xl font-black text-zinc-800 mt-8 tracking-tighter text-center opacity-90">
            Welcome Back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">TalentMatch</span>
          </h2>
          <p className="text-zinc-500 text-lg mt-4 text-center max-w-md font-medium">Welcome back! Login to your account to continue building your career.</p>
        </div>

        {/* RIGHT COLUMN: Faint Pink Gradient Form */}
        <div className="w-full md:w-1/2 flex justify-center z-10">
          <div className="w-full max-w-lg p-[1px] rounded-[2.5rem] bg-gradient-to-br from-pink-200 via-rose-100 to-pink-200 shadow-sm hover:shadow-md transition-shadow duration-500">
            <form
              onSubmit={handleSubmit}
              className="w-full h-full p-10 md:p-14 rounded-[2.4rem] bg-white/90 backdrop-blur-3xl flex flex-col"
            >
              <div className="md:hidden block text-center mb-8">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">TalentMatch</h2>
                <p className="text-zinc-500 text-lg mt-2 font-medium">Login to your dashboard</p>
              </div>

              <div className="mb-6">
                <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 px-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-white border border-zinc-200 rounded-2xl text-lg text-zinc-800 font-medium focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-sky-400/20 focus:bg-sky-50/30 transition-all placeholder-zinc-300"
                />
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center px-1 mb-2">
                  <label className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-bold text-sky-400 hover:text-sky-500 tracking-wider transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••"
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-white border border-zinc-200 rounded-2xl text-lg tracking-widest text-zinc-800 font-medium focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-sky-400/20 focus:bg-sky-50/30 transition-all placeholder-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-sky-500 scale-125 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 mt-6 text-white text-lg bg-gradient-to-r from-sky-400 to-blue-500 font-bold uppercase tracking-widest rounded-2xl hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                Login
              </button>

              <p className="mt-8 text-center text-zinc-500 text-base font-medium">
                Don’t have an account?{" "}
                <Link to="/register" className="text-sky-500 font-bold hover:text-rose-600 hover:underline transition-colors drop-shadow-sm">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;