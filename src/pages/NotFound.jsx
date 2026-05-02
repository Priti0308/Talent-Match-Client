import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCompass, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-800 relative overflow-hidden font-sans" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap');
      `}</style>
      
      {/* Background Glows */}
      
      

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl text-center relative z-10 px-6"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-8xl md:text-9xl mb-8 drop-shadow-[0_0_40px_rgba(236,72,153,0.5)] text-sky-400"
        >
          <FaCompass />
        </motion.div>
        
        <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tighter leading-none">
          4<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">0</span>4
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-zinc-700">
           Oops! Looks like your career path took a <span className="text-pink-400">wrong turn.</span>
        </h2>
        
        <p className="text-zinc-500 mb-12 text-base md:text-lg max-w-xl mx-auto">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. 
          Let's get you back on track to your dream job.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold text-sm md:text-lg rounded-2xl hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] transition-all flex items-center gap-3 mx-auto uppercase tracking-widest"
        >
          <FaArrowLeft /> Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
