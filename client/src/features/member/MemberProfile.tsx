import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import SkeletonLoader from './SkeletonLoader';
import { apiClient } from '../../services/api';
import { Phone, Mail, ShieldCheck, Award } from 'lucide-react';

const MemberProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const colors = { navy: '#1d3557', green: '#03ac13' };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient('/distributors/my-dashboard', { method: 'GET' });
        setProfileData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
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

  // 🚨 UPDATED: Now strictly hunts for the 7-digit company IDs!
  const displayName = profileData?.full_name || 'Valued Member';
  const displayId = profileData?.company_id || '0000000';
  const displayPhone = profileData?.phone || 'Not Provided';
  
  // Looks for the sponsor's official ID first, falls back to the old one if needed
  const displaySponsor = profileData?.sponsor_company_id || profileData?.sponsor_id || null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>
            Member Profile
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-500 text-white text-xs font-bold p-4 rounded-xl text-center uppercase tracking-widest shadow-md">
            {error}
          </div>
        )}

        {profileData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
            {/* Left Column: ID Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-4 border-green-50 text-3xl shadow-inner">
                👤
              </div>
              <h2 className="text-xl font-black mb-1" style={{ color: colors.navy }}>
                {displayName}
              </h2>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full tracking-widest mb-6">
                Official Distributor
              </span>

              <div className="w-full bg-slate-50 rounded-2xl p-4 text-left space-y-3 border border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distributor ID</p>
                  <p className="text-sm font-bold text-slate-800">GI-{displayId}-2026</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sponsor ID</p>
                  <p className="text-sm font-bold text-slate-800">
                    {displaySponsor ? `GI-${displaySponsor}-2026` : 'No Sponsor (Root)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Settings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4" style={{ color: colors.navy }}>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-slate-800">{profileData.email || 'No Email'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-slate-800">{displayPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status Box */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-4" style={{ color: colors.navy }}>
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                      <p className="text-sm font-black text-green-600">
                        {profileData.is_active === false ? 'Inactive' : 'Active & Verified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#1d3557]">
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registration Fee</p>
                      <p className="text-sm font-bold text-slate-800">
                        {profileData.has_paid_registration ? 'Paid (Starter Kit Claimed)' : 'Pending Payment'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemberProfile;