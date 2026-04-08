"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Layout, Video, PlayCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/youtube', label: 'YouTube', icon: PlayCircle, color: 'text-red-400', activeBg: 'bg-red-500/10 border-red-500/30 text-red-400' },
    { href: '/reels', label: 'Reels', icon: Video, color: 'text-pink-400', activeBg: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
    { href: '/', label: 'Profile', icon: Layout, color: 'text-cyan-400', activeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo - Renamed to MediaDash */}
        <Link href="/youtube" className="flex items-center gap-3 group transition-all">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Media<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Dash</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-transparent ${
                  isActive 
                    ? link.activeBg + ' shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out bg-[#020617] border-b border-white/10 ${isMenuOpen ? 'max-h-80 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
        <nav className="container mx-auto px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold transition-all ${
                  isActive 
                    ? link.activeBg
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={22} className={isActive ? link.color : 'text-slate-500'} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
