import { useState, useRef, useEffect } from "react";

const playlist = [
  { name: "JULY", artist: "JULY", file: "/music/JULY.FLAC" },
  { name: "Bad Girl", artist: "Unknown", file: "/music/Bad Girl.FLAC" },
  { name: "November Rain", artist: "Guns N' Roses", file: "/music/November Rain.FLAC" },
  { name: "The Way I Still Love You", artist: "Reynard Silva", file: "/music/Reynard Silva - The Way I Still Love You.flac" },
  { name: "ONLY LOOK AT ME", artist: "TAEYANG", file: "/music/TAEYANG - ONLY LOOK AT ME.flac" },
  { name: "Work", artist: "Drake ft. Rihanna", file: "/music/Drake、Derra、Rihanna - Work (Derra Flip).mp3" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    if (audioRef.current) {
      audioRef.current.src = playlist[index].file;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % playlist.length;
    playTrack(next);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  };

  return (
    <div className="relative">
      <audio ref={audioRef} src={playlist[currentTrack].file} onEnded={nextTrack} />

      {/* 播放器控制 */}
      <div className="bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30 p-2 flex items-center gap-2">
        {/* 播放/暂停 */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-white/30 text-white rounded-full hover:bg-white/50 transition-colors"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* 歌曲信息 */}
        <div className="text-white text-xs max-w-32 truncate">
          <p className="font-medium">{playlist[currentTrack].name}</p>
          <p className="opacity-70">{playlist[currentTrack].artist}</p>
        </div>

        {/* 上一首 */}
        <button
          onClick={prevTrack}
          className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          ⏮
        </button>

        {/* 下一首 */}
        <button
          onClick={nextTrack}
          className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          ⏭
        </button>

        {/* 音量 */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/70">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1"
          />
        </div>

        {/* 歌曲列表 */}
        <button
          onClick={() => setShowList(!showList)}
          className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          📋
        </button>
      </div>

      {/* 歌曲列表 */}
      {showList && (
        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-56">
          <p className="text-xs text-gray-500 mb-2">🎵 播放列表</p>
          {playlist.map((track, index) => (
            <button
              key={index}
              onClick={() => playTrack(index)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                index === currentTrack
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{index === currentTrack && isPlaying ? "▶" : "🎵"}</span>
                <div>
                  <p className="font-medium">{track.name}</p>
                  <p className="text-xs text-gray-400">{track.artist}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
