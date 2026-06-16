import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";

interface Track {
  name: string;
  artist: string;
  file: string;
  cover: string;
}

const playlist: Track[] = [
  // 第一组：固定顺序（前5首）
  { name: "Super Shy", artist: "NewJeans", file: "/music/Super Shy - NewJeans.mp3", cover: "/music/covers/Super Shy.jpg" },
  { name: "GO BABY", artist: "Justin Bieber", file: "/music/GO BABY - Justin Bieber.mp3", cover: "/music/covers/GO BABY.jpg" },
  { name: "thank u, next (Explicit)", artist: "Ariana Grande", file: "/music/thank u, next (Explicit) - Ariana Grande.mp3", cover: "/music/covers/thank u, next.jpg" },
  { name: "Heat Waves", artist: "Glass Animals", file: "/music/Heat Waves - Glass Animals.mp3", cover: "/music/covers/Heat Waves.jpg" },
  { name: "Work (Derra Flip)", artist: "Drake、Derra、Rihanna", file: "/music/Work (Derra Flip) - Drake、Derra、Rihanna.mp3", cover: "/music/covers/Work (Derra Flip).jpg" },

  // Kris Wu
  { name: "JULY", artist: "Kris Wu", file: "/music/JULY.FLAC", cover: "/music/covers/JULY.jpg" },
  { name: "Bad Girl", artist: "Kris Wu", file: "/music/Bad Girl.FLAC", cover: "/music/covers/Bad Girl.jpg" },
  { name: "November Rain", artist: "Kris Wu", file: "/music/November Rain.FLAC", cover: "/music/covers/November Rain.jpg" },
  { name: "大碗宽面", artist: "Kris Wu", file: "/music/大碗宽面 - Kris Wu.FLAC", cover: "/music/covers/大碗宽面.jpg" },

  // Justin Bieber（Baby第一，Beauty第二，Eenie第三）
  { name: "Baby", artist: "Justin Bieber、Ludacris", file: "/music/Baby - Justin Bieber、Ludacris.mp3", cover: "/music/covers/Baby.jpg" },
  { name: "Beauty And A Beat", artist: "Justin Bieber、Nicki Minaj", file: "/music/Beauty And A Beat - Justin Bieber、Nicki Minaj.mp3", cover: "/music/covers/Beauty And A Beat.jpg" },
  { name: "Eenie Meenie", artist: "Justin Bieber、Sean Kingston", file: "/music/Eenie Meenie - Justin Bieber、Sean Kingston.mp3", cover: "/music/covers/Eenie Meenie.jpg" },
  { name: "All That Matters", artist: "Justin Bieber", file: "/music/All That Matters - Justin Bieber.mp3", cover: "/music/covers/All That Matters.jpg" },
  { name: "As Long As You Love Me", artist: "Justin Bieber、Big Sean", file: "/music/As Long As You Love Me - Justin Bieber、Big Sean.mp3", cover: "/music/covers/As Long As You Love Me.jpg" },
  { name: "Boyfriend", artist: "Justin Bieber", file: "/music/Boyfriend - Justin Bieber.mp3", cover: "/music/covers/Boyfriend.jpg" },
  { name: "Come Around Me", artist: "Justin Bieber", file: "/music/Come Around Me - Justin Bieber.mp3", cover: "/music/covers/Come Around Me.jpg" },
  { name: "Confident", artist: "Justin Bieber、Chance the Rapper", file: "/music/Confident - Justin Bieber、Chance the Rapper.mp3", cover: "/music/covers/Confident.jpg" },
  { name: "DAISIES", artist: "Justin Bieber", file: "/music/DAISIES - Justin Bieber.mp3", cover: "/music/covers/DAISIES.jpg" },
  { name: "Favorite Girl", artist: "Justin Bieber", file: "/music/Favorite Girl - Justin Bieber.mp3", cover: "/music/covers/Favorite Girl.jpg" },
  { name: "Heartbreaker", artist: "Justin Bieber", file: "/music/Heartbreaker - Justin Bieber.mp3", cover: "/music/covers/Heartbreaker.jpg" },
  { name: "Hold On", artist: "Justin Bieber", file: "/music/Hold On - Justin Bieber.mp3", cover: "/music/covers/Hold On.jpg" },
  { name: "Intentions", artist: "Justin Bieber、Quavo", file: "/music/Intentions - Justin Bieber、Quavo.mp3", cover: "/music/covers/Intentions.jpg" },
  { name: "Let Me Love You", artist: "DJ Snake、Justin Bieber", file: "/music/Let Me Love You - DJ Snake、Justin Bieber.mp3", cover: "/music/covers/Let Me Love You.jpg" },
  { name: "Love Me", artist: "Justin Bieber", file: "/music/Love Me - Justin Bieber.mp3", cover: "/music/covers/Love Me.jpg" },
  { name: "Love Yourself", artist: "Justin Bieber", file: "/music/Love Yourself - Justin Bieber.mp3", cover: "/music/covers/Love Yourself.jpg" },
  { name: "One Less Lonely Girl", artist: "Justin Bieber", file: "/music/One Less Lonely Girl - Justin Bieber.mp3", cover: "/music/covers/One Less Lonely Girl.jpg" },
  { name: "One Time", artist: "Justin Bieber", file: "/music/One Time - Justin Bieber.mp3", cover: "/music/covers/One Time.jpg" },
  { name: "Peaches (Explicit)", artist: "Justin Bieber、Daniel Caesar、GIVĒON", file: "/music/Peaches (Explicit) - Justin Bieber、Daniel Caesar、GIVĒON.mp3", cover: "/music/covers/Peaches.jpg" },
  { name: "Running Over", artist: "Justin Bieber、Lil Dicky", file: "/music/Running Over - Justin Bieber、Lil Dicky.mp3", cover: "/music/covers/Running Over.jpg" },
  { name: "Sorry", artist: "Justin Bieber", file: "/music/Sorry - Justin Bieber.mp3", cover: "/music/covers/Sorry.jpg" },
  { name: "STAY (Explicit)", artist: "The Kid LAROI、Justin Bieber", file: "/music/STAY (Explicit) - The Kid LAROI、Justin Bieber.mp3", cover: "/music/covers/STAY.jpg" },
  { name: "That Should Be Me", artist: "Justin Bieber", file: "/music/That Should Be Me - Justin Bieber.mp3", cover: "/music/covers/That Should Be Me.jpg" },
  { name: "What Do You Mean", artist: "Justin Bieber", file: "/music/What Do You Mean - Justin Bieber.mp3", cover: "/music/covers/What Do You Mean.jpg" },
  { name: "Yummy", artist: "Justin Bieber", file: "/music/Yummy - Justin Bieber.mp3", cover: "/music/covers/Yummy.jpg" },

  // Tyla
  { name: "ART", artist: "Tyla", file: "/music/ART - Tyla.mp3", cover: "/music/covers/ART.jpg" },
  { name: "Truth or Dare", artist: "Tyla", file: "/music/Truth or Dare - Tyla.mp3", cover: "/music/covers/Truth or Dare.jpg" },
  { name: "Water", artist: "Tyla", file: "/music/Water - Tyla.mp3", cover: "/music/covers/Water.jpg" },

  // SZA
  { name: "Conceited (Explicit)", artist: "SZA", file: "/music/Conceited (Explicit) - SZA.mp3", cover: "/music/covers/Conceited.jpg" },
  { name: "Snooze (Explicit)", artist: "SZA", file: "/music/Snooze (Explicit) - SZA.mp3", cover: "/music/covers/Snooze.jpg" },
  { name: "Open Arms", artist: "SZA、Travis Scott", file: "/music/Open Arms - SZA、Travis Scott.mp3", cover: "/music/covers/Open Arms.jpg" },
  { name: "Kiss Me More (Explicit)", artist: "Doja Cat、SZA", file: "/music/Kiss Me More (Explicit) - Doja Cat、SZA.mp3", cover: "/music/covers/Kiss Me More.jpg" },

  // 其他歌曲（按歌手分组）
  // BoA
  { name: "Only One", artist: "BoA", file: "/music/Only One - BoA.mp3", cover: "/music/covers/Only One.jpg" },
  // Charlie Puth
  { name: "Attention", artist: "Charlie Puth", file: "/music/Attention - Charlie Puth.mp3", cover: "/music/covers/Attention - Charlie Puth.jpg" },
  { name: "Cheating on You", artist: "Charlie Puth", file: "/music/Cheating on You - Charlie Puth.mp3", cover: "/music/covers/Cheating on You.jpg" },
  { name: "We Don't Talk Anymore (Mr. Collipark Remix)", artist: "Charlie Puth、Selena Gomez", file: "/music/We Don't Talk Anymore (Mr. Collipark Remix) - Charlie Puth、Selena Gomez.mp3", cover: "/music/covers/We Don't Talk Anymore.jpg" },
  // Clazziquai
  { name: "My Jealousy", artist: "Clazziquai", file: "/music/My Jealousy - Clazziquai.mp3", cover: "/music/covers/My Jealousy.jpg" },
  // Drake
  { name: "In My Feelings (Explicit)", artist: "Drake", file: "/music/In My Feelings (Explicit) - Drake.mp3", cover: "/music/covers/In My Feelings.jpg" },
  // Future
  { name: "Game Time", artist: "Future、Tyla、FIFA Sound", file: "/music/Game Time - Future、Tyla、FIFA Sound.mp3", cover: "/music/covers/Game Time.jpg" },
  // Gareth.T
  { name: "玻璃", artist: "Gareth.T", file: "/music/玻璃 - Gareth.T.mp3", cover: "/music/covers/玻璃.jpg" },
  // HYPEEZY
  { name: "暮雨2.0 (那往事就到此)", artist: "HYPEEZY、CHECKYHON、邓乐怡", file: "/music/暮雨2.0 (那往事就到此) - HYPEEZY、CHECKYHON、邓乐怡.mp3", cover: "/music/covers/暮雨2.0 (那往事就到此).jpg" },
  // Jai Wolf
  { name: "Gravity", artist: "Jai Wolf、JMR", file: "/music/Gravity - Jai Wolf、JMR.mp3", cover: "/music/covers/Gravity.jpg" },
  // Lil Tjay
  { name: "Scared 2 Be Lonely", artist: "Lil Tjay", file: "/music/Scared 2 Be Lonely - Lil Tjay.mp3", cover: "/music/covers/Scared 2 Be Lonely.jpg" },
  // Luis Fonsi
  { name: "Despacito (Remix)", artist: "Luis Fonsi、Daddy Yankee、Justin Bieber", file: "/music/Despacito (Remix) - Luis Fonsi、Daddy Yankee、Justin Bieber.mp3", cover: "/music/covers/Despacito (Remix).jpg" },
  // Meg Myers
  { name: "Running Up That Hill", artist: "Meg Myers", file: "/music/Running Up That Hill - Meg Myers.mp3", cover: "/music/covers/Running Up That Hill.jpg" },
  // NewJeans
  { name: "Attention", artist: "NewJeans", file: "/music/Attention - NewJeans.mp3", cover: "/music/covers/Attention.jpg" },
  // Reynard Silva
  { name: "The Way I Still Love You", artist: "Reynard Silva", file: "/music/The Way I Still Love You - Reynard Silva.mp3", cover: "/music/covers/The Way I Still Love You.jpg" },
  // TAEYANG
  { name: "ONLY LOOK AT ME", artist: "TAEYANG", file: "/music/ONLY LOOK AT ME - TAEYANG.mp3", cover: "/music/covers/ONLY LOOK AT ME.jpg" },
  // Taylor Swift
  { name: "Cruel Summer", artist: "Taylor Swift", file: "/music/Cruel Summer - Taylor Swift.mp3", cover: "/music/covers/Cruel Summer.jpg" },
  // The Weeknd
  { name: "Die For You", artist: "The Weeknd", file: "/music/Die For You - The Weeknd.mp3", cover: "/music/covers/Die For You.jpg" },
  // Top Barry
  { name: "一半一半", artist: "Top Barry、INDEcompany", file: "/music/一半一半 - Top Barry、INDEcompany.mp3", cover: "/music/covers/一半一半.jpg" },
  // Tyler, The Creator
  { name: "See You Again (Explicit)", artist: "Tyler, The Creator", file: "/music/See You Again (Explicit) - Tyler, The Creator.mp3", cover: "/music/covers/See You Again.jpg" },
  // Usher
  { name: "Hey Daddy", artist: "Usher", file: "/music/Hey Daddy - Usher.mp3", cover: "/music/covers/Hey Daddy.jpg" },
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

  // 音频事件监听（只绑定一次）
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

  // 歌曲结束事件（依赖 currentTrack）
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

      // 等待音频加载完成后播放
      const onCanPlay = () => {
        audio.play().catch(() => {});
        audio.removeEventListener("canplay", onCanPlay);
      };
      audio.addEventListener("canplay", onCanPlay);
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [currentTrack]);

  // 首次进入自动播放（滑动页面后触发）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;
    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (!hasStarted) {
        hasStarted = true;
        audio.play().catch(() => {});
      } else {
        audio.play().catch(() => {});
      }
    };

    // 用户滑动页面后开始播放（解决浏览器自动播放限制）
    const handleScroll = () => {
      if (!hasStarted) {
        hasStarted = true;
        audio.play().catch(() => {});
        document.removeEventListener("scroll", handleScroll);
      }
    };

    if (!document.hidden && !hasStarted) {
      document.addEventListener("scroll", handleScroll, { passive: true });
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("scroll", handleScroll);
    };
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
    audio.play().catch(() => {
      const onCanPlay = () => { audio.play().catch(() => {}); audio.removeEventListener("canplay", onCanPlay); };
      audio.addEventListener("canplay", onCanPlay);
    });
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
