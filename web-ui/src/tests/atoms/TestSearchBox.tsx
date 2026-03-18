import React, { useState } from "react";
import { SearchBox } from "@/atoms";

export const TestSearchBox: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    null,
  );

  const suggestions: any = [
    { name: "Apple", code: "APL" },
    { name: "Banana", code: "BAN" },
    { name: "Banana2", code: "BAN2" },
    { name: "Banana3", code: "BAN" },
    { name: "Banana4", code: "BAN" },
    { name: "Banana5", code: "BAN" },
    { name: "Banana6", code: "BAN" },
    { name: "Banana7", code: "BAN" },
    { name: "Banana8", code: "BAN" },
    { name: "Banana9", code: "BAN" },
    { name: "Banana", code: "BAN" },
    { name: "Banana", code: "BAN" },
    { name: "Banana", code: "BAN" },
    { name: "Banana", code: "BAN" },
    { name: "Banana", code: "BAN" },
    { name: "Banana2", code: "BAN" },
    { name: "Orange", code: "ORG" },
    { name: "Mango", code: "MNG" },
    { name: "Pineapple", code: "PNP" },
    { name: "Grapes", code: "GRP" },
    { name: "Strawberry", code: "STR" },
    { name: "Blueberry", code: "BLU" },
    { name: "Watermelon", code: "WTM" },
    { name: "Papaya", code: "PAP" },
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>SearchBox Component Test</h2>

      {/* Basic SearchBox */}
      <div style={{ marginBottom: "30px" }}>
        <SearchBox
          suggestions={suggestions}
          setResult={setSelectedValue}
          placeholder="Search fruits..."
          color="#1E90FF"
          width="350px"
        />
        <p>Selected Code: {selectedValue || "None"}</p>
      </div>

      {/* Another Example */}
      <div style={{ marginBottom: "30px" }}>
        <SearchBox
          suggestions={suggestions}
          setResult={(val) => console.log("Selected:", val)}
          placeholder="Try typing 'man' or 'app'"
          color="#28a745"
          width="400px"
        />
      </div>

      {/* Small Width */}
      <div style={{ marginBottom: "30px" }}>
        <SearchBox
          suggestions={suggestions}
          setResult={(val) => console.log("Small box:", val)}
          placeholder="Small search"
          color="#e17055"
          width="250px"
        />
      </div>

      {/* No Result Case */}
      <div style={{ marginBottom: "30px" }}>
        <SearchBox
          suggestions={suggestions}
          setResult={(val) => console.log("No result test:", val)}
          placeholder="Type something random..."
          color="#6c5ce7"
          width="350px"
        />
      </div>
    </div>
  );
};
