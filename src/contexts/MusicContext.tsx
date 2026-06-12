import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";

interface Track {
  name: string;
  artist: string;
  file: string;
  cover: string;
}

const playlist: Track[] = [
  { name: "JULY", artist: "Kris Wu", file: "/music/JULY.FLAC", cover: "/music/covers/JULY.jpg" },
  { name: "Bad Girl", artist: "Kris Wu", file: "/music/Bad Girl.FLAC", cover: "/music/covers/Bad Girl.jpg" },
  { name: "November Rain", artist: "Kris Wu", file: "/music/November Rain.FLAC", cover: "/music/covers/November Rain.jpg" },
  { name: "Despacito (Remix)", artist: "Luis Fonsi, Daddy Yankee, Justin Bieber", file: "/music/Despacito (Remix) - Luis Fonsi、Daddy Yankee、Justin Bieber.mp3", cover: "/music/covers/Despacito.jpg" },
  { name: "My Jealousy", artist: "Clazziquai", file: "/music/My Jealousy - Clazziquai.mp3", cover: "/music/covers/My Jealousy.svg" },
  { name: "ONLY LOOK AT ME", artist: "TAEYANG", file: "/music/ONLY LOOK AT ME - TAEYANG.mp3", cover: "/music/covers/ONLY LOOK AT ME.jpg" },
  { name: "The Way I Still Love You", artist: "Reynard Silva", file: "/music/The Way I Still Love You - Reynard Silva.mp3", cover: "/music/covers/The Way I Still Love You.jpg" },
  { name: "Work (Derra Flip)", artist: "Drake, Derra, Rihanna", file: "/music/Work (Derra Flip) - Drake、Derra、Rihanna.mp3", cover: "/music/covers/Work.jpg" },
  { name: "一半一半", artist: "Top Barry", file: "/music/一半一半 - Top Barry、INDEcompany.mp3", cover: "/music/covers/一半一半.svg" },
  { name: "暮雨2.0", artist: "HYPEEZY", file: "/music/暮雨2.0 (那往事就到此) - HYPEEZY、CHECKYHON、邓乐怡.mp3", cover: "/music/covers/暮雨2.0.svg" },
  { name: "玻璃", artist: "Gareth.T", file: "/music/玻璃 - Gareth.T.mp3", cover: "/music/covers/玻璃.svg" },
];

type PlayMode = "loop" | "single" | "shuffle";

interface MusicContextType {
  playlist: Track[];
  currentTrack: number;
  isPlaying: boolean;
  playMode: PlayMode;
  volume: number;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playTrack: (index: number) => void;
  setVolume: (v: number) => void;
  setPlayMode: (m: PlayMode) => void;
  seek: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}

// 全局标记，防止 HMR 时重复自动播放
let hasAutoPlayed = false;

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playModeRef = useRef<PlayMode>("loop");
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayModeState] = useState<PlayMode>("loop");
  const [volume, setVolumeState] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 同步 playMode ref
  useEffect(() => { playModeRef.current = playMode; }, [playMode]);

  // 设置音量
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);

    const onEnded = () => {
      const mode = playModeRef.current;
      if (mode === "single") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (mode === "shuffle") {
        const idx = Math.floor(Math.random() * playlist.length);
        setCurrentTrack(idx);
        audio.src = playlist[idx].file;
        audio.load();
        audio.play().catch(() => {});
      } else {
        const idx = (currentTrack + 1) % playlist.length;
        setCurrentTrack(idx);
        audio.src = playlist[idx].file;
        audio.load();
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [currentTrack]);

  // 首次进入自动播放（只触发一次）
  useEffect(() => {
    if (hasAutoPlayed) return;
    hasAutoPlayed = true;

    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.play().catch(() => {});
    };

    // 延迟播放，确保页面加载完成
    setTimeout(tryPlay, 1000);
  }, []);

  // 离开暂停，回来恢复
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let wasPlaying = false;

    const handleVisibility = () => {
      if (document.hidden) {
        wasPlaying = !audio.paused;
        audio.pause();
      } else if (wasPlaying) {
        audio.play().catch(() => {});
      }
    };

    const handleBeforeUnload = () => audio.pause();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const play = useCallback(() => { audioRef.current?.play().catch(() => {}); }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); }, []);
  const togglePlay = useCallback(() => { isPlaying ? pause() : play(); }, [isPlaying, play, pause]);

  const playTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTrack(index);
    audio.src = playlist[index].file;
    audio.load();
    audio.addEventListener("canplay", () => { audio.play().catch(() => {}); }, { once: true });
  }, []);

  const nextTrack = useCallback(() => {
    const next = playMode === "shuffle" ? Math.floor(Math.random() * playlist.length) : (currentTrack + 1) % playlist.length;
    playTrack(next);
  }, [currentTrack, playMode, playTrack]);

  const prevTrack = useCallback(() => {
    const prev = playMode === "shuffle" ? Math.floor(Math.random() * playlist.length) : (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  }, [currentTrack, playMode, playTrack]);

  const seek = useCallback((time: number) => { if (audioRef.current) audioRef.current.currentTime = time; }, []);
  const setVolume = useCallback((v: number) => { setVolumeState(v); }, []);
  const setPlayMode = useCallback((m: PlayMode) => { setPlayModeState(m); }, []);

  return (
    <MusicContext.Provider value={{ playlist, currentTrack, isPlaying, playMode, volume, currentTime, duration, play, pause, togglePlay, nextTrack, prevTrack, playTrack, setVolume, setPlayMode, seek }}>
      <audio ref={audioRef} src={playlist[currentTrack].file} preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}
