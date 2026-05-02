import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaSignInAlt, FaUserPlus, FaChevronDown, FaRobot, FaFileCode, FaSignOutAlt, FaUser } from "react-icons/fa";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status on load and route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    // Ensure token exists and is not the literal string "undefined"
    const isValidToken = token && token !== "undefined" && token !== "null";
    const hasUserInfo = userInfo && userInfo !== "undefined" && userInfo !== "null";
    setIsLoggedIn(isValidToken || hasUserInfo);

    if (hasUserInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setUserProfile(parsed.user || parsed);
      } catch (e) {}
    } else {
      setUserProfile(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && userInfo !== 'undefined' && userInfo !== 'null') {
        try {
          const parsed = JSON.parse(userInfo);
          setUserProfile(parsed.user || parsed);
        } catch (e) {}
      }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Intercept clicks on protected routes
  const handleProtectedAction = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Stop navigation
      setShowAuthModal(true);
    }
  };

  // Updated NavLink to accept an optional click handler
  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="relative group px-6 py-4 flex items-center overflow-hidden transition-all duration-300"
    >
      <span className="absolute inset-0 bg-zinc-50 opacity-0 group-hover:opacity-100 rounded-xl border border-white/0 group-hover:border-zinc-200 transition-all duration-300 z-0"></span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-sky-500 group-hover:w-2/3 transition-all duration-300 shadow-none"></span>
      <span className="relative z-10 hover:text-sky-500 transition-colors duration-300">
        {children}
      </span>
    </Link>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-zinc-200 shadow-sm"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="w-full px-6 md:px-10 h-24 flex items-center justify-between">

          {/* --- BRAND LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-300">
              <FaRocket className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-zinc-800 uppercase group-hover:text-sky-500 transition-colors duration-300">
              Talent Match
            </span>
          </Link>

          {/* --- NAVIGATION LINKS --- */}
          <div className="hidden md:flex items-center gap-2 text-base font-black uppercase tracking-[0.2em] text-zinc-600">
            <NavLink to="/">Home</NavLink>
            {isLoggedIn && <NavLink to="/dashboard">Dashboard</NavLink>}
            {/* FEATURES DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="relative group px-6 py-4 flex items-center gap-2 hover:text-sky-500 transition-all duration-300">
                <span className="absolute inset-0 bg-zinc-50 opacity-0 group-hover:opacity-100 rounded-xl border border-white/0 group-hover:border-zinc-200 transition-all duration-300 z-0"></span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-sky-400 group-hover:w-2/3 transition-all duration-300 shadow-none"></span>
                <span className="relative z-10 flex items-center gap-2">
                  Features <FaChevronDown className={`text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute top-full left-0 w-64 mt-3 bg-white/95 backdrop-blur-3xl border border-zinc-200 rounded-[2rem] overflow-hidden shadow-xl p-2"
                  >
                    {/* Added handleProtectedAction to Dropdown Links */}
                    <Link to="/resume" onClick={handleProtectedAction} className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-sky-500/10 hover:text-sky-500 transition-all group">
                      <FaFileCode className="text-xl text-sky-500 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black uppercase tracking-widest">Resume ATS</span>
                    </Link>
                    <Link to="/interview" onClick={handleProtectedAction} className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-sky-500/10 hover:text-sky-500 transition-all group">
                      <FaRobot className="text-xl text-sky-500 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black uppercase tracking-widest">Mock Interview</span>
                    </Link>
                    <Link to="/resume-builder" onClick={handleProtectedAction} className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-purple-500/10 hover:text-purple-400 transition-all group">
                      <FaFileCode className="text-xl text-purple-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black uppercase tracking-widest">Resume Builder</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Authenticated Links */}

            <NavLink to="/career-path" onClick={handleProtectedAction}>Pathways</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
          </div>

          {/* --- AUTH BUTTONS --- */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <div className="flex items-center gap-3 px-2 py-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600 overflow-hidden shadow-sm">
                    {userProfile?.avatar ? (
                      <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-3xl border border-zinc-200 rounded-2xl overflow-hidden shadow-xl p-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-zinc-100 mb-2">
                        <p className="text-sm font-bold text-zinc-800 truncate">{userProfile?.name || "User"}</p>
                        <p className="text-xs text-zinc-500 truncate">{userProfile?.email || ""}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/dashboard', { state: { openProfile: true, editProfile: true } });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-sky-500 transition-colors text-sm font-bold tracking-wide"
                      >
                        <FaUser className="text-lg shrink-0" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold tracking-wide"
                      >
                        <FaSignOutAlt className="text-lg shrink-0" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-xs font-black text-sky-500 hover:text-sky-500 transition-colors px-6 py-3 uppercase tracking-widest"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-8 py-4 bg-sky-500 text-white font-black text-xs rounded-2xl hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] hover:scale-105 transition-all uppercase tracking-[0.2em]"
                >
                  <FaUserPlus /> Join Now
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* --- AUTHENTICATION MODAL POPUP --- */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-blue-400"></div>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400/10 to-blue-400/10 rounded-2xl flex items-center justify-center border border-zinc-200 shadow-inner">
                  <FaRobot className="text-3xl text-zinc-800 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-center mb-2">Access Restricted</h3>
              <p className="text-zinc-600 text-center mb-8 text-sm leading-relaxed">
                You must log in to an account to access our AI-powered mock interviews, resume builder, and ATS analysis features.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-4 bg-sky-500 hover:bg-sky-500 text-zinc-800 font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] text-center flex items-center justify-center gap-2"
                >
                  <FaSignInAlt /> Go to Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-4 bg-zinc-50 hover:bg-white/10 text-zinc-800 border border-zinc-200 font-bold uppercase tracking-widest text-sm rounded-2xl transition-all text-center"
                >
                  Create an Account
                </Link>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="mt-3 text-gray-500 hover:text-sky-500 text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;