"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Download, Music, Smartphone, Zap, Loader2, Video, Sparkles, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/reel/download';

const ReelConverter = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloads, setDownloads] = useState(null);

  const handleConvert = async (e) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setIsLoading(true);
    setError('');
    setDownloads(null);

    try {
      const response = await axios.post(API_BASE_URL, { url: cleanUrl });
      setDownloads(response.data.downloads);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process reel. Make sure it is a public reel and your Instagram Cookie is fresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (path, name) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${path}`;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="relative mb-12 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="inline-flex p-4 rounded-[2rem] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8 shadow-xl relative backdrop-blur-md">
          <Video size={48} className="text-pink-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
          Reel <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Processor</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          The ultimate Instagram Reel kit. Convert, compress, and extract audio with surgical precision.
        </p>
      </div>

      {/* Convert Section */}
      <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <Smartphone size={120} className="text-purple-500 rotate-12" />
        </div>
        
        <form onSubmit={handleConvert} className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
               <input
                 type="text"
                 value={url}
                 onChange={(e) => setUrl(e.target.value)}
                 placeholder="Paste Instagram Reel URL..."
                 className="relative w-full px-6 py-5 bg-slate-900/60 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-slate-500 text-base md:text-lg"
               />
            </div>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="md:w-40 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={22} />}
              <span>{isLoading ? 'Wait' : 'Process'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2">
            <AlertCircle size={24} className="shrink-0 mt-0.5" />
            <div className="text-base font-medium leading-relaxed">{error}</div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {downloads && (
        <div className="animate-in fade-in zoom-in-95 duration-700 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DownloadOption 
            label="High-Res Video" 
            sub="Original quality MP4"
            icon={<Video size={24} />} 
            onClick={() => downloadFile(downloads.video, 'insta_reel_hd.mp4')}
            color="from-blue-600/20 to-blue-400/10 border-blue-500/30 text-blue-400"
          />
          <DownloadOption 
            label="Audio Stream" 
            sub="Studio quality MP3"
            icon={<Music size={24} />} 
            onClick={() => downloadFile(downloads.audio, 'insta_reel_audio.mp3')}
            color="from-pink-600/20 to-pink-400/10 border-pink-500/30 text-pink-400"
          />
          <DownloadOption 
            label="Shorts Format" 
            sub="Optimized for 9:16"
            icon={<Smartphone size={24} />} 
            onClick={() => downloadFile(downloads.shorts, 'insta_reel_shorts.mp4')}
            color="from-purple-600/20 to-purple-400/10 border-purple-500/30 text-purple-400"
          />
          <DownloadOption 
            label="Small Size" 
            sub="Optimized for sharing"
            icon={<Zap size={24} />} 
            onClick={() => downloadFile(downloads.compressed, 'insta_reel_small.mp4')}
            color="from-green-600/20 to-green-400/10 border-green-500/30 text-green-400"
          />
        </div>
      )}
    </div>
  );
};

const DownloadOption = ({ label, sub, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-6 p-6 bg-gradient-to-br ${color} border rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all text-left overflow-hidden`}
  >
    <div className="p-4 bg-black/20 rounded-2xl group-hover:scale-110 transition-transform duration-500 border border-white/5">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-lg font-black tracking-tight text-white mb-0.5">{label}</div>
      <div className="text-white/50 text-xs font-bold uppercase tracking-widest">{sub}</div>
    </div>
    <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
      <Download size={20} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
    </div>
  </button>
);

export default ReelConverter;
