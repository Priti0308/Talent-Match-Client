import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaReact, FaJsSquare, FaNodeJs, FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint updated to match your auth flow
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { newPassword });
      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Session expired or invalid token.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {/* 🌌 ORIGINAL Animated Gradient & Icons */}
      
      
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <FaReact className="icon large text-sky-500 top-[12%] left-[8%]" />
        <FaJsSquare className="icon large text-yellow-400 top-[22%] left-[72%]" />
        <FaNodeJs className="icon large text-green-500 top-[70%] left-[82%]" />
      </div>

      {/* RESET CARD */}
      <form 
        onSubmit={handleSubmit} 
        className="relative z-10 w-full max-w-md p-10 rounded-[2.5rem] bg-white/90 backdrop-blur-3xl border border-zinc-200 shadow-xl"
      >
        <h2 className="text-3xl font-black text-center text-sky-500 mb-2 uppercase tracking-tighter">
          New Password
        </h2>
        <p className="text-center text-zinc-500 mb-8 text-sm">
          Secure your account with a fresh credential
        </p>

        {message && (
          <p className="text-center text-sky-400 mb-4 font-bold text-xs uppercase tracking-widest animate-pulse">
            {message}
          </p>
        )}

        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-4 bg-white border border-zinc-200 rounded-2xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-sky-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black rounded-2xl hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-xs"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;