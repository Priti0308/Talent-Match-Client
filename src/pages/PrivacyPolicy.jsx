import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserSecret } from "react-icons/fa";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-800 overflow-hidden py-32 px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-sky-50 border border-sky-200 rounded-3xl mx-auto flex items-center justify-center text-4xl text-sky-500 mb-8 shadow-sm"
          >
            <FaUserSecret />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-black mb-6">Privacy Policy</motion.h1>
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
              <h2 className="text-2xl font-bold text-zinc-800 mb-4 flex items-center gap-3"><FaShieldAlt className="text-sky-500" /> Information We Collect</h2>
              <p className="mb-4">We collect information you provide directly to us when you create an account, build a resume, or use our AI interview services. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-500">
                <li>Personal identifiers (Name, Email, Phone number)</li>
                <li>Professional information (Education, Work experience, Skills)</li>
                <li>Audio recordings (from Mock Interviews, only if explicitly permitted)</li>
                <li>Usage data and Analytics metrics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">How We Use Your Data</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-500">
                <li>Provide, evaluate, and improve our AI career services</li>
                <li>Analyze resumes to generate ATS matching scores</li>
                <li>Generate hyper-realistic AI interview questions based on your background</li>
                <li>Communicate with you regarding updates, support, and administrative messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">Data Security</h2>
              <p>We implement strict security measures to ensure the confidentiality of your personal and professional data. Your data is encrypted in transit and at rest. We do not sell your personal data to third-party data brokers or marketing agencies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-800 mb-4">Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time. You can manage your data preferences from your account dashboard or by contacting our support team.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
