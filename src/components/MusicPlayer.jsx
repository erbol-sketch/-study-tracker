import { useEffect, useRef, useState } from "react";

// ID видео из ссылки https://youtu.be/xgPgy5ZafSo
const VIDEO_ID = "xgPgy5ZafSo";

let apiPromise = null;
function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Фоновая музыка через официальный YouTube-плеер (спрятанный, 0x0),
 * с кнопкой вкл/выкл в углу экрана. Зацикливается сама - когда трек
 * заканчивается (у тебя это ~1ч48м), YouTube API стартует его заново.
 *
 * Подключить один раз в App.jsx, рядом с <SakuraPetals />:
 *   <MusicPlayer />
 */
function MusicPlayer() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pendingAutoplay, setPendingAutoplay] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: VIDEO_ID, // нужен YouTube'у, чтобы loop=1 реально зацикливал одно видео
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            setReady(true);
            // пробуем сыграть сразу — если браузер заблокирует автоплей,
            // просто останется на паузе, дальше сработает по первому клику
            try {
              e.target.mute(); // с mute автоплей почти всегда разрешён браузером
              e.target.playVideo();
            } catch {}
          },
          onStateChange: (e) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 1) setPlaying(true);
            if (e.data === 2) setPlaying(false);
            if (e.data === 0) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
    };
  }, []);

  // если автоплей с mute сработал, звук всё равно выключен браузером по умолчанию —
  // ждём первый клик пользователя где угодно на странице, чтобы включить звук
  useEffect(() => {
    if (!pendingAutoplay) return;

    function unlockOnFirstInteraction() {
      const p = playerRef.current;
      if (p && p.unMute) {
        try {
          p.unMute();
          p.playVideo();
        } catch {}
      }
      setPendingAutoplay(false);
      window.removeEventListener("pointerdown", unlockOnFirstInteraction);
      window.removeEventListener("keydown", unlockOnFirstInteraction);
    }

    window.addEventListener("pointerdown", unlockOnFirstInteraction);
    window.addEventListener("keydown", unlockOnFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", unlockOnFirstInteraction);
      window.removeEventListener("keydown", unlockOnFirstInteraction);
    };
  }, [pendingAutoplay]);

  function toggle() {
    const p = playerRef.current;
    if (!p) return;
    setPendingAutoplay(false);
    if (playing) {
      p.pauseVideo();
    } else {
      p.unMute();
      p.playVideo();
    }
  }

  return (
    <>
      {/* сам плеер, размер 0x0 — просто источник звука, без видео на экране */}
      <div ref={containerRef} style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }} />

      <button
        onClick={toggle}
        disabled={!ready}
        title={playing ? "Выключить музыку" : "Включить музыку"}
        className="fixed bottom-4 right-4 z-30 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm
                   border border-rose-100 shadow-md flex items-center justify-center text-lg
                   hover:bg-rose-50 transition disabled:opacity-50"
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}

export default MusicPlayer;