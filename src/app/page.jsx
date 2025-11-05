"use client";

import { useState, useEffect, useRef } from "react";
import MatrixBackground from "@/components/MatrixBackground";
import AudioPlayer from "@/components/AudioPlayer";
import ModalAccessAudio from "@/components/ModalAccessAudio";
import HelpText from "@/components/HelpText";
import CommandInput from "@/components/CommandInput";
import HelpModal from "@/components/HelpModal";
import CommandInfoContainer from "@/components/CommandInfoContainer";
import "./style.scss";

const AUDIO_PERMISSION_KEY = "audio-permission-requested";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentCommand, setCurrentCommand] = useState(null);
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
    
    // При нажатии Enter с командой /help - убеждаемся что модальное окно открыто
    if (normalizedCommand === "/help" || normalizedCommand === "help") {
      setShowHelp(true);
      return;
    }
    
    // Если была другая команда, закрываем модальное окно help
    if (showHelp) {
      setShowHelp(false);
    }
  };

  const handleInputChange = (inputValue) => {
    const trimmedInput = inputValue.trim().toLowerCase();
    
    // Если инпут пустой, закрываем контейнер и модальное окно
    if (!trimmedInput) {
      setCurrentCommand(null);
      setShowHelp(false);
      return;
    }
    
    // Проверяем точное совпадение с /help - открываем модальное окно сразу
    if (trimmedInput === "/help") {
      setShowHelp(true);
      setCurrentCommand(null);
      return;
    }
    
    // Если был введён /help, но текст изменился - закрываем модальное окно
    if (showHelp && trimmedInput !== "/help") {
      setShowHelp(false);
    }
    
    // Проверяем точное совпадение с командами (без дополнительных символов)
    if (trimmedInput === "/about") {
      setCurrentCommand("about");
    } else if (trimmedInput === "/project") {
      setCurrentCommand("project");
    } else if (trimmedInput === "/contacts") {
      setCurrentCommand("contacts");
    } else {
      // Если команда не является точным совпадением, закрываем контейнер
      setCurrentCommand(null);
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
      <CommandInput 
        onCommand={handleCommand} 
        onInputChange={handleInputChange}
        hasInfoContainer={!!currentCommand}
      />
      <CommandInfoContainer commandType={currentCommand} />
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
