import React from 'react';

interface User {
  name: string;
  id: string;
  email: string;
  star: number;
  ppv: number;
  gpv: number;
}

interface UserTableProps {
  users: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, searchQuery, setSearchQuery }) => {
  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      
      {/* Search Header */}
      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">Registered Members</h3>
        <div className="relative w-full md:w-72">
          <input 
            type="text"
            placeholder="Search name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#03ac13] outline-none text-xs font-bold transition-all shadow-sm"
          />
          <span className="absolute left-5 top-3.5 opacity-20 text-xs">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="p-8">Member</th>
              <th className="p-8">Level</th>
              <th className="p-8">Personal PV</th>
              <th className="p-8">Group PV</th>
              <th className="p-8 text-right">ID Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="p-8">
                  <p className="font-black text-sm text-slate-900">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{user.email}</p>
                </td>
                <td className="p-8">
                  {/* Minimalist Dot and Text Level */}
                  <div className="flex items-center gap-2.5">
                    {/* The tiny green circle (Dot) */}
                    <div className="w-2 h-2 rounded-full bg-[#03ac13] shadow-sm shadow-green-100 animate-pulse" />
                    
                    {/* The Star Level Text */}
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                      {user.star} Star
                    </span>
                  </div>
                </td>
                <td className="p-8 font-black text-sm text-slate-600">{user.ppv.toLocaleString()}</td>
                <td className="p-8 font-black text-sm text-[#03ac13]">{user.gpv.toLocaleString()}</td>
                <td className="p-8 text-right font-mono text-xs font-black text-slate-300 group-hover:text-slate-900 transition-colors">
                  {user.id}
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