import { useState, useRef, useEffect, useCallback } from "react";

interface Track {
  name: string;
  artist: string;
  file: string;
  cover: string;
}

const playlist: Track[] = [
  // 歌曲将在下载后添加
];

type PlayMode = "loop" | "single" | "shuffle";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("loop");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 同步音频状态
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => handleTrackEnd();
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // 设置音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 处理歌曲结束
  const handleTrackEnd = useCallback(() => {
    if (playMode === "single") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (playMode === "shuffle") {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      playTrack(randomIndex);
    } else {
      nextTrack();
    }
  }, [playMode]);

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
    let next: number;
    if (playMode === "shuffle") {
      next = Math.floor(Math.random() * playlist.length);
    } else {
      next = (currentTrack + 1) % playlist.length;
    }
    playTrack(next);
  }, [currentTrack, playMode, playTrack]);

  // 上一首
  const prevTrack = useCallback(() => {
    let prev: number;
    if (playMode === "shuffle") {
      prev = Math.floor(Math.random() * playlist.length);
    } else {
      prev = (currentTrack - 1 + playlist.length) % playlist.length;
    }
    playTrack(prev);
  }, [currentTrack, playMode, playTrack]);

  // 切换播放模式
  const togglePlayMode = useCallback(() => {
    const modes: PlayMode[] = ["loop", "single", "shuffle"];
    const currentIndex = modes.indexOf(playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPlayMode(modes[nextIndex]);
  }, [playMode]);

  // 获取播放模式图标
  const getPlayModeIcon = () => {
    switch (playMode) {
      case "loop":
        return "🔁";
      case "single":
        return "🔂";
      case "shuffle":
        return "🔀";
    }
  };

  // 获取播放模式提示
  const getPlayModeTooltip = () => {
    switch (playMode) {
      case "loop":
        return "列表循环";
      case "single":
        return "单曲循环";
      case "shuffle":
        return "随机播放";
    }
  };

  // 点击进度条跳转
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    audio.currentTime = progress * audio.duration;
  }, []);

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 计算进度百分比
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (playlist.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <audio ref={audioRef} src={playlist[currentTrack].file} preload="auto" />

      {/* 播放器控制 */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-3 w-80">
        {/* 歌曲信息 */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={playlist[currentTrack].cover}
            alt={playlist[currentTrack].name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{playlist[currentTrack].name}</p>
            <p className="text-white/70 text-xs truncate">{playlist[currentTrack].artist}</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-3">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
          >
            {/* 已播放部分 */}
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />

            {/* 拖动按钮 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* 时间显示 */}
          <div className="flex justify-between mt-1">
            <span className="text-white/70 text-xs">{formatTime(currentTime)}</span>
            <span className="text-white/70 text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-between">
          {/* 播放模式 */}
          <button
            onClick={togglePlayMode}
            title={getPlayModeTooltip()}
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            {getPlayModeIcon()}
          </button>

          {/* 上一首 */}
          <button
            onClick={prevTrack}
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            ⏮
          </button>

          {/* 播放/暂停 */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-12 h-12 flex items-center justify-center bg-white/30 text-white rounded-full hover:bg-white/50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "⏳" : isPlaying ? "⏸" : "▶"}
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
        </div>

        {/* 歌曲列表按钮 */}
        <button
          onClick={() => setShowList(!showList)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          📋
        </button>
      </div>

      {/* 歌曲列表 */}
      {showList && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-56 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">🎵 播放列表</p>
            <span className="text-xs text-gray-400">{getPlayModeTooltip()}</span>
          </div>
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
