import { useState } from "react";
import axios from "axios";
import { FaReact, FaJsSquare, FaNodeJs, FaWhatsapp } from "react-icons/fa";

function ForgotPassword() {
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWhatsAppReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Request the reset link from the backend
      const { data } = await axios.post("http://localhost:5000/api/auth/request-reset", { contact });

      if (data.success) {
        // 2. Format the message for WhatsApp
        const text = `Hello ${data.userName}, here is your Talent Match reset link: ${data.resetUrl}`;
        
        // 3. Open WhatsApp Direct Link
        // Encodes the message to be URL-friendly
        const whatsappUrl = `https://wa.me/91${contact}?text=${encodeURIComponent(text)}`;
        
        setMessage("Opening WhatsApp...");
        window.open(whatsappUrl, "_blank");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "User not found or server error.");
    } finally {
      setLoading(false);
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

      {/* REQUEST CARD */}
      <form 
        onSubmit={handleWhatsAppReset} 
        className="relative z-10 w-full max-w-md p-10 rounded-[2.5rem] bg-white/90 backdrop-blur-3xl border border-zinc-200 shadow-xl"
      >
        <h2 className="text-3xl font-black text-center text-sky-500 mb-2 uppercase tracking-tighter">
          Account Recovery
        </h2>
        <p className="text-center text-zinc-500 mb-8 text-sm">
          Enter your registered number to get a link via WhatsApp
        </p>

        {message && (
          <p className="text-center text-sky-500 mb-4 font-bold text-xs uppercase tracking-widest animate-pulse">
            {message}
          </p>
        )}

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Contact Number (e.g. 9876543210)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="w-full p-4 bg-white border border-zinc-200 rounded-2xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
          />
          <FaWhatsapp className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-xl" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black rounded-2xl hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {loading ? "Processing..." : "Get Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;