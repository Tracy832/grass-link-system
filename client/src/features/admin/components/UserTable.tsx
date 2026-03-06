import React from 'react';

interface UserTableProps {
  users: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, searchQuery, setSearchQuery }) => {
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <h3 className="text-lg font-black uppercase text-slate-800 tracking-tighter">User Management</h3>
        <input 
          type="text" 
          placeholder="Search Name or ID..." 
          className="px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-[#03ac13] text-xs font-bold w-64 transition-all"
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="p-8">Member Identity</th>
              <th className="p-8">Grass ID</th>
              <th className="p-8">Star Level</th>
              <th className="p-8">Personal PV</th>
              <th className="p-8">Group PV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-8">
                  <p className="text-sm font-black text-slate-900">{u.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{u.email}</p>
                </td>
                <td className="p-8 font-mono text-[11px] font-black text-slate-500 bg-slate-50/50">{u.id}</td>
                <td className="p-8">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${u.star === 3 ? 'bg-[#1d3557]' : 'bg-[#03ac13]'}`}></span>
                    <span className="text-[10px] font-black text-slate-700 uppercase">Level {u.star}</span>
                  </div>
                </td>
                <td className="p-8 font-black text-sm">{u.ppv}</td>
                <td className="p-8 font-black text-sm text-[#03ac13]">{u.gpv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;