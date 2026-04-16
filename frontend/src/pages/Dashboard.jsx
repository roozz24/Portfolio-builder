import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleCreate = () => {
    const id = uuidv4();
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center relative overflow-hidden font-sans text-zinc-900 selection:bg-zinc-200">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-zinc-200/50 to-transparent blur-[100px] rounded-full opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-zinc-200/30 to-transparent blur-[100px] rounded-full opacity-60 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center mt-[-8vh]">
        
        {/* Status Badge */}
        <div className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm text-sm font-medium text-zinc-600 transition-transform hover:scale-105 cursor-default">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Portfolio Builder v2.0
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
          Build a portfolio that <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900">
            demands attention.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl leading-relaxed">
          Create, customize, and publish stunning professional portfolios in minutes. 
          No design degree required. Stand out from the crowd today.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={handleCreate}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-full text-lg font-medium transition-all duration-300 hover:bg-zinc-800 hover:shadow-2xl hover:shadow-zinc-900/20 hover:-translate-y-1 active:translate-y-0 active:shadow-none"
        >
          <span>Create New Portfolio</span>
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Reassurance Text */}
        <p className="mt-6 text-sm text-zinc-400 font-medium">
          Free forever. No credit card required.
        </p>
      </div>

      {/* Abstract UI Mockup (Adds to the premium SaaS aesthetic) */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 opacity-50 pointer-events-none select-none" 
           style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}>
        <div className="h-80 w-full bg-white rounded-t-3xl border border-zinc-200 shadow-2xl flex flex-col overflow-hidden transform perspective-[1000px] rotateX-[5deg]">
           {/* Mock Window Header */}
           <div className="h-12 border-b border-zinc-100 flex items-center px-6 gap-2 bg-zinc-50/50">
             <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
             <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
             <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
           </div>
           {/* Mock App Layout */}
           <div className="flex-1 bg-zinc-50 p-8 flex gap-6">
             <div className="w-64 h-full bg-white rounded-xl border border-zinc-100 shadow-sm"></div>
             <div className="flex-1 h-full flex flex-col gap-6">
                <div className="w-full h-32 bg-white rounded-xl border border-zinc-100 shadow-sm"></div>
                <div className="w-full h-full bg-white rounded-xl border border-zinc-100 shadow-sm"></div>
             </div>
           </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;