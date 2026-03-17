"use client";

import { Loading, LoadingChat, SecondaryLoading } from "@/atoms";
import React from "react";

const sectionStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  marginBottom: "10px",
  fontWeight: 600,
};

export const TestLoading: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Loading Component Showcase</h1>

      {/* Default */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Default (CubesLoader)</div>
        <Loading />
      </div>

      {/* All Loader Types */}
      <div style={sectionStyle}>
        <div style={titleStyle}>All Loader Types</div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Loading type="CubesLoader" />
          <Loading type="FoldingLoader" />
          <Loading type="BounceLoader" />
          <Loading type="PulseLoader" />
          <Loading type="LoadingChat" />
        </div>
      </div>

      {/* With Colors */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Custom Colors</div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Loading type="CubesLoader" color="red" />
          <Loading type="FoldingLoader" color="blue" />
          <Loading type="BounceLoader" color="green" />
          <Loading type="PulseLoader" color="orange" />
          <Loading type="LoadingChat" color="purple" />
        </div>
      </div>

      {/* With Text */}
      <div style={sectionStyle}>
        <div style={titleStyle}>With Loading Text</div>
        <Loading showText text="Loading data" />
      </div>

      {/* Custom Text */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Custom Text Variants</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <Loading showText text="Fetching API" />
          <Loading showText text="Processing" />
          <Loading showText text="Please wait" />
        </div>
      </div>

      {/* Display Positions */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Display Positions</div>

        <div
          style={{
            height: "200px",
            position: "relative",
            border: "1px dashed #aaa",
          }}
        >
          <Loading display="top" position="absolute" />
        </div>

        <div
          style={{
            height: "200px",
            position: "relative",
            border: "1px dashed #aaa",
            marginTop: "10px",
          }}
        >
          <Loading display="center" />
        </div>
      </div>

      {/* Absolute Position */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Absolute Position</div>
        <div
          style={{
            height: "200px",
            position: "relative",
            border: "1px dashed #aaa",
          }}
        >
          <Loading position="absolute" display="center" />
        </div>
      </div>

      {/* Custom Window Size */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Custom Size</div>
        <Loading windowHeight="200px" windowWidth="200px" />
      </div>

      {/* Combined Example */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Full Custom Example</div>
        <Loading
          type="BounceLoader"
          display="center"
          position="absolute"
          windowHeight="200px"
          windowWidth="100%"
          color="#00f"
          showText
          text="Loading data"
        />
      </div>

      {/* ================= LoadingChat Direct ================= */}
      <div style={sectionStyle}>
        <div style={titleStyle}>LoadingChat (Direct Usage)</div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <LoadingChat />
          <LoadingChat color="red" />
          <LoadingChat color="blue" height="60px" width="200px" />
        </div>
      </div>

      {/* ================= SecondaryLoading ================= */}
      <div style={sectionStyle}>
        <div style={titleStyle}>SecondaryLoading (Full Screen Preview)</div>

        <p style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
          This simulates a full-screen loader inside a constrained container.
        </p>

        <div
          style={{
            height: "200px",
            width: "100%",
            position: "relative",
            border: "1px dashed #aaa",
            overflow: "hidden",
          }}
        >
          {/* simulate fullscreen inside box */}
          <SecondaryLoading />
        </div>
      </div>

      {/* ================= Text + Animation ================= */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Loading with Text</div>
        <Loading showText text="Loading data" />
      </div>

      {/* ================= Custom Config ================= */}
      <div style={sectionStyle}>
        <div style={titleStyle}>Full Custom Example</div>
        <Loading
          type="BounceLoader"
          display="center"
          position="absolute"
          windowHeight="200px"
          windowWidth="100%"
          color="#00f"
          showText
          text="Processing"
        />
      </div>
    </div>
  );
};
