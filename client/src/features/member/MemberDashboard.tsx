import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMaintenanceRequirement, getRankBenefits } from './rankLogic';
import DashboardLayout from '../../layouts/DashboardLayout';
import SkeletonLoader from './SkeletonLoader';
import { apiClient } from '../../services/api';

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const currentUserName = localStorage.getItem('userName') || "Valued Member";

  const colors = {
    navy: '#1d3557', 
    green: '#03ac13',
    lightGreen: '#f0fdf4',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient('/distributors/my-dashboard', {
          method: 'GET'
        });
        
        setUserData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data.');
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          localStorage.clear();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) return <SkeletonLoader />;

  const parseStarLevel = (starString: string) => {
    if (!starString) return 0;
    const match = starString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // 🔥 AGGRESSIVE DATA HUNTERS: Checking multiple possible property names from the API
  const displayId = userData?.id || userData?.distributor_id || userData?.user_id || '0000';
  const displayName = userData?.full_name || userData?.name || userData?.username || currentUserName;

  const currentStarNumber = userData ? parseStarLevel(userData.star_level) : 0;
  const requiredPV = getMaintenanceRequirement(currentStarNumber);
  const benefits = getRankBenefits(currentStarNumber);
  
  const monthlyPV = userData?.monthly_purchase_pv || 0;
  const personalPV = userData?.personal_pv || 0;
  const groupPV = userData?.group_pv || 0;
  
  const isQualified = monthlyPV >= requiredPV;

  const topDownline = userData?.downlines && userData.downlines.length > 0 
    ? userData.downlines[0] 
    : null;

  return (
    <DashboardLayout>
      <div className="min-h-screen text-slate-900 bg-slate-50">
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          
          {error && (
            <div className="bg-red-500 text-white text-xs font-bold p-3 text-center tracking-widest uppercase">
              {error}
            </div>
          )}

          <header className="bg-white p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 sticky top-0 z-20">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>
                {/* Updated to use the smart variable */}
                Hello, {displayName}
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                {/* Updated to use the smart variable */}
                ID: GI-{displayId}-2026
              </p>
            </div>
            
            <div className={`px-5 py-3 rounded-2xl border flex flex-col items-end shadow-sm min-w-[220px] transition-all`}
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
            <div className="rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: colors.navy }}>
              <div className="absolute right-[-20px] top-[-20px] text-9xl opacity-10 rotate-12">🏆</div>
              <div className="relative z-10 flex items-start gap-4 md:gap-6">
                <div className="bg-white/10 p-3 md:p-4 rounded-2xl text-2xl border border-white/10 shadow-inner">💡</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.green }}>Next Rank Advisor</p>
                  <p className="text-sm md:text-lg font-bold leading-tight">
                    {topDownline 
                      ? `Help ${topDownline.full_name || 'your team'} rank up to boost your group volume!` 
                      : `Start recruiting downlines to multiply your group volume and rank up!`}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Accumulated PV</p>
                <h2 className="text-4xl font-black mt-2" style={{ color: colors.navy }}>{personalPV}</h2>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Group PV</p>
                <h2 className="text-4xl font-black mt-2" style={{ color: colors.navy }}>{groupPV}</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rank {currentStarNumber} Earnings</p>
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
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;