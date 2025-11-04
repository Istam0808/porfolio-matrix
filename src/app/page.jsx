"use client";

import { useState, useEffect, useRef } from "react";
import MatrixBackground from "@/components/MatrixBackground";
import AudioPlayer from "@/components/AudioPlayer";
import ModalAccessAudio from "@/components/ModalAccessAudio";
import HelpText from "@/components/HelpText";
import CommandInput from "@/components/CommandInput";
import HelpModal from "@/components/HelpModal";
import "./style.scss";

const AUDIO_PERMISSION_KEY = "audio-permission-requested";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    // Проверяем, было ли уже показано модальное окно
    const permissionStatus = localStorage.getItem(AUDIO_PERMISSION_KEY);
    
    if (permissionStatus === null) {
      // Первый заход - показываем модальное окно
      setShowModal(true);
    } else if (permissionStatus === "allowed") {
      // Разрешение было дано ранее
      setAudioAllowed(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(AUDIO_PERMISSION_KEY, "allowed");
    setAudioAllowed(true);
    setShowModal(false);
    
    // Запускаем аудио после небольшой задержки, чтобы компонент успел обновиться
    setTimeout(() => {
      if (audioPlayerRef.current?.current) {
        audioPlayerRef.current.current.play().catch((err) => {
          console.warn("Не удалось запустить аудио:", err);
        });
      }
    }, 100);
  };

  const handleDecline = () => {
    localStorage.setItem(AUDIO_PERMISSION_KEY, "denied");
    setAudioAllowed(false);
    setShowModal(false);
  };

  const handleCommand = (command) => {
    const normalizedCommand = command.toLowerCase().trim();
    
    if (normalizedCommand === "/help" || normalizedCommand === "help") {
      setShowHelp(true);
      // Закрываем через 5 секунд автоматически или при клике
      setTimeout(() => {
        setShowHelp(false);
      }, 5000);
    }
  };

  return (
    <main className="home">
      <MatrixBackground />
      <AudioPlayer 
        ref={audioPlayerRef}
        autoPlay={audioAllowed}
      />
      <HelpText />
      <CommandInput onCommand={handleCommand} />
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
      
      <ModalAccessAudio
        isOpen={showModal}
        onClose={handleDecline}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </main>
  );
}
