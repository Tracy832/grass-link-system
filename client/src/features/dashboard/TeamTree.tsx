import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeamTree = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const colors = {
    navy: '#1d3557',
    green: '#03ac13',
  };

  const user = { name: "Tracy Kibue", currentStar: 3 };

  const legs = [
    { 
      name: "John Doe", rank: 2, leg: "A", 
      team: [{ name: "Alice Mwangi", rank: 1 }, { name: "Peter Kamau", rank: 1 }]
    },
    { 
      name: "Sarah Wanjiku", rank: 2, leg: "B", 
      team: [{ name: "Grace Njeri", rank: 2 }, { name: "David Otieno", rank: 1 }]
    },
    { 
      name: "Kevin Otieno", rank: 2, leg: "C", team: [] 
    },
  ];

  const handlePrint = () => window.print();

  // Helper to check if a name matches search
  const isMatch = (name: string) => 
    searchTerm !== "" && name.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* SEARCH & CONTROL HEADER */}
      <header className="bg-white p-4 flex flex-wrap justify-between items-center border-b border-gray-100 sticky top-0 z-50 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">🏠</button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black uppercase" style={{ color: colors.navy }}>Team Tree</h1>
          </div>
        </div>

        {/* SEARCH BAR - Center Piece */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <span className="absolute left-3 top-2.5">🔍</span>
            <input 
              type="text" 
              placeholder="Find a member by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-100 focus:border-[#03ac13] outline-none transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* ZOOM & ACTIONS */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
            <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))} className="font-black px-2">-</button>
            <span className="text-[10px] font-black w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(zoom + 0.2, 2))} className="font-black px-2">+</button>
          </div>
          <button onClick={handlePrint} className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">🖨️</button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#1d3557] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* TREE CANVAS */}
      <div className="flex-1 overflow-auto p-12 bg-white">
        <div 
          className="transition-transform duration-300 origin-top flex flex-col items-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* TRACY (ROOT) */}
          <div className="flex flex-col items-center">
            <div className={`bg-white p-6 rounded-3xl shadow-xl border-t-8 w-64 text-center border-[#03ac13] transition-all ${isMatch(user.name) ? 'ring-4 ring-yellow-400 scale-110' : ''}`}>
              <h2 className="text-lg font-black" style={{ color: colors.navy }}>{user.name}</h2>
              <div className="mt-3 inline-block px-4 py-1 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: colors.green }}>Star Level {user.currentStar}</div>
            </div>
            <div className="h-12 w-1 bg-slate-300"></div>
          </div>

          {/* THE LEGS */}
          <div className="flex justify-center gap-10 relative">
            <div className="absolute top-0 left-[18%] right-[18%] h-1 bg-slate-300"></div>

            {legs.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[220px]">
                <div className="h-8 w-1 bg-slate-300"></div>
                <div className={`bg-white p-5 rounded-2xl shadow-md border border-slate-100 w-full text-center border-b-4 transition-all ${isMatch(member.name) ? 'ring-4 ring-yellow-400 scale-110' : ''}`} style={{ borderBottomColor: colors.green }}>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Leg {member.leg}</p>
                  <p className="text-sm font-black text-slate-800 mb-2">{member.name}</p>
                  <div className="inline-block px-3 py-1 rounded-lg text-[9px] font-black text-white" style={{ backgroundColor: colors.green }}>Star Level {member.rank}</div>
                </div>

                {/* THE TEAMS */}
                {member.team.length > 0 && (
                  <>
                    <div className="h-8 w-1 bg-slate-300"></div>
                    <div className="flex gap-4 relative">
                      <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-slate-200"></div>
                      {member.team.map((sub, sIdx) => (
                        <div key={sIdx} className="flex flex-col items-center">
                          <div className="h-4 w-0.5 bg-slate-200"></div>
                          <div className={`bg-white p-3 rounded-xl border border-slate-200 w-32 text-center shadow-sm transition-all ${isMatch(sub.name) ? 'ring-4 ring-yellow-400 scale-110' : ''}`}>
                            <p className="text-[10px] font-black text-slate-700">{sub.name}</p>
                            <div className="mt-2 inline-block px-2 py-0.5 rounded-md text-[8px] font-black text-white" style={{ backgroundColor: colors.green }}>Star {sub.rank}</div>
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