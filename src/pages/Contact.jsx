import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const neonToastStyle = {
  background: "#ffffff",
  color: "#db2777",
  border: "1px solid rgba(14,165,233,0.2)",
  boxShadow: "0 0 20px rgba(14,165,233,0.1), inset 0 0 20px rgba(14,165,233,0)",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: "700",
  borderRadius: "16px",
  fontSize: "14px",
};
const toastOptions = { position: "top-right", autoClose: 4000, style: neonToastStyle };
const showToast = {
  success: (msg) => toast.success(msg, { ...toastOptions, icon: "✅", progressStyle: { background: "linear-gradient(90deg, #db2777, #e11d48)" } }),
  error: (msg) => toast.error(msg, { ...toastOptions, icon: "❌", style: { ...neonToastStyle, color: "#f87171", border: "1px solid rgba(248,113,113,0.4)" }, progressStyle: { background: "linear-gradient(90deg, #f87171, #fb923c)" } }),
};

const AnimatedBackground = () => (<div className="fixed inset-0 pointer-events-none z-0"></div>);

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setSubmitted(true);
      showToast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error(error);
      showToast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative flex text-zinc-800 overflow-hidden">
      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeButton={true} toastStyle={neonToastStyle} style={{ zIndex: 99999 }} />
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT COPY */}
        <div>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-500 text-xs font-black uppercase tracking-[0.25em] mb-8">
            <MessageSquare size={14} /> Contact Support
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            GET IN <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500 drop-shadow-sm">TOUCH</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed">
            Have questions about our AI platform, career tools, or enterprise plans? Drop us a line. We're here to accelerate your career.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white shadow-sm border border-zinc-200 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Email Us</p>
                <p className="text-sm text-zinc-800">support@talentmatch.ai</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white shadow-sm border border-zinc-200 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Call Us</p>
                <p className="text-sm text-zinc-800">+1 (555) 000-0000</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white shadow-sm border border-zinc-200 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Global HQ</p>
                <p className="text-sm text-zinc-800">CIMDR College Campus, Tech Leaders 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-200 shadow-xl relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
          
          <h2 className="text-2xl font-black uppercase tracking-widest mb-8 text-zinc-800">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 focus:bg-cyan-50 transition-all text-zinc-800" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 focus:bg-cyan-50 transition-all text-zinc-800" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Your Message</label>
              <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={5}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-4 text-sm outline-none resize-none focus:border-cyan-500 focus:bg-cyan-50 transition-all custom-scrollbar text-zinc-800" placeholder="How can we help you today?" />
            </div>

            <button type="submit" disabled={loading || submitted}
              className={`w-full mt-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex justify-center items-center gap-2 ${
                submitted ? 'bg-green-500 border border-green-400 text-zinc-800 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 
                'bg-gradient-to-r from-cyan-500 to-purple-500 text-zinc-800 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'
              }`}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : submitted ? "Message Sent!" : <><Send size={16} /> Send Message</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
