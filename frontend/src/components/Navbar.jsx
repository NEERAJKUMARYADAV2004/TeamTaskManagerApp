import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">T</div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          TeamTask MVP
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-200">{user.name}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">{user.role}</span>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
