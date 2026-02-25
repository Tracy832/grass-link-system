import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankBenefits } from './rankLogic';
import logo from '../../assets/logo.jpeg'; // Importing your logo

const Qualifications = () => {
  const navigate = useNavigate();
  const colors = { 
    navy: '#1d3557', 
    green: '#03ac13' 
  };

  const ranks = Array.from({ length: 10 }, (_, i) => ({
    level: i,
    ...getRankBenefits(i)
  }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white p-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full shadow-md border border-slate-100">
            <img src={logo} alt="Grass International" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase leading-tight" style={{ color: colors.navy }}>
              Success Roadmap
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Official Compensation Plan</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-[#1d3557] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-colors"
        >
          Back to Dashboard
        </button>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead style={{ backgroundColor: colors.navy }}>
              <tr>
                <th className="p-5 text-[10px] font-black text-white uppercase tracking-widest">Rank Level</th>
                <th className="p-5 text-[10px] font-black text-white uppercase tracking-widest">Direct Bonus</th>
                <th className="p-5 text-[10px] font-black text-white uppercase tracking-widest">Mandatory PV</th>
                <th className="p-5 text-[10px] font-black text-white uppercase tracking-widest">Status & Rewards</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank) => (
                <tr key={rank.level} className={`border-b border-slate-50 transition-colors ${rank.level === 9 ? 'bg-green-50/30' : 'hover:bg-slate-50/50'}`}>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {/* Rank Badge is now Navy Blue */}
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: colors.navy }}>
                        {rank.level}
                      </span>
                      <span className="font-black text-slate-700 uppercase text-xs">Star {rank.level}</span>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-slate-600 italic">{rank.directBonus}</td>
                  {/* Mandatory PV is now Grass Green */}
                  <td className="p-5 font-black" style={{ color: colors.green }}>
                    {rank.maintenancePV} PV
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {rank.level === 9 && (
                        <span className="px-3 py-1 bg-[#1d3557] text-white rounded-full text-[9px] font-black uppercase ring-2 ring-blue-100">
                          👑 Global Shareholder
                        </span>
                      )}
                      
                      {rank.perks.length > 0 ? (
                        rank.perks.map((perk, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-[#03ac13] rounded-full text-[9px] font-black uppercase border border-green-100">
                            {perk}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Initial Benefits</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Qualifications;