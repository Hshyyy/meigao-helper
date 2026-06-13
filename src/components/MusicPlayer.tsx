import { useState } from "react";
import { useMusic } from "../contexts/MusicContext";

export default function MusicPlayer() {
  const {
    playlist, currentTrack, isPlaying, playMode, volume,
    currentTime, duration, togglePlay, nextTrack, prevTrack,
    playTrack, setVolume, setPlayMode, seek,
  } = useMusic();

  const [expanded, setExpanded] = useState(false);
  const [showList, setShowList] = useState(false);

  const getPlayModeIcon = () => playMode === "loop" ? "🔁" : playMode === "single" ? "🔂" : "🔀";
  const getPlayModeTooltip = () => playMode === "loop" ? "Loop" : playMode === "single" ? "Single" : "Shuffle";
  const togglePlayMode = () => {
    const modes = ["loop", "single", "shuffle"] as const;
    setPlayMode(modes[(modes.indexOf(playMode) + 1) % 3]);
  };
  const formatTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width * duration);
  };

  if (playlist.length === 0) return null;

  return (
    <div className="relative">
      {/* 收缩状态 */}
      {!expanded && (
        <button onClick={() => setExpanded(true)} className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all">
          <div className={`relative w-14 h-14 rounded-full animate-spin-slow ${isPlaying ? 'animate-water-ripple' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
            <img
              src={playlist[currentTrack].cover}
              alt={playlist[currentTrack].name}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
        </button>
      )}

      {/* 展开状态 */}
      {expanded && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 w-72">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setShowList(!showList)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Playlist">📋 Playlist</button>
            <button onClick={() => { setExpanded(false); setShowList(false); }} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors" title="Close">✕</button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className={`relative w-12 h-12 rounded-lg ${isPlaying ? 'animate-water-ripple-light' : ''}`}>
              <img src={playlist[currentTrack].cover} alt={playlist[currentTrack].name} className="w-12 h-12 rounded-lg object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium truncate">{playlist[currentTrack].name}</p>
              <p className="text-gray-500 text-xs truncate">{playlist[currentTrack].artist}</p>
            </div>
          </div>

          <div className="mb-3">
            <div onClick={handleProgressClick} className="relative h-1.5 bg-gray-200 rounded-full cursor-pointer group">
              <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500 text-xs">{formatTime(currentTime)}</span>
              <span className="text-gray-500 text-xs">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={togglePlayMode} title={getPlayModeTooltip()} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              {getPlayModeIcon()} {getPlayModeTooltip()}
            </button>
            <button onClick={prevTrack} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">⏮</button>
            <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">{isPlaying ? "⏸" : "▶"}</button>
            <button onClick={nextTrack} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">⏭</button>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">🔊</span>
              <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-16 h-1" />
            </div>
          </div>
        </div>
      )}

      {/* 歌曲列表 */}
      {showList && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 min-w-56 max-h-64 flex flex-col">
          <div className="flex items-center justify-between p-3 pb-2 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">🎵 Playlist</p>
              <span className="text-xs text-gray-400">{getPlayModeTooltip()}</span>
            </div>
            <button onClick={() => setShowList(false)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {playlist.map((track, index) => (
              <button key={index} onClick={() => { playTrack(index); setShowList(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${index === currentTrack ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"}`}>
                <div className="flex items-center gap-2">
                  <img src={track.cover} alt={track.name} className="w-8 h-8 rounded object-cover" />
                  <div><p className="font-medium">{track.name}</p><p className="text-xs text-gray-400">{track.artist}</p></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
