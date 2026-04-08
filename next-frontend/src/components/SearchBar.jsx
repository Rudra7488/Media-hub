"use client";
import React, { useState } from 'react';
import { Search, Loader2, AtSign, Globe } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        
        <div className="relative flex items-center bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 rounded-[1.8rem] overflow-hidden shadow-2xl transition-all duration-300 group-focus-within:border-blue-500/50">
          <div className="pl-6 text-slate-500 group-focus-within:text-blue-400 transition-colors">
            <AtSign size={22} className="hidden sm:block" />
            <Globe size={22} className="block sm:hidden" />
          </div>
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Search Instagram Username..."
            className="w-full bg-transparent px-5 py-5 text-white text-base md:text-lg font-bold placeholder:text-slate-600 focus:outline-none"
          />
          
          <div className="pr-3">
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="flex items-center justify-center h-12 w-12 sm:w-auto sm:px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Search size={20} className="sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="absolute -bottom-10 left-0 w-full text-center">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500/60 transition-colors group-focus-within:text-blue-500/60">
                Supports all public & business profiles
            </p>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
