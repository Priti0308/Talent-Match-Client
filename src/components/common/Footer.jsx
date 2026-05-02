import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-transparent text-zinc-800 border-t border-zinc-100 overflow-hidden pt-8 pb-4 mt-auto shadow-[0_-10px_40px_rgb(0,0,0,0.02)]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 mb-4">
          {/* Brand Column */}
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(14,165,233,0.3)] group-hover:scale-110 group-hover:bg-sky-600 transition-all duration-300">
                <FaRocket className="text-white text-3xl" />
              </div>
              <span className="text-4xl font-black tracking-tight text-zinc-800 group-hover:text-sky-500 transition-colors duration-300">
                Talent Match
              </span>
            </Link>
            <p className="text-zinc-600 text-lg leading-relaxed max-w-sm font-medium">
              Decode your resume, conquer AI-powered mock interviews, and land the job of your dreams. Your ultimate career accelerator.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all duration-300 shadow-sm hover:shadow">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-300 shadow-sm hover:shadow">
                <FaLinkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:border-zinc-800 hover:bg-zinc-100 transition-all duration-300 shadow-sm hover:shadow">
                <FaGithub size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all duration-300 shadow-sm hover:shadow">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-black uppercase tracking-[0.2em] text-sky-500">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Student Dashboard</Link>
              <Link to="/resume" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Resume ATS Check</Link>
              <Link to="/interview" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">AI Mock Interview</Link>
              <Link to="/career-path" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Career Pathways</Link>
              <Link to="/contact" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Contact Support</Link>
              <Link to="/help" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Help / FAQ</Link>
            </div>
          </div>

          {/* Legal / Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-black uppercase tracking-[0.2em] text-sky-500">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">About Us</Link>
              <Link to="/privacy-policy" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Privacy Policy</Link>
              <Link to="/terms" className="text-zinc-600 hover:text-sky-500 text-lg font-bold transition-colors w-fit">Terms of Service</Link>
              <Link to="/admin" className="text-zinc-500 hover:text-sky-500 text-base font-bold transition-colors w-fit mt-2">Admin Portal</Link>
            </div>
          </div>

          {/* Contact / Location */}
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-black uppercase tracking-[0.2em] text-sky-500">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-500 shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <p className="text-zinc-700 text-lg font-medium leading-relaxed">CIMDR College Campus<br/>Tech Leaders 2026</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 shrink-0">
                  <FaEnvelope className="text-xl" />
                </div>
                <a href="mailto:support@talentmatch.ai" className="text-zinc-700 font-bold hover:text-blue-500 text-lg transition-colors">support@talentmatch.ai</a>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <a href="tel:+1234567890" className="text-zinc-700 font-bold hover:text-slate-500 text-lg transition-colors">+1 (555) 000-0000</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          <p className="text-xs text-zinc-400 font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} Talent Match AI. All rights reserved by Priti & Shweta 
          </p>
          <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
            <div className="relative flex h-2.5 w-2.5 justify-center items-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </div>
            <span className="text-xs text-zinc-600 font-bold uppercase tracking-wider">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
