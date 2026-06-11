import { useState, useRef, useEffect } from "react";

const playlist = [
  { name: "JULY", file: "/music/JULY.FLAC" },
  { name: "Bad Girl", file: "/music/Bad Girl.FLAC" },
  { name: "November Rain", file: "/music/November Rain.FLAC" },
  { name: "The Way I Still Love You", file: "/music/Reynard Silva - The Way I Still Love You.flac" },
  { name: "ONLY LOOK AT ME", file: "/music/TAEYANG - ONLY LOOK AT ME.flac" },
  { name: "Work", file: "/music/Drake、Derra、Rihanna - Work (Derra Flip).mp3" },
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
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = playlist[index].file;
      audioRef.current.play();
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
    <div className="fixed bottom-4 left-4 z-50">
      <audio ref={audioRef} src={playlist[currentTrack].file} onEnded={nextTrack} />

      {/* 播放器控制 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-2">
        {/* 上一首 */}
        <button
          onClick={prevTrack}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          ⏮
        </button>

        {/* 播放/暂停 */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* 下一首 */}
        <button
          onClick={nextTrack}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          ⏭
        </button>

        {/* 音量 */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">🔊</span>
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
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          📋
        </button>
      </div>

      {/* 歌曲列表 */}
      {showList && (
        <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-48">
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
              {index === currentTrack && isPlaying ? "▶ " : ""}{track.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
