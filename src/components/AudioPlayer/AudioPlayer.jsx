"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import "./style.scss";

const AudioPlayer = forwardRef(({ 
  src = "/audio/Matrix Code (Digital Rain) - 4K [ZIjfK4MGrGI].mp3",
  autoPlay = false 
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    current: audioRef.current,
    play: () => audioRef.current?.play(),
    pause: () => audioRef.current?.pause(),
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Инициализация аудио
  useEffect(() => {
    if (!isMounted || !audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0.7;

    // Обработчики для синхронизации состояния
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [isMounted]);

  // Автозапуск при получении разрешения
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn("Не удалось запустить аудио:", err);
      });
    }
  }, [autoPlay]);

  // Функция переключения play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      // Останавливаем
      audio.pause();
    } else {
      // Запускаем
      try {
        await audio.play();
      } catch (err) {
        console.warn("Не удалось воспроизвести аудио:", err);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        className="audio-control"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Приостановить аудио" : "Воспроизвести аудио"}
        type="button"
      >
        <span className="audio-control__icon" aria-hidden="true">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </span>
      </button>
    </>
  );
});

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;

