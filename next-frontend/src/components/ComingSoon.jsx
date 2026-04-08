"use client";
import React from 'react';
import { Rocket, ArrowLeft, Construction, Hammer } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoon({ title, feature }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="relative max-w-2xl w-full">
        {/* Decorative Elements */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl overflow-hidden group">
          {/* Animated Icons Overlay */}
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Construction size={180} className="-rotate-12" />
          </div>
          
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
             <Rocket size={48} className="text-blue-400 animate-bounce" />
          </div>

          <div className="space-y-6 relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Underway</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
              We're currently preparing the <span className="text-blue-400 font-bold">{feature}</span> module. Stay tuned for the update.
            </p>

            <div className="flex items-center justify-center pt-8">
              <Link 
                href="/youtube" 
                className="flex items-center gap-2 px-10 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-lg"
              >
                <ArrowLeft size={18} /> Back to Dashboard
              </Link>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center gap-8 text-slate-500 opacity-40">
             <Hammer size={24} />
             <Construction size={24} />
             <Rocket size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
