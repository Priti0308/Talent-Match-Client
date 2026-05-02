import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle, FaChevronDown, FaEnvelope, FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the AI Resume Analyzer work?",
      answer: "Our AI scans your resume against common Applicant Tracking System (ATS) parsers. It evaluates keyword matching, formatting issues, and overall readability, providing you with a score and precise bullet-point suggestions to improve your pass rate."
    },
    {
      question: "Are the Mock Interviews customized for me?",
      answer: "Yes! Our system dynamically generates technical and behavioral questions based on the skills and experiences listed in your profile and the specific role you are applying for."
    },
    {
      question: "Can I download the results of my Mock Interview?",
      answer: "Absolutely. After every interview, you receive a detailed, downloadable PDF report that breaks down your performance, highlights your strengths, and clearly identifies areas where you need to improve."
    },
    {
      question: "Is Talent Match free to use?",
      answer: "Talent Match offers a foundational free tier that includes basic resume analysis and limited interview credits. We also offer premium plans with unlimited access and deep analytics for rigorous preparation."
    },
    {
      question: "How is my data securely handled?",
      answer: "We employ industry-standard encryption for robust security. You can read more about how we handle and protect your personal and analytical data on our Privacy Policy page."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-zinc-800 overflow-hidden py-32 px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Background glow */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #00ffff 0%, transparent 65%)", filter: "blur(90px)" }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #ff00ff 0%, transparent 65%)", filter: "blur(100px)" }} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-sky-50 border border-sky-200 rounded-3xl mx-auto flex items-center justify-center text-4xl text-sky-500 mb-8 shadow-sm"
          >
            <FaQuestionCircle />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
            Help & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">Support Center</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-zinc-500 text-lg">
            Find answers to common questions or reach out to our team directly.
          </motion.p>
        </div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link to="/contact" className="bg-white shadow-sm hover:bg-zinc-50 border border-zinc-200 rounded-3xl p-8 transition-colors flex items-start gap-6 group">
             <div className="w-14 h-14 bg-sky-400/10 rounded-2xl flex items-center justify-center text-sky-400 text-2xl group-hover:scale-110 transition-transform shrink-0">
               <FaEnvelope />
             </div>
             <div>
               <h3 className="text-xl font-bold mb-2">Contact Support</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Reach out directly to our engineering and support team via our contact form.</p>
             </div>
          </Link>
          <Link to="/career-path" className="bg-white shadow-sm hover:bg-zinc-50 border border-zinc-200 rounded-3xl p-8 transition-colors flex items-start gap-6 group">
             <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-2xl group-hover:scale-110 transition-transform shrink-0">
               <FaBookOpen />
             </div>
             <div>
               <h3 className="text-xl font-bold mb-2">Read Guides</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">Explore structured roadmaps and guides in our Career Pathways section.</p>
             </div>
          </Link>
        </motion.div>

        {/* FAQ Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest text-zinc-800">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-zinc-200 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-bold transition-colors ${openIndex === index ? 'text-sky-500' : 'text-zinc-800'}`}>
                    {faq.question}
                  </span>
                  <FaChevronDown className={`text-zinc-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-sky-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-zinc-500 text-sm leading-relaxed border-t border-zinc-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Help;
