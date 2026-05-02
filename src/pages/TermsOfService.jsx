import React from "react";
import { motion } from "framer-motion";
import { FaFileContract } from "react-icons/fa";

function TermsOfService() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-800 overflow-hidden py-32 px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #E13E8C 0%, transparent 65%)", filter: "blur(80px)" }} />
      

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-sky-400/10 border border-sky-400/30 rounded-3xl mx-auto flex items-center justify-center text-4xl text-pink-400 mb-8 shadow-[0_0_30px_rgba(225,62,140,0.3)]"
          >
            <FaFileContract />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-black mb-6">Terms of Service</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-zinc-500 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white shadow-sm border border-zinc-200 rounded-3xl p-8 md:p-12"
        >
          <div className="space-y-8 text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using the Talent Match platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">2. Use of AI Services</h2>
              <p>Our platform provides AI-driven resume analysis and mock interviews. You acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-500">
                <li>AI evaluations are for educational and preparation purposes only.</li>
                <li>We do not guarantee job placement or interview success.</li>
                <li>You will not use the AI services to generate malicious, illegal, or inappropriate content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">3. User Accounts</h2>
              <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">4. Intellectual Property</h2>
              <p>The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Talent Match and its licensors.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">5. Termination</h2>
              <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TermsOfService;
