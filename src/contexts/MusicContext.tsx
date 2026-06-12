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

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("loop");
  const [volume, setVolumeState] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (playMode === "single") { audio.currentTime = 0; audio.play(); }
      else if (playMode === "shuffle") { playTrack(Math.floor(Math.random() * playlist.length)); }
      else { nextTrack(); }
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, [playMode]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  // 进入网站自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let tried = false;
    const tryPlay = () => {
      if (tried) return;
      tried = true;
      audio.play().catch(() => {});
    };

    if (document.readyState === "complete") {
      setTimeout(tryPlay, 500);
    } else {
      window.addEventListener("load", () => setTimeout(tryPlay, 500));
    }

    return () => { tried = true; };
  }, []);

  // 切换标签页或离开网站时暂停
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      }
    };

    const handleBeforeUnload = () => {
      audio.pause();
    };

    const handleBlur = () => {
      audio.pause();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleBlur);
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
    const onReady = () => { audio.play().catch(() => {}); audio.removeEventListener("canplay", onReady); };
    audio.addEventListener("canplay", onReady);
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

  return (
    <MusicContext.Provider value={{ playlist, currentTrack, isPlaying, playMode, volume, currentTime, duration, play, pause, togglePlay, nextTrack, prevTrack, playTrack, setVolume, setPlayMode, seek }}>
      <audio ref={audioRef} src={playlist[currentTrack].file} preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}
