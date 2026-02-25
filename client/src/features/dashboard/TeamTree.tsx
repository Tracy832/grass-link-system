import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader';

const TeamTree = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const colors = { navy: '#1d3557', green: '#03ac13' };

  const user = { name: "Tracy Kibue", currentStar: 3, ppv: 1200, gpv: 4295 };

  const legs = [
    { 
      name: "John Doe", rank: 2, leg: "A", ppv: 950, gpv: 1155,
      team: [
        { name: "Alice Mwangi", rank: 1, ppv: 120, gpv: 120 },
        { name: "Peter Kamau", rank: 1, ppv: 85, gpv: 85 }
      ]
    },
    { 
      name: "Sarah Wanjiku", rank: 2, leg: "B", ppv: 980, gpv: 1540,
      team: [
        { name: "Grace Njeri", rank: 2, ppv: 450, gpv: 450 },
        { name: "David Otieno", rank: 1, ppv: 110, gpv: 110 }
      ]
    },
    { 
      name: "Kevin Otieno", rank: 2, leg: "C", ppv: 400, gpv: 400, team: [] 
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // PRINT FUNCTION
  const handlePrint = () => {
    window.print();
  };

  const isMatch = (name: string) => 
    searchTerm !== "" && name.toLowerCase().includes(searchTerm.toLowerCase());

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER - Hidden during actual printing */}
      <header className="bg-white p-4 flex flex-wrap justify-between items-center border-b border-gray-100 sticky top-0 z-40 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="bg-[#1d3557] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
            ← Dashboard
          </button>
          <div className="border-l pl-4 border-slate-200">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Your Network GPV</p>
             <p className="text-sm font-black text-green-600">{user.gpv.toLocaleString()} PV</p>
          </div>
        </div>

        <div className="flex-1 max-w-xs mx-4">
          <input 
            type="text" 
            placeholder="Search name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-slate-100 focus:border-[#03ac13] outline-none text-xs font-bold"
          />
        </div>

        {/* PRINT & ZOOM CONTROLS */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} className="w-8 h-8 font-black text-slate-400">-</button>
            <span className="text-[10px] font-black w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(zoom + 0.1, 2))} className="w-8 h-8 font-black text-slate-400">+</button>
          </div>
          
          <button 
            onClick={handlePrint}
            className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg"
            title="Print Genealogy Tree"
          >
            <span className="text-lg">🖨️</span>
          </button>
        </div>
      </header>

      {/* TREE CANVAS */}
      <div className="flex-1 overflow-auto p-12 print:p-0">
        <div className="transition-transform duration-300 origin-top flex flex-col items-center" style={{ transform: `scale(${zoom})` }}>
          
          {/* LEVEL 1: YOU */}
          <div className="flex flex-col items-center">
            <div className={`bg-white p-5 rounded-3xl shadow-xl border-t-8 w-72 text-center border-[#03ac13] ${isMatch(user.name) ? 'ring-4 ring-yellow-400 scale-105' : ''}`}>
              <h2 className="text-lg font-black mb-2" style={{ color: colors.navy }}>{user.name}</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <p className="text-[7px] font-black text-slate-400 uppercase">Personal</p>
                  <p className="text-[10px] font-black">{user.ppv} PV</p>
                </div>
                <div className="bg-green-50 p-2 rounded-xl">
                  <p className="text-[7px] font-black text-green-600 uppercase">Group</p>
                  <p className="text-[10px] font-black text-green-600">{user.gpv} PV</p>
                </div>
              </div>
              <span className="px-4 py-1 rounded-full text-[9px] font-black text-white bg-[#1d3557]">Star {user.currentStar}</span>
            </div>
            <div className="h-10 w-1 bg-slate-300"></div>
          </div>

          {/* LEVEL 2: LEGS */}
          <div className="flex justify-center gap-8 relative">
            <div className="absolute top-0 left-[20%] right-[20%] h-1 bg-slate-300"></div>
            {legs.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[260px]">
                <div className="h-8 w-1 bg-slate-300"></div>
                <div className={`bg-white p-4 rounded-2xl shadow-md border-b-4 w-full text-center transition-all ${isMatch(member.name) ? 'ring-4 ring-yellow-400 scale-105' : ''}`} style={{ borderBottomColor: colors.green }}>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter italic">Leg {member.leg}</p>
                  <h3 className="text-sm font-black mb-2" style={{ color: colors.navy }}>{member.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <p className="text-[7px] font-bold text-slate-400">PPV: {member.ppv}</p>
                    </div>
                    <div className="bg-green-50 p-1.5 rounded-lg border border-green-100">
                      <p className="text-[7px] font-black text-green-600">GPV: {member.gpv}</p>
                    </div>
                  </div>
                  <span className="px-3 py-0.5 rounded-md text-[8px] font-black text-white" style={{ backgroundColor: colors.navy }}>Star {member.rank}</span>
                </div>

                {/* LEVEL 3: DOWNLINES */}
                {member.team.length > 0 && (
                  <>
                    <div className="h-6 w-1 bg-slate-300"></div>
                    <div className="flex gap-4 relative">
                      <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-slate-200"></div>
                      {member.team.map((sub, sIdx) => (
                        <div key={sIdx} className="flex flex-col items-center">
                          <div className="h-4 w-0.5 bg-slate-200"></div>
                          <div className={`bg-white p-3 rounded-xl border border-slate-100 w-36 text-center shadow-sm ${isMatch(sub.name) ? 'ring-4 ring-yellow-400 scale-105' : ''}`}>
                            <p className="text-[10px] font-black text-slate-700 leading-tight mb-1">{sub.name}</p>
                            <div className="flex flex-col gap-0.5 text-[8px] font-bold mb-2">
                              <span className="text-slate-400">PPV: {sub.ppv}</span>
                              <span className="text-green-600 font-black tracking-tight">GPV: {sub.gpv}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-green-500 text-white text-[7px] font-black">Star {sub.rank}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTree;