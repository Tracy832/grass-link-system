import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';
import { getMaintenanceRequirement, getRankBenefits } from './rankLogic';
import DashboardLayout from './DashboardLayout';
import SkeletonLoader from './SkeletonLoader';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const colors = {
    navy: '#1d3557', 
    green: '#03ac13',
    lightGreen: '#f0fdf4',
  };

  // Mock User Data based on Tracy's Profile
  const user = {
    name: "Tracy Kibue",
    currentStar: 3, 
    personalAccumulatedPV: 1200,
    monthlyPurchasePV: 25, 
    groupPV: 2800,
    cardNumber: "GI-8832-2026",
    downlines: [
      { name: "John Doe", rank: 2, personalPV: 950, leg: "A", teamCount: 2 },
      { name: "Sarah Wanjiku", rank: 2, personalPV: 980, leg: "B", teamCount: 2 }, 
      { name: "Kevin Otieno", rank: 2, personalPV: 400, leg: "C", teamCount: 0 },
    ]
  };

  const requiredPV = getMaintenanceRequirement(user.currentStar);
  const benefits = getRankBenefits(user.currentStar);
  const isQualified = user.monthlyPurchasePV >= requiredPV;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SkeletonLoader />;

  return (
    <DashboardLayout>
      <div className="min-h-screen flex text-slate-900">
        {/* SIDEBAR - Desktop Only */}
        <aside className="w-64 text-white hidden md:flex flex-col shadow-2xl shrink-0" style={{ backgroundColor: colors.navy }}>
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
            <button onClick={() => navigate('/tree')} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-[11px] font-black uppercase opacity-60">My Team Tree</button>
            <button onClick={() => navigate('/qualifications')} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-[11px] font-black uppercase opacity-60">Qualifications</button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          {/* HEADER - collision fix included (md:mr-16) */}
          <header className="bg-white p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 sticky top-0 z-20">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>Hello, {user.name}</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">ID: {user.cardNumber}</p>
            </div>
            
            <div className={`px-5 py-3 rounded-2xl border flex flex-col items-end shadow-sm min-w-[220px] md:mr-16 transition-all`}
                 style={{ 
                   backgroundColor: isQualified ? colors.lightGreen : '#fffbeb', 
                   borderColor: isQualified ? colors.green : '#f59e0b' 
                 }}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isQualified ? 'bg-green-600' : 'bg-amber-500 animate-pulse'}`}></div>
                <span className="text-[10px] font-black uppercase" style={{ color: colors.navy }}>
                  {isQualified ? 'Bonus Qualified' : 'Action Required'}
                </span>
              </div>
              <p className="text-[9px] font-bold mt-1" style={{ color: isQualified ? colors.green : '#b45309' }}>
                {isQualified ? `${requiredPV} PV Met` : `Mandatory: Purchase ${requiredPV} PV`}
              </p>
            </div>
          </header>

          <div className="p-4 md:p-8 space-y-6">
            {/* ADVISOR BANNER */}
            <div className="rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: colors.navy }}>
              <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-10 rotate-12">🏆</div>
              <div className="relative z-10 flex items-start gap-4 md:gap-6">
                <div className="bg-white/10 p-3 md:p-4 rounded-2xl text-2xl border border-white/10 shadow-inner">💡</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.green }}>Next Rank Advisor</p>
                  <p className="text-sm md:text-lg font-bold leading-tight">
                    Help <strong>Sarah Wanjiku</strong> reach Star 3 (needs 20 PV) to boost your group volume and hit Star 4!
                  </p>
                </div>
              </div>
            </div>

            {/* STATS & BENEFITS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Accumulated PV</p>
                <h2 className="text-4xl font-black mt-2" style={{ color: colors.navy }}>{user.personalAccumulatedPV}</h2>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Group PV</p>
                <h2 className="text-4xl font-black mt-2" style={{ color: colors.navy }}>{user.groupPV}</h2>
              </div>
              
              {/* RANK BENEFITS - Cleaner pills, no lines */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rank {user.currentStar} Earnings</p>
                <div className="space-y-3 text-[11px] font-black uppercase">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-500">Direct Bonus</span>
                    <span style={{ color: colors.green }}>{benefits.directBonus}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-500">Sponsor Bonus</span>
                    <span style={{ color: colors.green }}>{benefits.sponsorBonus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LEGS SECTION - Detailed PV and Team Tracking */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Downline Leg Performance</h3>
                <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">Real-time Stats</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.downlines.map((member, idx) => (
                  <div key={idx} className="p-6 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-black uppercase tracking-tighter">Leg {member.leg}</span>
                        <h4 className="text-sm font-black text-slate-800 mt-1">{member.name}</h4>
                      </div>
                      <span className="px-2 py-1 rounded-md text-[9px] font-black text-white shadow-sm" style={{ backgroundColor: colors.green }}>
                        STAR {member.rank}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Personal</p>
                        <p className="text-xs font-black" style={{ color: colors.navy }}>{member.personalPV} PV</p>
                      </div>
                      <div className="bg-green-50/30 p-2 rounded-xl text-center border border-green-100/50">
                        <p className="text-[8px] font-black text-[#03ac13] uppercase">Team Size</p>
                        <p className="text-xs font-black" style={{ color: colors.green }}>{member.teamCount}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Progress to Next Star</span>
                        <span className="text-[9px] font-black" style={{ color: colors.green }}>75%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-1000" style={{ backgroundColor: colors.green, width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;