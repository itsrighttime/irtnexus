import React, { useState } from "react";
import { Stepper } from "@/atoms";

export const TestStepper: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(10);
  const [guests, setGuests] = useState<number>(2);
  const [rating, setRating] = useState<number>(3);
  const [temperature, setTemperature] = useState<number>(22);

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>Stepper Component Test</h2>

      <div style={{ marginBottom: "30px" }}>
        <Stepper
          label="Quantity"
          required
          value={quantity}
          setResult={setQuantity}
          min={0}
          max={50}
          step={5}
          color="#1E90FF"
          width="250px"
        />
        <p>Current Quantity: {quantity}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <Stepper
          label="Guests"
          value={guests}
          setResult={setGuests}
          min={1}
          max={10}
          step={1}
          color="#FFD700"
          width="200px"
        />
        <p>Number of Guests: {guests}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <Stepper
          label="Rating"
          required
          value={rating}
          setResult={setRating}
          min={0}
          max={5}
          step={0.5}
          color="#FF69B4"
          width="220px"
        />
        <p>Current Rating: {rating}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <Stepper
          label="Temperature"
          value={temperature}
          setResult={setTemperature}
          min={16}
          max={30}
          step={0.5}
          color="#FF4500"
          width="250px"
        />
        <p>Temperature: {temperature}°C</p>
      </div>
    </div>
  );
};
