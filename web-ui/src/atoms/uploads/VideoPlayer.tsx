"use client";

import style from "./VideoPlayer.module.css";
import { Icons } from "@/assets/icons";
import React from "react";
import { IconButton } from "../button/IconButton";
import { IconError } from "../error/IconError";

const { crossIcon, videoNotIcon, resetFieldIcon } = Icons;

interface VideoPlayerProps {
  videoFile: File | Blob | string | null;
  onRemove?: () => void;
  onReupload?: () => void;
  color?: string;
  width?: string;
  height?: string;
}

/**
 * VideoPlayer Component
 *
 * A reusable React component to preview a video file or URL with built-in controls.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoFile,
  onRemove,
  onReupload,
  color,
  width = "400px",
  height = "200px",
}) => {
  let videoSrc: string | null = null;

  if (videoFile) {
    if (videoFile instanceof Blob) {
      videoSrc = URL.createObjectURL(videoFile);
    } else if (typeof videoFile === "string") {
      videoSrc = videoFile;
    }
  }

  const cssVariable: React.CSSProperties = {
    "--color": color || "var(--colorCyan)",
    "--width": width,
    "--height": height,
  } as React.CSSProperties;

  return (
    <div className={style.videoContainer} style={cssVariable}>
      {videoSrc ? (
        <div className={style.videoPreview}>
          <video
            controls
            controlsList="nodownload"
            muted
            autoPlay
            src={videoSrc}
            className={style.videoPlayer}
          />
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
      ) : (
        <IconError
          icon={videoNotIcon}
          message="Ah!! Looks live video not found"
          size={2.5}
        />
      )}
    </div>
  );
};
