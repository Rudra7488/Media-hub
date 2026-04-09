"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Video, Loader2, PlayCircle, ExternalLink, Sparkles, Monitor, AlertCircle } from 'lucide-react';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://media-hub-odup.onrender.com'}/api/youtube`;

const YoutubeDownloader = () => {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); 
  const [error, setError] = useState('');

  const fetchMetadata = async (e) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl || (!cleanUrl.includes('youtube.com') && !cleanUrl.includes('youtu.be'))) {
        setError('Please enter a valid YouTube URL');
        return;
    }

    setIsLoading(true);
    setError('');
    setMetadata(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/metadata`, { url: cleanUrl });
      setMetadata(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/download`, { 
        url, 
        format: 'video',
        quality: 'best', 
        title: metadata?.title || 'media'
      });
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://media-hub-odup.onrender.com'}${response.data.downloadUrl}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed. Our servers might be throttled.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Deep Navy/Blue Global Shadows */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <div className="inline-flex p-5 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 mb-8 shadow-[0_0_50px_rgba(79,70,229,0.1)]">
            <PlayCircle size={56} className="text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
            Media<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dash</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto font-medium leading-relaxed">
            Premium High-Definition Cloud Downloader.
          </p>
        </div>

        {/* Search Box - Navy/Blue Theme */}
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-10 border border-blue-500/10 shadow-2xl mb-16 transition-all hover:border-blue-500/30">
          <form onSubmit={fetchMetadata}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <input
                   type="text"
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder="Paste YouTube Link here..."
                   className="w-full px-8 py-5 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-500 text-lg font-medium shadow-inner"
                 />
              </div>
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="md:w-56 h-16 bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                <span>{isLoading ? 'Wait' : 'Process Video'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2">
              <AlertCircle size={24} className="shrink-0" />
              <div className="text-base font-bold">{error}</div>
            </div>
          )}
        </div>

        {/* Result Card - Navy/Blue Theme */}
        {metadata && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="bg-[#020617]/80 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-blue-500/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 p-6 md:p-8">
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
                    <img src={metadata.thumbnail} alt={metadata.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  </div>
                </div>
                
                <div className="lg:w-3/5 p-8 lg:pl-0 flex flex-col justify-center">
                  <div className="mb-10">
                     <h3 className="text-2xl md:text-3xl font-black text-white leading-tight line-clamp-2 mb-6 tracking-tight italic">
                        {metadata.title}
                     </h3>
                     <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
                        <span className="flex items-center gap-2 border-r border-white/10 pr-4 italic">Source: YouTube</span>
                        <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                          Original <ExternalLink size={14} />
                        </a>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full relative group overflow-hidden flex items-center justify-center gap-4 h-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-600 text-white rounded-[2rem] font-black text-xl tracking-wider transition-all hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      {isDownloading ? <Loader2 className="animate-spin" size={28} /> : <Video size={28} />}
                      <span>{isDownloading ? 'Downloading...' : 'Download Video'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeDownloader;
