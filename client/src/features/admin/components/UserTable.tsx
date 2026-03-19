import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../../services/api';
import { Users, AlertCircle, Fingerprint } from 'lucide-react';

interface User {
  id: number;
  company_id?: string; 
  full_name: string;
  email: string;
  star_level: any;
  personal_pv: number;
  group_pv: number;
}

interface UserTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ searchQuery, setSearchQuery }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient('/distributors/', { method: 'GET' });
        const extractedUsers = Array.isArray(data) ? data : (data.items || data.users || data.data || []);
        setUsers(extractedUsers);
      } catch (err: any) {
        console.error("Failed to fetch users", err);
        setError("Failed to load members from the database.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  //  SMART SEARCH: Now strictly targets the 7-digit company ID
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    return users.filter(user => {
      
      const displayId = user.company_id || user.id.toString();
      const officialId = `gi-${displayId}-2026`.toLowerCase();
      
      return (
        user.full_name?.toLowerCase().includes(lowerQuery) ||
        officialId.includes(lowerQuery) ||
        displayId.toString().includes(lowerQuery) ||
        user.email?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [users, searchQuery]);

  const getStarNumber = (starData: any) => {
    if (!starData) return 0;
    if (typeof starData === 'number') return starData;
    if (typeof starData === 'string') {
      const match = starData.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    if (starData.value) return starData.value;
    return 0;
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      
      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter flex items-center gap-2">
          <Users size={20} className="text-[#03ac13]" /> Registered Members
          <span className="ml-2 px-3 py-1 bg-white rounded-full text-[10px] text-slate-400 border border-slate-200 shadow-sm">
            {isLoading ? '...' : users.length} Total
          </span>
        </h3>
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="Search Name or ID (e.g. 0012345)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#03ac13] outline-none text-xs font-bold transition-all shadow-sm text-slate-700 tracking-widest"
          />
          <span className="absolute left-5 top-3.5 opacity-40 text-slate-400"><Fingerprint size={16}/></span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 bg-white">
              <th className="p-8">Member Identity</th>
              <th className="p-8">Current Level</th>
              <th className="p-8">Personal PV</th>
              <th className="p-8">Group PV</th>
              <th className="p-8 text-right">Contact Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Loading database records...
                </td>
              </tr>
            )}

            {!isLoading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No members found matching "{searchQuery}".
                </td>
              </tr>
            )}

            {!isLoading && filteredUsers.map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="p-8">
                  {/* Primary Focus: Name and Official ID */}
                  <p className="font-black text-sm text-slate-900 uppercase">{user.full_name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Fingerprint size={10} className="text-[#03ac13]" />
                    {/* 🚨 UPDATED: Renders the 7-digit ID */}
                    <p className="text-[11px] font-black text-[#03ac13] tracking-widest">
                      GI-{user.company_id || user.id}-2026
                    </p>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#03ac13] shadow-sm shadow-green-100 animate-pulse" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                      {getStarNumber(user.star_level)} Star
                    </span>
                  </div>
                </td>
                <td className="p-8 font-black text-sm text-slate-600">
                  {user.personal_pv?.toLocaleString() || 0}
                </td>
                <td className="p-8 font-black text-sm text-[#03ac13]">
                  {user.group_pv?.toLocaleString() || 0}
                </td>
                <td className="p-8 text-right font-mono text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserTable;