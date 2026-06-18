import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";

interface Track {
  name: string;
  artist: string;
  file: string;
  cover: string;
}

const playlist: Track[] = [
  { name: "Super Shy", artist: "NewJeans", file: "https://hshyyy.github.io/meigao-helper/music/Super Shy - NewJeans.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Super Shy.jpg" },
  { name: "GO BABY", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/GO BABY - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/GO BABY.jpg" },
  { name: "thank u, next (Explicit)", artist: "Ariana Grande", file: "https://hshyyy.github.io/meigao-helper/music/thank u, next (Explicit) - Ariana Grande.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/thank u, next.jpg" },
  { name: "Heat Waves", artist: "Glass Animals", file: "https://hshyyy.github.io/meigao-helper/music/Heat Waves - Glass Animals.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Heat Waves.jpg" },
  { name: "Work (Derra Flip)", artist: "Drake、Derra、Rihanna", file: "https://hshyyy.github.io/meigao-helper/music/Work (Derra Flip) - Drake、Derra、Rihanna.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Work (Derra Flip).jpg" },
  { name: "Baby", artist: "Justin Bieber、Ludacris", file: "https://hshyyy.github.io/meigao-helper/music/Baby - Justin Bieber、Ludacris.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Baby.jpg" },
  { name: "Beauty And A Beat", artist: "Justin Bieber、Nicki Minaj", file: "https://hshyyy.github.io/meigao-helper/music/Beauty And A Beat - Justin Bieber、Nicki Minaj.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Beauty And A Beat.jpg" },
  { name: "Eenie Meenie", artist: "Justin Bieber、Sean Kingston", file: "https://hshyyy.github.io/meigao-helper/music/Eenie Meenie - Justin Bieber、Sean Kingston.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Eenie Meenie.jpg" },
  { name: "ART", artist: "Tyla", file: "https://hshyyy.github.io/meigao-helper/music/ART - Tyla.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/ART.jpg" },
  { name: "Truth or Dare", artist: "Tyla", file: "https://hshyyy.github.io/meigao-helper/music/Truth or Dare - Tyla.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Truth or Dare.jpg" },
  { name: "Water", artist: "Tyla", file: "https://hshyyy.github.io/meigao-helper/music/Water - Tyla.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Water.jpg" },
  { name: "Conceited (Explicit)", artist: "SZA", file: "https://hshyyy.github.io/meigao-helper/music/Conceited (Explicit) - SZA.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Conceited.jpg" },
  { name: "Snooze (Explicit)", artist: "SZA", file: "https://hshyyy.github.io/meigao-helper/music/Snooze (Explicit) - SZA.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Snooze.jpg" },
  { name: "Open Arms", artist: "SZA、Travis Scott", file: "https://hshyyy.github.io/meigao-helper/music/Open Arms - SZA、Travis Scott.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Open Arms.jpg" },
  { name: "Kiss Me More (Explicit)", artist: "Doja Cat、SZA", file: "https://hshyyy.github.io/meigao-helper/music/Kiss Me More (Explicit) - Doja Cat、SZA.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Kiss Me More.jpg" },
  { name: "BoA - Only One", artist: "BoA", file: "https://hshyyy.github.io/meigao-helper/music/Only One - BoA.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Only One.jpg" },
  { name: "Attention", artist: "Charlie Puth", file: "https://hshyyy.github.io/meigao-helper/music/Attention - Charlie Puth.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Attention.jpg" },
  { name: "Cheating on You", artist: "Charlie Puth", file: "https://hshyyy.github.io/meigao-helper/music/Cheating on You - Charlie Puth.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Cheating on You.jpg" },
  { name: "We Don't Talk Anymore", artist: "Charlie Puth、Selena Gomez", file: "https://hshyyy.github.io/meigao-helper/music/We Don't Talk Anymore (Mr. Collipark Remix) - Charlie Puth、Selena Gomez.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/We Don't Talk Anymore.jpg" },
  { name: "My Jealousy", artist: "Clazziquai", file: "https://hshyyy.github.io/meigao-helper/music/My Jealousy - Clazziquai.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/My Jealousy.jpg" },
  { name: "In My Feelings (Explicit)", artist: "Drake", file: "https://hshyyy.github.io/meigao-helper/music/In My Feelings (Explicit) - Drake.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/In My Feelings.jpg" },
  { name: "Game Time", artist: "Future、Tyla、FIFA Sound", file: "https://hshyyy.github.io/meigao-helper/music/Game Time - Future、Tyla、FIFA Sound.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Game Time.jpg" },
  { name: "玻璃", artist: "Gareth.T", file: "https://hshyyy.github.io/meigao-helper/music/玻璃 - Gareth.T.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/玻璃.jpg" },
  { name: "暮雨2.0", artist: "HYPEEZY、CHECKYHON、邓乐怡", file: "https://hshyyy.github.io/meigao-helper/music/暮雨2.0 (那往事就到此) - HYPEEZY、CHECKYHON、邓乐怡.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/暮雨2.0.svg" },
  { name: "Gravity", artist: "Jai Wolf、JMR", file: "https://hshyyy.github.io/meigao-helper/music/Gravity - Jai Wolf、JMR.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Gravity.jpg" },
  { name: "All That Matters", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/All That Matters - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/All That Matters.jpg" },
  { name: "Boyfriend", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Boyfriend - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Boyfriend.jpg" },
  { name: "Come Around Me", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Come Around Me - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Come Around Me.jpg" },
  { name: "DAISIES", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/DAISIES - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/DAISIES.jpg" },
  { name: "Favorite Girl", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Favorite Girl - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Favorite Girl.jpg" },
  { name: "Heartbreaker", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Heartbreaker - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Heartbreaker.jpg" },
  { name: "Hold On", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Hold On - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Hold On.jpg" },
  { name: "Love Me", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Love Me - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Love Me.jpg" },
  { name: "Love Yourself", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Love Yourself - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Love Yourself.jpg" },
  { name: "One Less Lonely Girl", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/One Less Lonely Girl - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/One Less Lonely Girl.jpg" },
  { name: "One Time", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/One Time - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/One Time.jpg" },
  { name: "Sorry", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Sorry - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Sorry.jpg" },
  { name: "That Should Be Me", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/That Should Be Me - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/That Should Be Me.jpg" },
  { name: "What Do You Mean", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/What Do You Mean - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/What Do You Mean.jpg" },
  { name: "Yummy", artist: "Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Yummy - Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Yummy.jpg" },
  { name: "As Long As You Love Me", artist: "Justin Bieber、Big Sean", file: "https://hshyyy.github.io/meigao-helper/music/As Long As You Love Me - Justin Bieber、Big Sean.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/As Long As You Love Me.jpg" },
  { name: "Confident", artist: "Justin Bieber、Chance the Rapper", file: "https://hshyyy.github.io/meigao-helper/music/Confident - Justin Bieber、Chance the Rapper.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Confident.jpg" },
  { name: "Peaches (Explicit)", artist: "Justin Bieber、Daniel Caesar、GIVĒON", file: "https://hshyyy.github.io/meigao-helper/music/Peaches (Explicit) - Justin Bieber、Daniel Caesar、GIVĒON.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Peaches.jpg" },
  { name: "Running Over", artist: "Justin Bieber、Lil Dicky", file: "https://hshyyy.github.io/meigao-helper/music/Running Over - Justin Bieber、Lil Dicky.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Running Over.jpg" },
  { name: "Intentions", artist: "Justin Bieber、Quavo", file: "https://hshyyy.github.io/meigao-helper/music/Intentions - Justin Bieber、Quavo.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Intentions.jpg" },
  { name: "Let Me Love You", artist: "DJ Snake、Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Let Me Love You - DJ Snake、Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Let Me Love You.jpg" },
  { name: "Scared 2 Be Lonely", artist: "Lil Tjay", file: "https://hshyyy.github.io/meigao-helper/music/Scared 2 Be Lonely - Lil Tjay.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Scared 2 Be Lonely.jpg" },
  { name: "Despacito (Remix)", artist: "Luis Fonsi、Daddy Yankee、Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/Despacito (Remix) - Luis Fonsi、Daddy Yankee、Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Despacito.jpg" },
  { name: "Running Up That Hill", artist: "Meg Myers", file: "https://hshyyy.github.io/meigao-helper/music/Running Up That Hill - Meg Myers.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Running Up That Hill.jpg" },
  { name: "Attention", artist: "NewJeans", file: "https://hshyyy.github.io/meigao-helper/music/Attention - NewJeans.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Attention.jpg" },
  { name: "The Way I Still Love You", artist: "Reynard Silva", file: "https://hshyyy.github.io/meigao-helper/music/The Way I Still Love You - Reynard Silva.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/The Way I Still Love You.jpg" },
  { name: "ONLY LOOK AT ME", artist: "TAEYANG", file: "https://hshyyy.github.io/meigao-helper/music/ONLY LOOK AT ME - TAEYANG.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/ONLY LOOK AT ME.jpg" },
  { name: "Cruel Summer", artist: "Taylor Swift", file: "https://hshyyy.github.io/meigao-helper/music/Cruel Summer - Taylor Swift.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Cruel Summer.jpg" },
  { name: "STAY (Explicit)", artist: "The Kid LAROI、Justin Bieber", file: "https://hshyyy.github.io/meigao-helper/music/STAY (Explicit) - The Kid LAROI、Justin Bieber.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/STAY.jpg" },
  { name: "Die For You", artist: "The Weeknd", file: "https://hshyyy.github.io/meigao-helper/music/Die For You - The Weeknd.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Die For You.jpg" },
  { name: "一半一半", artist: "Top Barry、INDEcompany", file: "https://hshyyy.github.io/meigao-helper/music/一半一半 - Top Barry、INDEcompany.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/一半一半.jpg" },
  { name: "See You Again (Explicit)", artist: "Tyler, The Creator", file: "https://hshyyy.github.io/meigao-helper/music/See You Again (Explicit) - Tyler, The Creator.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/See You Again.jpg" },
  { name: "Hey Daddy", artist: "Usher", file: "https://hshyyy.github.io/meigao-helper/music/Hey Daddy - Usher.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Hey Daddy.jpg" },
  { name: "Super Shy", artist: "NewJeans", file: "https://hshyyy.github.io/meigao-helper/music/Super Shy - NewJeans.mp3", cover: "https://hshyyy.github.io/meigao-helper/music/covers/Super Shy.jpg" },
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
  const [playMode, setPlayModeState] = useState<PlayMode>("loop");
  const playModeRef = useRef<PlayMode>("loop");
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

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // 歌曲结束事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      const mode = playModeRef.current;
      let nextIdx: number;

      if (mode === "single") {
        nextIdx = currentTrack;
      } else if (mode === "shuffle") {
        nextIdx = Math.floor(Math.random() * playlist.length);
      } else {
        nextIdx = (currentTrack + 1) % playlist.length;
      }

      setCurrentTrack(nextIdx);
      audio.src = playlist[nextIdx].file;
      audio.load();
      audio.play().catch(() => {});
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [currentTrack]);

  // 用户交互后自动播放（使用AudioContext绕过浏览器限制）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;
    let audioCtx: AudioContext | null = null;

    const tryPlay = () => {
      if (hasStarted) return;
      hasStarted = true;

      // 创建AudioContext来解锁音频
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(audioCtx.destination);

      audio.play().then(() => {
        console.log("音乐开始播放");
      }).catch((err) => {
        console.log("播放失败:", err);
      });

      // 移除所有监听器
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("scroll", tryPlay);
    };

    // 监听用户交互
    document.addEventListener("click", tryPlay);
    document.addEventListener("touchstart", tryPlay, { passive: true });
    window.addEventListener("scroll", tryPlay, { passive: true });

    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("scroll", tryPlay);
      if (audioCtx) audioCtx.close();
    };
  }, []);

  // 离开页面暂停，回来恢复
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

  // 播放/暂停
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch((err) => {
      console.log("播放失败，尝试重新加载:", err);
      audio.load();
      setTimeout(() => audio.play().catch(() => {}), 500);
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      play();
    }
  }, [isPlaying, play]);

  // 播放指定歌曲
  const playTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTrack(index);
    audio.src = playlist[index].file;
    audio.load();
    audio.play().catch(() => {});
  }, []);

  // 上一首/下一首
  const nextTrack = useCallback(() => {
    const next = playMode === "shuffle" ? Math.floor(Math.random() * playlist.length) : (currentTrack + 1) % playlist.length;
    playTrack(next);
  }, [currentTrack, playMode, playTrack]);

  const prevTrack = useCallback(() => {
    const prev = playMode === "shuffle" ? Math.floor(Math.random() * playlist.length) : (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(prev);
  }, [currentTrack, playMode, playTrack]);

  // 快进/快退
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // 音量
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  // 播放模式
  const setPlayMode = useCallback((m: PlayMode) => {
    setPlayModeState(m);
  }, []);

  return (
    <MusicContext.Provider value={{ playlist, currentTrack, isPlaying, playMode, volume, currentTime, duration, play, pause, togglePlay, nextTrack, prevTrack, playTrack, setVolume, setPlayMode, seek }}>
      <audio ref={audioRef} src={playlist[currentTrack].file} preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}
