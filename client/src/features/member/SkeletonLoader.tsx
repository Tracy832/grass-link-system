import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6 p-8">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-slate-200 rounded-3xl"></div>
        <div className="h-24 bg-slate-200 rounded-3xl"></div>
        <div className="h-24 bg-slate-200 rounded-3xl"></div>
      </div>

      {/* Table/List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-slate-200 rounded-2xl w-full"></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;