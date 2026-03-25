"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import style from "./AudioPlayer.module.css";
import { Icons } from "@/assets";
import { IconButton } from "../button/IconButton.js";
import { Slider } from "../slider/Slider.js";

const {
  crossIcon,
  speakerOffIcon,
  pauseIcon,
  playIcon,
  resetFieldIcon,
  speakerOnIcon,
} = Icons;

type AudioPlayerProps = {
  audioSrc: string;
  onRemove?: (() => void) | null;
  color?: string;
  onReupload?: (() => void) | null;
  width?: string;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  onRemove = null,
  color,
  onReupload = null,
  width = "500px",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const isMuted = volume === 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  const formatTime = (time: number | null) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = isMuted ? 0.5 : 0;
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  const handleVolumeChange = (value: number) => {
    const vol = value / 100;
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const time = (hoverX / rect.width) * duration;
    setHoverTime(time);
  };

  const trackWidth = useMemo(() => {
    return duration ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  const cssVars: React.CSSProperties = {
    "--color": color || "var(--colorCyan)",
    "--width": width,
  } as React.CSSProperties;

  return (
    <div className={style.audioPreview} style={cssVars}>
      <audio ref={audioRef} src={audioSrc} />

      <div className={style.customControls}>
        <div className={style.player}>
          <IconButton
            icon={isPlaying ? pauseIcon : playIcon}
            onClick={handlePlayPause}
            color={isPlaying ? color || "#52C9BD" : "#FF5969"}
            size="1.2"
            style={{ border: "none" }}
          />

          <div className={style.timeInfo}>
            {formatTime(currentTime)}
            {hoverTime !== null && (
              <div className={style.hoverTime}>{formatTime(hoverTime)}</div>
            )}
          </div>

          <div
            className={style.trackContainer}
            onClick={handleSeek}
            onMouseMove={handleHover}
            onMouseLeave={() => setHoverTime(null)}
          >
            <div className={style.track} style={{ width: `${trackWidth}%` }} />
            <div
              className={style.progressCircle}
              style={{ left: `${trackWidth}%` }}
            />
          </div>

          <div className={style.timeInfo}>{formatTime(duration)}</div>
        </div>

        <div className={style.controlers}>
          <div className={style.volumeControls}>
            <IconButton
              icon={isMuted ? speakerOffIcon : speakerOnIcon}
              onClick={handleMute}
              color={color || "#52C9BD"}
            />
            <Slider
              setResult={handleVolumeChange}
              value={volume * 100}
              showValueSide="left"
              color={color}
              showRange={false}
              width="auto"
            />
          </div>

          <div className={style.resetRemove}>
            {onReupload && (
              <IconButton
                icon={resetFieldIcon}
                onClick={onReupload}
                color={color || "#52C9BD"}
                label="Re-Upload"
              />
            )}
            {onRemove && (
              <IconButton icon={crossIcon} onClick={onRemove} color="#FF5969" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
