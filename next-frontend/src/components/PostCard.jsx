import React, { useState } from 'react';
import { Download, Play, Heart, MessageCircle } from 'lucide-react';

const PostCard = ({ post }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(post.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `instagram-post-${post.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: Open in new tab
      window.open(post.image_url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
      <img
        src={post.image_url}
        alt="Post"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      
      {post.is_video && (
        <div className="absolute top-2 right-2 text-white drop-shadow-md">
          <Play size={18} fill="currentColor" />
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
        <div className="flex items-center text-white font-semibold">
           <Heart fill="currentColor" size={24} className="mr-2" />
           <span>-</span>
        </div>
        <div className="flex items-center text-white font-semibold">
           <MessageCircle fill="currentColor" size={24} className="mr-2" />
           <span>-</span>
        </div>
      </div>

      {/* Mini-Actions */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          disabled={isDownloading}
          className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-lg backdrop-blur-sm transition-all active:scale-90"
          title="Download Image"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            <Download size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
