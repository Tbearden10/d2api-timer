"use client";
import React, { useEffect } from "react";

interface BackgroundControllerProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  effectsEnabled: boolean;
  setEffectsEnabled: (enabled: boolean) => void;
  effectType: "stars" | "snow";
  setEffectType: (type: "stars" | "snow") => void;
}

const BackgroundController: React.FC<BackgroundControllerProps> = ({
  backgroundColor,
  setBackgroundColor,
  effectsEnabled,
  setEffectsEnabled,
  effectType,
  setEffectType,
}) => {
  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedBackgroundColor = localStorage.getItem("backgroundColor");
    const savedEffectsEnabled = localStorage.getItem("effectsEnabled");
    const savedEffectType = localStorage.getItem("effectType");

    if (savedBackgroundColor !== null) setBackgroundColor(savedBackgroundColor);
    if (savedEffectsEnabled !== null) setEffectsEnabled(savedEffectsEnabled === "true");
    if (savedEffectType !== null) setEffectType(savedEffectType as "stars" | "snow");
  }, [setBackgroundColor, setEffectsEnabled, setEffectType]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("backgroundColor", backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem("effectsEnabled", effectsEnabled.toString());
  }, [effectsEnabled]);

  useEffect(() => {
    localStorage.setItem("effectType", effectType);
  }, [effectType]);

  return (
    <div>
      {/* Background Color Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="background-color">Background Color: </label>
        <input
          type="color"
          id="background-color"
          value={backgroundColor}
          onInput={(e) => setBackgroundColor((e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Toggle Effects */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="toggle-effects">Enable Effects: </label>
        <input
          type="checkbox"
          id="toggle-effects"
          checked={effectsEnabled}
          onChange={(e) => setEffectsEnabled(e.target.checked)}
        />
      </div>

      {/* Effect Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="effect-type">Select Effect: </label>
        <select
          id="effect-type"
          value={effectType}
          onChange={(e) => setEffectType(e.target.value as "stars" | "snow")}
        >
          <option value="stars">Stars</option>
          <option value="snow">Snow</option>
        </select>
      </div>
    </div>
  );
};

export default BackgroundController;