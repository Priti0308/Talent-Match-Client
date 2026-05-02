import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaUserGraduate, FaCode, FaChartLine } from "react-icons/fa";

function About() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-800 overflow-hidden py-32 px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #6C3CE1 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #3EC8E1 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sky-500 text-sm font-bold tracking-[0.3em] uppercase mb-3"
          >
            Our Mission
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
          >
            Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">Tech Leaders</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Talent Match is an AI-powered career accelerator designed to bridge the gap between academic learning and industry expectations. We decode resumes, simulate real-world interviews, and help you land the job of your dreams.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-rose-100 rounded-3xl blur-2xl"></div>
            <div className="bg-white shadow-sm border border-zinc-200 p-10 rounded-3xl relative z-10">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-4"><FaRocket className="text-sky-400" /> The Vision</h3>
              <p className="text-zinc-500 leading-relaxed mb-6">
                Founded by Priti & Shweta for the CIMDR Tech Leaders 2026 initiative, Talent Match was born out of a simple observation: students have the skills, but lack the tools to effectively present them to employers.
              </p>
              <p className="text-zinc-500 leading-relaxed">
                We leverage cutting-edge AI to provide instant feedback on resumes and conduct hyper-realistic mock interviews, transforming nervous candidates into confident professionals.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { title: "Students Guided", count: "10K+", icon: <FaUserGraduate />, color: "pink" },
              { title: "Resumes Analyzed", count: "50K+", icon: <FaCode />, color: "pink" },
              { title: "Interviews Hosted", count: "25K+", icon: <FaChartLine />, color: "rose" },
              { title: "Success Rate", count: "95%", icon: <FaRocket />, color: "pink" },
            ].map((stat, i) => (
              <div key={i} className={`bg-white shadow-sm border border-zinc-200 p-8 rounded-3xl text-center hover:bg-zinc-50 hover:shadow-md transition-all border-b-4 border-b-${stat.color}-500/50`}>
                <div className={`text-4xl text-${stat.color}-400 mb-4 flex justify-center drop-shadow-[0_0_15px_currentColor]`}>{stat.icon}</div>
                <div className="text-3xl font-black mb-2">{stat.count}</div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.title}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Join the Career Revolution</h2>
          <button className="px-10 py-5 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black rounded-full hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3 mx-auto">
            Get Started For Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
