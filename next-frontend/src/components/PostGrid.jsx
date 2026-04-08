import React from 'react';
import PostCard from './PostCard';
import { Grid } from 'lucide-react';

const PostGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400">No posts visible for this profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-t border-slate-200 pt-6 uppercase tracking-wider text-xs font-semibold text-slate-500 justify-center">
        <Grid size={16} />
        <span>Posts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostGrid;
