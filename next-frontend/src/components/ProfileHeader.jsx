import React from 'react';
import { User, Users, Bookmark, Grid } from 'lucide-react';

const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Picture */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-slate-100 p-1 bg-white shadow-lg flex-shrink-0">
        <img
          src={profile.profile_pic_url}
          alt={profile.username}
          className="w-full h-full rounded-full object-cover bg-slate-50"
        />
      </div>

      {/* Profile Info */}
      <div className="flex-1 text-center md:text-left space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-slate-800">{profile.username}</h1>
          <div className="flex justify-center md:justify-start gap-4 text-sm font-medium">
             <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-slate-700">Follow</span>
             <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-slate-700">Message</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center md:justify-start gap-8 py-2 border-y md:border-none border-slate-100">
          <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
            <span className="font-bold text-slate-900">{profile.posts_count}</span>
            <span className="text-slate-500 text-sm">posts</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-1.5 items-center font-semibold">
            <span className="font-bold text-slate-900">{profile.followers.toLocaleString()}</span>
            <span className="text-slate-500 text-sm font-normal">followers</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-1.5 items-center font-semibold">
            <span className="font-bold text-slate-900">{profile.following.toLocaleString()}</span>
            <span className="text-slate-500 text-sm font-normal">following</span>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <h2 className="font-bold text-slate-900">{profile.full_name}</h2>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed max-w-xl">
            {profile.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
