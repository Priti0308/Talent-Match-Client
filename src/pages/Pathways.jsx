import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Server, Database, Cloud, Lock, Cpu, Globe, Rocket, ChevronRight, Briefcase, Sparkles, Network, Terminal, LineChart, Target, Building, Users, PlayCircle, X, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PATHWAYS_DATA = [
  // IT TRACKS
  {
    id: "fullstack",
    type: "IT",
    title: "Full-Stack Architecture",
    icon: <Globe className="text-sky-500" />,
    color: "from-cyan-500 to-blue-600",
    description: "Master both client-side interfaces and scalable backend infrastructure.",
    steps: [
      { id: 1, title: "Frontend Foundation", desc: "React, Tailwind, State Management", icon: <Code2 /> },
      { id: 2, title: "Backend Systems", desc: "Node.js, Express, REST APIs", icon: <Server /> },
      { id: 3, title: "Data Layer", desc: "MongoDB, PostgreSQL, ORMs", icon: <Database /> },
      { id: 4, title: "Deployment", desc: "Docker, CI/CD, AWS/Vercel", icon: <Cloud /> },
    ]
  },
  {
    id: "ai-ml",
    type: "IT",
    title: "AI & Machine Learning",
    icon: <Cpu className="text-purple-400" />,
    color: "from-purple-500 to-cyan-600",
    description: "Design neural networks, train models, and deploy intelligent agents.",
    steps: [
      { id: 1, title: "Math & Statistics", desc: "Linear Algebra, Calculus, Probabilities", icon: <Network /> },
      { id: 2, title: "Data Science Core", desc: "Python, Pandas, NumPy", icon: <Database /> },
      { id: 3, title: "Machine Learning", desc: "Scikit-Learn, Regression, Clustering", icon: <Cpu /> },
      { id: 4, title: "Deep Learning", desc: "TensorFlow, PyTorch, LLMs", icon: <Sparkles /> },
    ]
  },
  {
    id: "devsecops",
    type: "IT",
    title: "DevSecOps Engineering",
    icon: <Lock className="text-sky-500" />,
    color: "from-cyan-500 to-purple-600",
    description: "Automate delivery pipelines while maintaining rigid cloud security.",
    steps: [
      { id: 1, title: "Linux & Scripting", desc: "Bash, Servers, Administration", icon: <Terminal /> },
      { id: 2, title: "Containerization", desc: "Docker, Kubernetes orchestration", icon: <Cloud /> },
      { id: 3, title: "CI/CD & Automation", desc: "Jenkins, GitHub Actions, Terraform", icon: <Rocket /> },
      { id: 4, title: "Security Auditing", desc: "Penetration Ops, Zero-Trust Policies", icon: <Lock /> },
    ]
  },
  {
    id: "data-analyst",
    type: "IT",
    title: "Data Analytics",
    icon: <LineChart className="text-blue-400" />,
    color: "from-blue-500 to-cyan-600",
    description: "Transform raw data into strategic business insights.",
    steps: [
      { id: 1, title: "SQL & Databases", desc: "Queries, Joins, Indexing", icon: <Database /> },
      { id: 2, title: "Data Visualization", desc: "Tableau, PowerBI, D3.js", icon: <LineChart /> },
      { id: 3, title: "Statistical Analysis", desc: "A/B Testing, Python, R", icon: <Network /> },
      { id: 4, title: "Business Intelligence", desc: "Dashboards, KPI reporting", icon: <Briefcase /> },
    ]
  },
  {
    id: "cloud-architect",
    type: "IT",
    title: "Cloud Solutions Architect",
    icon: <Cloud className="text-sky-400" />,
    color: "from-sky-500 to-blue-500",
    description: "Design fault-tolerant and highly available cloud infrastructures.",
    steps: [
      { id: 1, title: "Core Networking", desc: "DNS, VPCs, Load Balancing", icon: <Network /> },
      { id: 2, title: "Cloud Providers", desc: "AWS, Azure, Google Cloud", icon: <Cloud /> },
      { id: 3, title: "Infrastructure as Code", desc: "Terraform, CloudFormation", icon: <Code2 /> },
      { id: 4, title: "System Design", desc: "Microservices, Scalability", icon: <Server /> },
    ]
  },
  {
    id: "blockchain",
    type: "IT",
    title: "Blockchain Engineer",
    icon: <Lock className="text-orange-400" />,
    color: "from-orange-500 to-amber-600",
    description: "Develop decentralized applications and smart contracts.",
    steps: [
      { id: 1, title: "Cryptography Basics", desc: "Hashes, Public Key Crypto", icon: <Lock /> },
      { id: 2, title: "Smart Contracts", desc: "Solidity, Ethereum, EVM", icon: <Code2 /> },
      { id: 3, title: "Decentralized Apps (dApps)", desc: "Web3.js, Ethers.js, React", icon: <Globe /> },
      { id: 4, title: "DeFi Protocols", desc: "Liquidity Pools, Staking", icon: <LineChart /> },
    ]
  },

  // MBA TRACKS
  {
    id: "product-mgmt",
    type: "MBA",
    title: "Product Management",
    icon: <Target className="text-amber-400" />,
    color: "from-amber-500 to-orange-600",
    description: "Guide product strategy, user experience, and market fit.",
    steps: [
      { id: 1, title: "Market Research", desc: "User Personas, Competitor Analysis", icon: <Users /> },
      { id: 2, title: "Agile & Scrum", desc: "Roadmaps, Sprints, Backlogs", icon: <Briefcase /> },
      { id: 3, title: "UX / UI Design", desc: "Figma, Wireframing, Prototyping", icon: <Code2 /> },
      { id: 4, title: "Metrics & Launch", desc: "KPIs, A/B Testing, Go-to-Market", icon: <Rocket /> },
    ]
  },
  {
    id: "finance",
    type: "MBA",
    title: "Strategic Finance",
    icon: <LineChart className="text-sky-500" />,
    color: "from-cyan-500 to-red-600",
    description: "Analyze financial models, investments, and corporate strategy.",
    steps: [
      { id: 1, title: "Financial Accounting", desc: "Balance Sheets, Cash Flows, GAAP", icon: <Database /> },
      { id: 2, title: "Valuation Models", desc: "DCF, Comparables, Excel Magic", icon: <LineChart /> },
      { id: 3, title: "Corporate Strategy", desc: "M&A, Restructuring, Scaling", icon: <Building /> },
      { id: 4, title: "Risk Management", desc: "Hedging, Portfolios, Regulations", icon: <Lock /> },
    ]
  },
  {
    id: "marketing",
    type: "MBA",
    title: "Marketing Strategy",
    icon: <Target className="text-purple-400" />,
    color: "from-purple-500 to-cyan-600",
    description: "Drive growth through brand positioning and digital campaigns.",
    steps: [
      { id: 1, title: "Consumer Behavior", desc: "Psychology, Buying Patterns", icon: <Users /> },
      { id: 2, title: "Digital Marketing", desc: "SEO, SEM, Social Media", icon: <Globe /> },
      { id: 3, title: "Brand Management", desc: "Positioning, Messaging", icon: <Target /> },
      { id: 4, title: "Marketing Analytics", desc: "Funnel Conversion, CAC/LTV", icon: <LineChart /> },
    ]
  },
  {
    id: "human-resources",
    type: "MBA",
    title: "Human Resources",
    icon: <Users className="text-yellow-400" />,
    color: "from-yellow-500 to-amber-600",
    description: "Build strong organizational culture and manage talent.",
    steps: [
      { id: 1, title: "Talent Acquisition", desc: "Sourcing, Interviewing", icon: <Target /> },
      { id: 2, title: "Organizational Behavior", desc: "Leadership, Team Dynamics", icon: <Users /> },
      { id: 3, title: "Compensation & Benefits", desc: "Equity, Salary Benchmarking", icon: <LineChart /> },
      { id: 4, title: "HR Analytics", desc: "Retention Rates, Performance", icon: <Database /> },
    ]
  },
  {
    id: "operations",
    type: "MBA",
    title: "Operations Management",
    icon: <Building className="text-stone-400" />,
    color: "from-stone-500 to-neutral-600",
    description: "Optimize supply chains, logistics, and process efficiency.",
    steps: [
      { id: 1, title: "Supply Chain", desc: "Logistics, Vendor Management", icon: <Globe /> },
      { id: 2, title: "Process Optimization", desc: "Lean, Six Sigma", icon: <Terminal /> },
      { id: 3, title: "Inventory Management", desc: "Demand Forecasting, ERPs", icon: <Database /> },
      { id: 4, title: "Quality Control", desc: "TQM, Continuous Improvement", icon: <CheckCircle /> },
    ]
  }
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "When faced with a complex problem, what is your first instinct?",
    options: [
      { text: "Break it down logically and script an automated solution.", value: "devsecops" },
      { text: "Look for trends in historical numbers or logs.", value: "data-analyst" },
      { text: "Think about how it affects the user's overall journey.", value: "product-mgmt" },
      { text: "Calculate the long-term ROI and financial impact.", value: "finance" },
      { text: "Optimize the step-by-step physical or operational process.", value: "operations" }
    ]
  },
  {
    id: "q2",
    question: "What role do you naturally fall into during a team project?",
    options: [
      { text: "The Builder: I physically write the code or build the structure.", value: "fullstack" },
      { text: "The Architect: I map out how the different systems will talk securely.", value: "cloud-architect" },
      { text: "The Visionary: I outline the roadmap and unblock the team.", value: "product-mgmt" },
      { text: "The Promoter: I figure out how to sell it and reach people.", value: "marketing" },
      { text: "The Mediator: I ensure everyone works well together and stays motivated.", value: "human-resources" }
    ]
  },
  {
    id: "q3",
    question: "Which toolkit or concept sounds most exciting to dive into?",
    options: [
      { text: "Neural Networks, Python, and Predictive Models", value: "ai-ml" },
      { text: "Decentralization, Smart Contracts, and Web3", value: "blockchain" },
      { text: "React, MongoDB, and Next.js", value: "fullstack" },
      { text: "SEO strategies, Ad campaigns, and Brand identity", value: "marketing" },
      { text: "Logistics forecasting, Supply chains, and ERPs", value: "operations" }
    ]
  },
  {
    id: "q4",
    question: "If you had an unlimited budget, what would you build?",
    options: [
      { text: "An AI system that can hold a perfect human conversation.", value: "ai-ml" },
      { text: "A massive, infinitely scalable cloud infrastructure for a smart city.", value: "cloud-architect" },
      { text: "The next big disruptive app that changes how people socialize.", value: "product-mgmt" },
      { text: "A global, frictionless, decentralized payment network.", value: "blockchain" },
      { text: "An automated factory that operates with zero waste.", value: "operations" }
    ]
  },
  {
    id: "q5",
    question: "Which of these tasks feels the least like 'work' to you?",
    options: [
      { text: "Creating a beautiful, interactive web interface.", value: "fullstack" },
      { text: "Writing a script that automatically does a 5-hour task in 5 seconds.", value: "devsecops" },
      { text: "Pitching a creative marketing concept to an audience.", value: "marketing" },
      { text: "Analyzing a financial spreadsheet to find hidden margins.", value: "finance" },
      { text: "Resolving a conflict between two team members.", value: "human-resources" }
    ]
  },
  {
    id: "q6",
    question: "When looking at a popular application like Spotify, what do you think about?",
    options: [
      { text: "How they manage their massive database sizes.", value: "data-analyst" },
      { text: "The underlying recommendation algorithms and machine learning.", value: "ai-ml" },
      { text: "How seamless the user interface and interactions are.", value: "fullstack" },
      { text: "How they acquired so many users so quickly.", value: "marketing" },
      { text: "The strategy behind their subscription pricing models.", value: "finance" }
    ]
  },
  {
    id: "q7",
    question: "How do you prefer to make critical decisions?",
    options: [
      { text: "Based on hard, mathematical certainty and algorithms.", value: "ai-ml" },
      { text: "Based on querying large sets of empirical data.", value: "data-analyst" },
      { text: "Based on financial forecasting and risk-reward ratios.", value: "finance" },
      { text: "Based on maximizing efficiency and removing bottlenecks.", value: "operations" },
      { text: "Based on consensus, empathy, and team alignment.", value: "human-resources" }
    ]
  },
  {
    id: "q8",
    question: "What stresses you out the most?",
    options: [
      { text: "A critical server going down globally.", value: "cloud-architect" },
      { text: "A severe security breach in the codebase.", value: "devsecops" },
      { text: "A product launching that nobody wants to buy.", value: "product-mgmt" },
      { text: "A centralized entity manipulating data.", value: "blockchain" },
      { text: "A toxic work culture ruining productivity.", value: "human-resources" }
    ]
  },
  {
    id: "q9",
    question: "What is your idea of a perfect weekend project?",
    options: [
      { text: "Building a personal website or mobile app.", value: "fullstack" },
      { text: "Configuring a home server using Docker and Linux.", value: "devsecops" },
      { text: "Writing a smart contract and deploying it to a testnet.", value: "blockchain" },
      { text: "Designing a brand identity and launching a Shopify store.", value: "marketing" },
      { text: "Creating a budget and investment portfolio tracker in Excel.", value: "finance" }
    ]
  },
  {
    id: "q10",
    question: "Ultimately, what legacy do you want to leave?",
    options: [
      { text: "I want to be known for building beautiful, robust systems.", value: "fullstack" },
      { text: "I want to push the boundaries of artificial intelligence.", value: "ai-ml" },
      { text: "I want to have built companies that changed the world.", value: "product-mgmt" },
      { text: "I want to have directed massive, global operations flawlessly.", value: "operations" },
      { text: "I want to be known for nurturing amazing people and careers.", value: "human-resources" }
    ]
  }
];

const neonToastStyle = {
  background: "#ffffff",
  color: "#db2777",
  border: "1px solid rgba(14,165,233,0.2)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: "700",
  borderRadius: "16px",
  fontSize: "14px",
};

const Pathways = () => {
  const [activePathway, setActivePathway] = useState(PATHWAYS_DATA[0]);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'IT', 'MBA'
  
  // Quiz State
  const [showGame, setShowGame] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const filteredPathways = filterType === 'ALL' 
    ? PATHWAYS_DATA 
    : PATHWAYS_DATA.filter(p => p.type === filterType);

  const handleSelectAnswer = (option) => {
    const question = QUIZ_QUESTIONS[currentQuestionIdx];
    const newAnswer = {
      questionId: question.id,
      questionText: question.question,
      answerSelected: option.text,
      value: option.value
    };
    
    setQuizAnswers(prev => [...prev, newAnswer]);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      calculateAndSaveResult([...quizAnswers, newAnswer]);
    }
  };

  const calculateAndSaveResult = async (finalAnswers) => {
    // Tally up values
    const tally = {};
    finalAnswers.forEach(ans => {
      tally[ans.value] = (tally[ans.value] || 0) + 1;
    });

    // Find highest count
    let maxPath = 'fullstack';
    let maxCount = 0;
    for (const [key, count] of Object.entries(tally)) {
      if (count > maxCount) {
        maxCount = count;
        maxPath = key;
      }
    }

    const recommended = PATHWAYS_DATA.find(p => p.id === maxPath);
    setQuizResult(recommended);
    saveToDb(recommended.title, finalAnswers);
  };

  const saveToDb = async (recPathwayTitle, finalAnswers) => {
    setIsSaving(true);
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        token = userInfo?.token;
      }

      if (!token) {
        toast.info("Result calculated! Log in to save it to your profile.", { style: neonToastStyle });
        setIsSaving(false);
        return;
      }

      // Format answers for DB
      const dbAnswers = finalAnswers.map(ans => ({
        questionId: ans.questionId,
        questionText: ans.questionText,
        answerSelected: ans.answerSelected
      }));

      await axios.post('https://talent-match-9rsc.onrender.com/api/pathway/save', {
        recommendedPathway: recPathwayTitle,
        quizAnswers: dbAnswers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Game completed! Brainstorming data saved to your profile.", { style: neonToastStyle });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save results.", { style: { ...neonToastStyle, color: '#f87171', border: "1px solid rgba(248,113,113,0.4)" } });
    } finally {
      setIsSaving(false);
    }
  };

  const resetGame = () => {
    setShowGame(false);
    setCurrentQuestionIdx(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const viewMyRecommendedPathway = () => {
    if (quizResult) {
      setActivePathway(quizResult);
      setFilterType(quizResult.type);
      setShowGame(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 text-zinc-800 font-sans relative bg-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeButton={true} />
      


      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-sm font-bold uppercase tracking-widest mb-6">
            <Sparkles size={16} /> Skill Progression
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            CAREER <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">PATHWAYS</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-500 max-w-2xl font-medium mx-auto text-lg leading-relaxed mb-8">
            Select a specialized engineering or MBA track below to view your structured learning roadmap. 
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            onClick={() => {
              setCurrentQuestionIdx(0);
              setQuizAnswers([]);
              setQuizResult(null);
              setShowGame(true);
            }}
            className="group px-8 py-4 rounded-2xl bg-sky-500 text-white shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:shadow-[0_8px_25px_rgba(14,165,233,0.3)] font-black hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto  mb-8"
          >
            <PlayCircle className="group-hover:animate-pulse" />
            PLAY PATHFINDER: DISCOVER YOUR FIT
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-10">
          {['ALL', 'IT', 'MBA'].map(type => (
            <button 
              key={type} 
              onClick={() => {
                setFilterType(type);
                const firstMatch = PATHWAYS_DATA.find(p => type === 'ALL' || p.type === type);
                if (firstMatch) setActivePathway(firstMatch);
              }}
              className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${filterType === type ? 'bg-sky-500 text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 shadow-sm hover:shadow'}`}
            >
              {type} TRACKS
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Pathway Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {filteredPathways.map((path, idx) => (
              <motion.div 
                key={path.id}
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }}
                onClick={() => setActivePathway(path)}
                className={`bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm cursor-pointer transition-all duration-300 group overflow-hidden ${
                  activePathway.id === path.id 
                    ? `border-pink-400 shadow-[0_8px_30px_rgba(14,165,233,0.1)] bg-sky-50/50` 
                    : "hover:border-sky-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${path.color} bg-opacity-10 shrink-0 shadow-lg`}>
                    <div className="bg-white/90 w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                       {path.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{path.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-bold uppercase">{path.type}</span>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">4 Milestones</span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm transition-colors relative z-10 ${activePathway.id === path.id ? "text-zinc-800" : "text-zinc-500"}`}>{path.description}</p>
                
                {/* Active Indicator Line */}
                <div className={`h-1 mt-6 rounded-full w-full bg-white/5 overflow-hidden transition-opacity duration-300 relative z-10 ${activePathway.id === path.id ? "opacity-100" : "opacity-0"}`}>
                   <div className={`h-full bg-gradient-to-r ${path.color} w-full`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Dynamic Roadmap Tree */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-[2.5rem] shadow-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={activePathway.id + '-glow'}
                initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-br ${activePathway.color} blur-[100px] pointer-events-none`}
              />
            </AnimatePresence>

            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3">
                <Briefcase className="text-zinc-500" /> 
                <span className="uppercase tracking-widest">{activePathway.title} Roadmap</span>
              </h2>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {activePathway.steps.map((step, idx) => (
                    <motion.div 
                      key={activePathway.id + step.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      className="relative md:pl-12"
                    >
                      {idx !== activePathway.steps.length - 1 && (
                        <div className="hidden md:block absolute left-[20px] top-[40px] bottom-[-40px] w-0.5 bg-gradient-to-b from-zinc-200 to-transparent" />
                      )}

                      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 flex flex-col md:flex-row md:items-center gap-6 hover:bg-white transition-colors hover:border-sky-200 hover:shadow-md group relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-r ${activePathway.color} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />

                        <div className="hidden md:flex absolute -left-12 items-center justify-center w-10 h-10 rounded-full bg-[#111] border-2 border-zinc-700 text-zinc-500 font-black shadow-xl group-hover:border-white group-hover:text-zinc-800 transition-all z-10 text-sm">
                           {step.id}
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                           {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-zinc-800 tracking-wide leading-tight">{step.title}</h4>
                          <h5 className="text-sm font-semibold text-zinc-500 mt-1">{step.desc}</h5>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PATHFINDER MODAL --- */}
      <AnimatePresence>
        {showGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-zinc-200 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500" />
              <button onClick={resetGame} className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-800 transition-colors z-20">
                <X size={24} />
              </button>

              <div className="p-8">
                {quizResult ? (
                  // RESULTS VIEW
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                      <CheckCircle className="text-white w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black mb-2">We Found Your Fit!</h2>
                    <p className="text-zinc-500 mb-8">Based on your brainstorming input, you are a natural match for:</p>
                    
                    <div className={`p-6 border border-zinc-200 rounded-2xl bg-gradient-to-br ${quizResult.color} bg-opacity-10 mb-8 inline-block`}>
                       <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-zinc-800">
                           {quizResult.icon}
                         </div>
                         <h3 className="text-2xl font-black text-zinc-800">{quizResult.title}</h3>
                         <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-bold uppercase tracking-widest">{quizResult.type} Track</span>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button onClick={viewMyRecommendedPathway} className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 shadow-md text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                         <Globe size={18} /> View My Roadmap
                      </button>
                      <button onClick={() => { setCurrentQuestionIdx(0); setQuizAnswers([]); setQuizResult(null); }} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-zinc-100 text-zinc-700 text-zinc-800 font-bold uppercase tracking-widest text-sm transition-colors border border-zinc-200">
                         Play Again
                      </button>
                    </div>
                    {isSaving && <p className="text-zinc-500 text-xs mt-4 flex items-center justify-center gap-2"><Loader2 className="animate-spin w-3 h-3" /> Saving to database...</p>}
                  </div>
                ) : (
                  // QUESTION VIEW
                  <div className="overflow-hidden">
                    {/* NEW: Progress Bar */}
                    <div className="w-full bg-zinc-100 text-zinc-700 rounded-full h-2 mb-6 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentQuestionIdx / QUIZ_QUESTIONS.length) * 100}%` }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                      />
                    </div>
                    
                    <h2 className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <PlayCircle size={16} /> PATHFINDER BRAINSTORM (Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length})
                    </h2>
                    
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentQuestionIdx} 
                        initial={{ x: 50, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h3 className="text-2xl font-bold mb-8 leading-tight">
                          {QUIZ_QUESTIONS[currentQuestionIdx].question}
                        </h3>

                        <div className="space-y-4">
                          {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt, i) => (
                            <motion.button 
                              key={i}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSelectAnswer(opt)}
                              className="w-full text-left p-5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-pink-400 hover:bg-sky-50 transition-colors font-medium text-lg group flex items-center justify-between"
                            >
                              <span>{opt.text}</span>
                              <ChevronRight className="opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Pathways;
