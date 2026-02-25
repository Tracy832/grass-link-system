import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8 animate-pulse">
      {/* Header Shimmer */}
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-3 w-32 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-12 w-48 bg-slate-200 rounded-2xl"></div>
      </div>

      {/* Banner Shimmer */}
      <div className="h-40 bg-slate-200 rounded-[2rem] w-full"></div>

      {/* Stats Cards Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-slate-200 rounded-[2rem]"></div>
        <div className="h-32 bg-slate-200 rounded-[2rem]"></div>
        <div className="h-32 bg-slate-200 rounded-[2rem]"></div>
      </div>

      {/* Table Shimmer */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 space-y-4">
        <div className="h-4 w-1/4 bg-slate-200 rounded mb-6"></div>
        <div className="h-12 bg-slate-50 rounded-xl"></div>
        <div className="h-12 bg-slate-50 rounded-xl"></div>
        <div className="h-12 bg-slate-50 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;