import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";

interface Track {
  name: string;
  artist: string;
  file: string;
  cover: string;
}

const playlist: Track[] = [
  { name: "Super Shy", artist: "NewJeans", file: "./music/Super Shy - NewJeans.mp3", cover: "./music/covers/Super Shy.jpg" },
  { name: "GO BABY", artist: "Justin Bieber", file: "./music/GO BABY - Justin Bieber.mp3", cover: "./music/covers/GO BABY.jpg" },
  { name: "thank u, next", artist: "Ariana Grande", file: "./music/thank u, next (Explicit) - Ariana Grande.mp3", cover: "./music/covers/thank u, next.jpg" },
  { name: "Heat Waves", artist: "Glass Animals", file: "./music/Heat Waves - Glass Animals.mp3", cover: "./music/covers/Heat Waves.jpg" },
  { name: "Work", artist: "Drake、Derra、Rihanna", file: "./music/Work (Derra Flip) - Drake、Derra、Rihanna.mp3", cover: "./music/covers/Work.jpg" },
  { name: "All That Matters", artist: "Justin Bieber", file: "./music/All That Matters - Justin Bieber.mp3", cover: "./music/covers/All That Matters.jpg" },
  { name: "Boyfriend", artist: "Justin Bieber", file: "./music/Boyfriend - Justin Bieber.mp3", cover: "./music/covers/Boyfriend.jpg" },
  { name: "Baby", artist: "Justin Bieber、Ludacris", file: "./music/Baby - Justin Bieber、Ludacris.mp3", cover: "./music/covers/Baby.jpg" },
  { name: "Love Yourself", artist: "Justin Bieber", file: "./music/Love Yourself - Justin Bieber.mp3", cover: "./music/covers/Love Yourself.jpg" },
  { name: "Sorry", artist: "Justin Bieber", file: "./music/Sorry - Justin Bieber.mp3", cover: "./music/covers/Sorry.jpg" },
  { name: "What Do You Mean", artist: "Justin Bieber", file: "./music/What Do You Mean - Justin Bieber.mp3", cover: "./music/covers/What Do You Mean.jpg" },
  { name: "Yummy", artist: "Justin Bieber", file: "./music/Yummy - Justin Bieber.mp3", cover: "./music/covers/Yummy.jpg" },
  { name: "STAY", artist: "The Kid LAROI、Justin Bieber", file: "./music/STAY (Explicit) - The Kid LAROI、Justin Bieber.mp3", cover: "./music/covers/STAY.jpg" },
  { name: "Peaches", artist: "Justin Bieber", file: "./music/Peaches (Explicit) - Justin Bieber、Daniel Caesar、GIVĒON.mp3", cover: "./music/covers/Peaches.jpg" },
  { name: "Intentions", artist: "Justin Bieber、Quavo", file: "./music/Intentions - Justin Bieber、Quavo.mp3", cover: "./music/covers/Intentions.jpg" },
  { name: "Let Me Love You", artist: "DJ Snake、Justin Bieber", file: "./music/Let Me Love You - DJ Snake、Justin Bieber.mp3", cover: "./music/covers/Let Me Love You.jpg" },
  { name: "Cruel Summer", artist: "Taylor Swift", file: "./music/Cruel Summer - Taylor Swift.mp3", cover: "./music/covers/Cruel Summer.jpg" },
  { name: "Die For You", artist: "The Weeknd", file: "./music/Die For You - The Weeknd.mp3", cover: "./music/covers/Die For You.jpg" },
  { name: "Attention", artist: "Charlie Puth", file: "./music/Attention - Charlie Puth.mp3", cover: "./music/covers/Attention.jpg" },
  { name: "See You Again", artist: "Tyler, The Creator", file: "./music/See You Again (Explicit) - Tyler, The Creator.mp3", cover: "./music/covers/See You Again.jpg" },
  { name: "Water", artist: "Tyla", file: "./music/Water - Tyla.mp3", cover: "./music/covers/Water.jpg" },
  { name: "ART", artist: "Tyla", file: "./music/ART - Tyla.mp3", cover: "./music/covers/ART.jpg" },
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
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 音频事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (playMode === "single") {
        audio.currentTime = 0;
        audio.play();
      } else if (playMode === "shuffle") {
        setCurrentTrack(Math.floor(Math.random() * playlist.length));
      } else {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playMode]);

  // 切换歌曲时加载并播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;
    audio.src = playlist[currentTrack].file;
    audio.load();
    audio.play().catch(() => {});
  }, [currentTrack, hasInteracted]);

  // 用户交互后触发播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
      audio.src = playlist[0].file;
      audio.load();
      audio.play().catch(() => {});
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [hasInteracted]);

  // 音量
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // 离开暂停，回来恢复
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let wasPlaying = false;

    const onVis = () => {
      if (document.hidden) {
        wasPlaying = !audio.paused;
        audio.pause();
      } else if (wasPlaying) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const play = useCallback(() => { audioRef.current?.play().catch(() => {}); }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); }, []);
  const togglePlay = useCallback(() => { isPlaying ? pause() : play(); }, [isPlaying, play, pause]);
  const seek = useCallback((t: number) => { if (audioRef.current) audioRef.current.currentTime = t; }, []);
  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => playMode === "shuffle" ? Math.floor(Math.random() * playlist.length) : (prev + 1) % playlist.length);
  }, [playMode]);
  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => playMode === "shuffle" ? Math.floor(Math.random() * playlist.length) : (prev - 1 + playlist.length) % playlist.length);
  }, [playMode]);
  const playTrack = useCallback((idx: number) => { setCurrentTrack(idx); }, []);

  return (
    <MusicContext.Provider value={{ playlist, currentTrack, isPlaying, playMode, volume, currentTime, duration, play, pause, togglePlay, nextTrack, prevTrack, playTrack, setVolume, setPlayMode, seek }}>
      <audio ref={audioRef} preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}
