import React, { useState } from "react";
import { Slider } from "@/atoms";

export const TestSlider: React.FC = () => {
  const [volume, setVolume] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(75);
  const [speed, setSpeed] = useState<number>(1.5);
  const [temperature, setTemperature] = useState<number>(22);

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>Slider Component Test</h2>

      <div style={{ marginBottom: "30px" }}>
        <Slider
          label="Volume"
          required
          value={volume}
          setResult={setVolume}
          min={0}
          max={100}
          step={5}
          showRange
          showValueSide="right"
          color="#1E90FF"
          width="400px"
        />
        <p>Current Volume: {volume}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <Slider
          label="Brightness"
          value={brightness}
          setResult={setBrightness}
          min={0}
          max={100}
          step={1}
          showRange
          showValueSide="left"
          color="#FFD700"
          width="350px"
        />
        <p>Current Brightness: {brightness}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <Slider
          label="Playback Speed"
          value={speed}
          setResult={setSpeed}
          min={0.5}
          max={3}
          step={0.1}
          showRange={false}
          showValueSide="top"
          color="#FF69B4"
          width="300px"
        />
        <p>Current Speed: {speed}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <Slider
          label="Temperature"
          value={temperature}
          setResult={setTemperature}
          min={16}
          max={30}
          step={0.5}
          showRange
          showValueSide="bottom"
          color="#FF4500"
          width="300px"
          required
        />
        <p>Current Temperature: {temperature}°C</p>
      </div>
    </div>
  );
};
