import React, { useState } from 'react';
import { ExternalLink, Play, Search, Video, Eye, EyeOff } from 'lucide-react';
import { WorkoutDay } from '../data/workouts';

interface VideoSectionProps {
  workout: WorkoutDay;
  prominentCTA?: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ workout, prominentCTA = true }) => {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCD6F7]/60 shadow-[0_4px_20px_rgba(118,99,184,0.04)] space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7663B8]">
            <Video className="w-3.5 h-3.5 text-[#7663B8]" />
            <span>Follow-Along Video Routine</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{workout.channelName}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{workout.duration}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#30283D] mt-0.5 tracking-tight">
            {workout.videoTitle}
          </h3>
        </div>

        {/* In-App Embed Toggle */}
        <button
          onClick={() => setShowEmbed(!showEmbed)}
          className="self-start sm:self-auto text-xs font-medium text-[#7663B8] hover:text-[#6452A3] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9FC] hover:bg-[#FCE7F0]/60 border border-[#DCD6F7]/50 transition-colors"
        >
          {showEmbed ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Video Player</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Video in App</span>
            </>
          )}
        </button>
      </div>

      {/* Embedded Video Player (Optional Accordion / Viewer) */}
      {showEmbed && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner animate-in fade-in duration-300">
          <iframe
            src={workout.youtubeEmbedUrl}
            title={workout.videoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Prominent Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        {/* Primary Watch on YouTube CTA */}
        <a
          href={workout.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[48px] px-5 py-3 rounded-2xl bg-[#E62117] hover:bg-[#cc1810] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-md shadow-red-500/15 hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <div className="w-6 h-6 rounded-md bg-white text-[#E62117] flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
          <span>Watch on YouTube</span>
          <ExternalLink className="w-4 h-4 text-white/80" />
        </a>

        {/* Secondary Alternative YouTube Search */}
        <a
          href={workout.youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#FFF9FC] hover:bg-[#FCE7F0]/60 border border-[#DCD6F7] text-xs font-semibold text-[#7663B8] flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          title="Search more workout variations for this routine"
        >
          <Search className="w-3.5 h-3.5" />
          <span>More {workout.categoryLabel} Videos</span>
        </a>
      </div>

      <p className="text-[11px] text-slate-400 text-center sm:text-left leading-normal">
        Opens YouTube in a secure new tab. Follow along with the instructor, then return to mark off your exercises!
      </p>
    </div>
  );
};
