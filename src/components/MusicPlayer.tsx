import { useState, useRef, useEffect, useCallback } from "react";

const playlist: Array<{name: string; artist: string; file: string; cover: string}> = [
  // 歌曲将在下载后添加
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 同步音频状态
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => nextTrack();
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // 设置音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 播放/暂停切换
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.log("播放失败:", err);
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  // 播放指定歌曲
  const playTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTrack(index);
    audio.src = playlist[index].file;
    audio.load();
    audio.play().catch((err) => {
      console.log("播放失败:", err);
      setIsPlaying(false);
    });
  }, []);

  // 下一首
  const nextTrack = useCallback(() => {
    const next = (currentTrack + 1) % playlist.length;
    playTrack(next);
  }, [currentTrack, playTrack]);

  // 上一首
  const prevTrack = useCallback(() => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  }, [currentTrack, playTrack]);

  return (
    <div className="relative">
      <audio ref={audioRef} src={playlist[currentTrack].file} preload="auto" />

      {/* 播放器控制 */}
      <div className="bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30 p-2 flex items-center gap-2">
        {/* 封面图 */}
        <img
          src={playlist[currentTrack].cover}
          alt={playlist[currentTrack].name}
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* 播放/暂停按钮 */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-10 h-10 flex items-center justify-center bg-white/30 text-white rounded-full hover:bg-white/50 transition-colors disabled:opacity-50"
        >
          {isLoading ? "⏳" : isPlaying ? "⏸" : "▶"}
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
              onClick={() => {
                playTrack(index);
                setShowList(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                index === currentTrack
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={track.cover}
                  alt={track.name}
                  className="w-8 h-8 rounded object-cover"
                />
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
