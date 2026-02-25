import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate
import logo from '../../assets/logo.jpeg';
import { getMaintenanceRequirement, getRankBenefits } from './rankLogic';

const UserDashboard = () => {
  const navigate = useNavigate(); // 2. Initialize Navigate
  const colors = {
    navy: '#1d3557', 
    green: '#03ac13',
    lightGreen: '#f0fdf4',
  };

  const user = {
    name: "Tracy Kibue",
    currentStar: 3, 
    personalAccumulatedPV: 1200,
    monthlyPurchasePV: 25, 
    groupPV: 2800,
    cardNumber: "GI-8832-2026",
    downlines: [
      { name: "John Doe", rank: 2, personalPV: 950, leg: "A" },
      { name: "Sarah Wanjiku", rank: 2, personalPV: 980, leg: "B" }, 
      { name: "Kevin Otieno", rank: 2, personalPV: 400, leg: "C" },
    ]
  };

  const requiredPV = getMaintenanceRequirement(user.currentStar);
  const benefits = getRankBenefits(user.currentStar);
  const isQualified = user.monthlyPurchasePV >= requiredPV;

  const getStrategicAdvice = () => {
    if (user.currentStar === 3) {
      const candidates = [...user.downlines].sort((a, b) => b.personalPV - a.personalPV);
      const closest = candidates[0];
      const pvLeft = 1000 - closest.personalPV;

      return (
        <span>
          You need one more person to go to 4-Star. <br />
          <strong style={{ color: colors.green }}>{closest.name}</strong> is the closest to getting to 3-Star—only <strong>{pvLeft} PV</strong> left!
        </span>
      );
    }
    return "Keep supporting your legs for the next rank!";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 text-white flex flex-col shadow-2xl shrink-0" style={{ backgroundColor: colors.navy }}>
        <div className="p-8 border-b border-white/10 flex flex-col items-center">
          <div className="bg-white p-1 rounded-full mb-4 shadow-lg">
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          </div>
          <h2 className="text-xs font-black tracking-widest leading-tight uppercase text-center">
            Grass <br/> <span style={{ color: colors.green }}>International</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 mt-4 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase bg-white/10 border-l-4" style={{ borderColor: colors.green }}>Dashboard</button>
          
          {/* 3. Button now navigates to /tree */}
          <button 
            onClick={() => navigate('/tree')} 
            className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-[11px] font-black uppercase opacity-60"
          >
            My Team Tree
          </button>
          
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-[11px] font-black uppercase opacity-60">Qualifications</button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white p-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>Hello, {user.name}</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">ID: {user.cardNumber}</p>
          </div>
          
          <div className="px-6 py-3 rounded-2xl border flex flex-col items-end shadow-sm min-w-[280px]"
               style={{ backgroundColor: isQualified ? colors.lightGreen : '#fffbeb', borderColor: isQualified ? colors.green : '#f59e0b' }}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isQualified ? 'bg-green-600' : 'bg-amber-500 animate-pulse'}`}></div>
              <span className="text-[10px] font-black uppercase" style={{ color: colors.navy }}>
                {isQualified ? 'Bonus Qualified' : 'Action Required'}
              </span>
            </div>
            <p className="text-[9px] font-bold mt-1" style={{ color: isQualified ? colors.green : '#b45309' }}>
              {isQualified ? `${requiredPV} PV Requirement Met` : `Purchase ${requiredPV} PV to get paid`}
            </p>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="rounded-3xl p-8 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: colors.navy }}>
            <div className="flex items-start gap-6 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl text-3xl border border-white/10 shadow-inner">💡</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.green }}>Strategic Advice</p>
                <p className="text-lg font-bold leading-tight">{getStrategicAdvice()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Accumulated PV</p>
              <h2 className="text-4xl font-black mt-2" style={{ color: colors.navy }}>{user.personalAccumulatedPV}</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Group PV</p>
              <h2 className="text-4xl font-black mt-2" style={{ color: colors.navy }}>{user.groupPV}</h2>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Your Benefits (Star {user.currentStar})</p>
              <div className="space-y-2 text-[11px] font-bold">
                <div className="flex justify-between border-b border-slate-50 pb-1 uppercase">
                  <span className="text-slate-500 font-normal">Direct Bonus</span>
                  <span style={{ color: colors.green }}>{benefits.directBonus}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1 uppercase">
                  <span className="text-slate-500 font-normal">Retail Profit</span>
                  <span style={{ color: colors.green }}>{benefits.retailProfit}</span>
                </div>
                <div className="flex justify-between uppercase">
                  <span className="text-slate-500 font-normal">Sponsor Bonus</span>
                  <span style={{ color: colors.green }}>{benefits.sponsorBonus}</span>
                </div>
              </div>
            </div>
          </div>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Membership Ranks</h3>
            <div className="flex justify-between items-center max-w-5xl mx-auto gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black
                    ${i <= user.currentStar ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-200 border border-slate-100'}`}
                    style={{ backgroundColor: i <= user.currentStar ? colors.green : '', transform: i === user.currentStar ? 'scale(1.2)' : 'scale(1)' }}>
                    {i}
                  </div>
                  <div className={`h-1.5 w-full mt-4 rounded-full ${i <= user.currentStar ? '' : 'bg-slate-50'}`}
                       style={{ backgroundColor: i <= user.currentStar ? colors.green : '' }}></div>
                  <span className={`text-[8px] mt-2 font-black uppercase ${i <= user.currentStar ? 'text-slate-800' : 'text-slate-200'}`}>Level {i}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;