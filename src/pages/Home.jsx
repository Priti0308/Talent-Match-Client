import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-transparent overflow-x-hidden text-zinc-800 font-sans selection:bg-violet-200 selection:text-violet-900" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ⚡ HERO SECTION (TWO COLUMNS) */}
      <div className="relative z-20 pt-32 pb-24 px-6 min-h-[calc(100vh-6rem)] max-w-[1500px] mx-auto flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 w-full">

          {/* Left Column: Image Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full lg:w-1/2 relative z-10"
          >
            <div className="w-full max-w-3xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 backdrop-blur-md p-2 bg-white/40 transform">
              <img src="/img/home.png" alt="TalentMatch Dashboard" className="w-full h-auto rounded-2xl drop-shadow-xl" />
            </div>
          </motion.div>

          {/* Right Column: Text Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left relative z-20 w-full lg:w-1/2">
            {/* Top Badge */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8 px-6 py-3 rounded-full bg-white/90 border border-sky-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-all cursor-pointer w-fit mx-auto lg:mx-0 backdrop-blur-md">
              <span className="flex h-3 w-3 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-zinc-600 text-sm font-bold tracking-wide uppercase">Introducing AI Career Accelerator</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl md:text-7xl lg:text-[5rem] font-black tracking-tight mb-8 leading-[1.1] text-zinc-800 mx-auto lg:mx-0">
              Elevate Your Career with <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">
                Intelligent Talent Match
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl md:text-2xl text-zinc-500 mb-12 max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0">
              The all-in-one platform to optimize your resume, conquer AI mock interviews, and land your dream tech role faster than ever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full sm:w-auto">
              {localStorage.getItem("token") ? (
                <Link to={JSON.parse(localStorage.getItem("userInfo"))?.user?.role === "superadmin" ? "/super-admin" : JSON.parse(localStorage.getItem("userInfo"))?.user?.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-10 py-5 text-lg w-full sm:w-auto bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_8px_25px_rgba(14,165,233,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register"
                  className="px-10 py-5 text-lg w-full sm:w-auto bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_8px_25px_rgba(14,165,233,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                  Start Building Free
                </Link>
              )}

              <Link to="/career-path"
                className="px-10 py-5 text-lg w-full sm:w-auto bg-white border border-zinc-200 text-zinc-700 font-bold rounded-2xl hover:bg-zinc-50 hover:border-sky-200 shadow-sm hover:shadow hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                🧭 Explore Pathways
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      {/* 📊 STATS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="mt-32 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl px-12 py-12 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        {[
          { label: "Active Students", val: "50+", icon: "🎓" },
          { label: "Mock Interviews", val: "200+", icon: "💬" },
          { label: "Success Rate", val: "95%", icon: "🏆" },
          { label: "Hiring Partners", val: "50+", icon: "🏢" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl mb-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">{stat.icon}</div>
            <div className="text-5xl font-black mb-2 text-zinc-800 tracking-tight">{stat.val}</div>
            <div className="text-sm uppercase tracking-wider text-zinc-500 font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🚀 SECTION: HOW IT WORKS */}
      <div className="relative z-20 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-sky-500 text-lg font-bold tracking-widest uppercase mb-4">Streamlined Process</motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black tracking-tight text-zinc-800">How TalentMatch Works</motion.h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {[
              { step: "1️⃣", title: "Build & Scan", desc: "Upload your resume for AI ATS scanning, or use our intelligent builder to construct a guaranteed-match CV from scratch." },
              { step: "2️⃣", title: "Battle AI Recruiters", desc: "Jump into a live voice room. Our highly intelligent AI agent will ask you technical & HR questions dynamically based on your skills." },
              { step: "3️⃣", title: "Get Hired", desc: "Review your comprehensive post-interview metrics. Fix your weaknesses and confidently nail your real-world job hunts." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -12 }}
                className="flex flex-col p-12 bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(14,165,233,0.1)] transition-all duration-300"
              >
                <div className={`w-20 h-20 rounded-3xl bg-sky-50 flex items-center justify-center text-4xl font-black mb-10`}>
                  {item.step}
                </div>
                <h4 className="text-3xl font-bold mb-5 text-zinc-800">{item.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-lg font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 🚀 SECTION: 5-STEP INTERVIEW FLOW */}
      <div className="relative z-20 py-40 px-6 bg-white/50 backdrop-blur-lg border-y border-zinc-200/60">
        <div className="max-w-[90rem] mx-auto">
          <div className="text-center mb-28">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sky-500 text-lg font-bold tracking-widest uppercase mb-4">Complete Journey</motion.h2>
            <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black tracking-tight text-zinc-800">The Interview Pipeline</motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
            {[
              { step: "1", title: "Scan Resume", icon: "📄" },
              { step: "2", title: "Aptitude Test", icon: "🧠" },
              { step: "3", title: "Tech Interview", icon: "💻" },
              { step: "4", title: "HR Interview", icon: "🗣️" },
              { step: "5", title: "Analytics", icon: "📊" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center text-center relative group p-10 bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300"
              >
                <div className={`w-24 h-24 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-5xl mb-8 group-hover:bg-sky-50 transition-colors duration-300`}>
                  {item.icon}
                </div>
                <div className="absolute top-8 right-8 text-zinc-200 font-black text-6xl group-hover:text-sky-100 transition-colors">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-zinc-800">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ✨ POWERFUL FEATURES SECTION */}
      <div className="relative z-20 py-40 px-6">
        <div className="text-center mb-28">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sky-500 text-lg font-bold tracking-widest uppercase mb-4">Platform Arsenal</motion.h2>
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black tracking-tight text-zinc-800">Powerful Capabilities</motion.h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[90rem] mx-auto">
          {[
            { title: "Resume Analyzer", desc: "Get AI-powered resume insights & ATS matching scores instantly.", icon: "📑" },
            { title: "AI Mock Interview", desc: "Practice with a real-time conversational voice AI acting as a tech lead.", icon: "🤖" },
            { title: "Skill Gap Detector", desc: "Discover exactly what languages and tools are missing from your stack.", icon: "🎯" },
            { title: "Dashboard Analytics", desc: "Track progress, maintain streaks, and export certified metric proofs.", icon: "📈" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`p-12 bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(14,165,233,0.12)] flex flex-col items-start relative overflow-hidden group transition-all duration-300`}
            >
              <div className={`text-5xl mb-8 p-6 bg-zinc-50 rounded-3xl group-hover:bg-sky-100 transition-colors duration-300`}>
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold text-zinc-800 mb-4`}>{feature.title}</h3>
              <p className="text-lg text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🌟 NEW SECTION: WALL OF LOVE / TESTIMONIALS */}
      <div className="relative z-20 py-40 px-6 bg-white/50 backdrop-blur-lg border-t border-zinc-200/60">
        <div className="max-w-[90rem] mx-auto">
          <div className="text-center mb-28">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sky-500 text-lg font-bold tracking-widest uppercase mb-4">Wall of Love</motion.h2>
            <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black tracking-tight text-zinc-800">What Students Say</motion.h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Rahul Sharma", role: "Software Developer, Google", quote: "The Voice AI Interview literally asked me the exact same system design question I encountered at my Google loop. Invaluable." },
              { name: "Priya Desai", role: "Frontend Engineer, Meta", quote: "I thought my resume was perfect until the ATS Checker ripped it apart. I made the suggested changes and got 3 interviews in a week." },
              { name: "Ankit Verma", role: "Cloud Architect, TCS", quote: "The builder took away all the stress of formatting. But the real magic is the mock interviews. It feels brutally real." }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="p-12 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-8 text-base">
                  ⭐ ⭐ ⭐ ⭐ ⭐
                </div>
                <p className="text-zinc-600 leading-relaxed mb-10 text-lg font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 text-lg">{t.name}</h4>
                    <span className="text-sm text-zinc-500 font-bold tracking-wide uppercase">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏁 FINAL CTA & LOGOS */}
      <div className="relative z-20 py-40 bg-sky-500 text-zinc-800 overflow-hidden">
        {/* Footer Animated Shapes */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400 rounded-full opacity-40 blur-[120px] translate-x-1/2 -translate-y-1/4"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-sky-500 rounded-full opacity-40 blur-[120px] -translate-x-1/3 translate-y-1/3"
        />

        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-6xl md:text-7xl font-black mb-10 text-white tracking-tight">Ready to dominate your interviews?</h2>
          <p className="text-sky-100 text-2xl mb-14 max-w-3xl mx-auto font-medium">Join tens of thousands of developers accelerating their careers with AI.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-sky-700 text-xl font-black rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-4 mx-auto"
          >
            Get Started For Free 🚀
          </motion.button>
        </div>

        <div className="mt-40 text-center relative z-10 overflow-hidden w-full pb-10">
          <h2 className="text-sky-200 text-base font-bold uppercase tracking-widest mb-14">Trusted by students placed at</h2>

          {/* Continuous Infinite Marquee Container */}
          <div className="flex w-full relative">
            {/* Fade Gradients for smooth entering/exiting */}
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-sky-500 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-sky-500 to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              className="flex items-center gap-16 md:gap-32 w-max"
            >
              {[
                'Google', 'Microsoft', 'Amazon', 'Meta', 'TCS', 'Netflix', 'Apple', 'Infosys', 'Uber', 'Airbnb',
                'Google', 'Microsoft', 'Amazon', 'Meta', 'TCS', 'Netflix', 'Apple', 'Infosys', 'Uber', 'Airbnb'
              ].map((company, i) => (
                <span
                  key={i}
                  className="text-6xl md:text-8xl font-black tracking-tight text-sky-200 hover:text-white transition-colors duration-300 drop-shadow-sm"
                >
                  {company}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;