import React, { useState, useEffect } from "react";

const Stopwatch: React.FC = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (running) {
      const intervalId = setInterval(() => {
        setDuration((prevDuration) => prevDuration + (Date.now() - startTime!));
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [running, startTime]);

  const handleStart = () => {
    if (running) return;
    setRunning(true);
    setStartTime(Date.now());
  };

  const handleStop = () => {
    if (!running) return;
    setRunning(false);
    setDuration((prevDuration) => prevDuration + (Date.now() - startTime!));
  };

  const handleReset = () => {
    setRunning(false);
    setDuration(0);
    setStartTime(null);
  };

  return (
    <div>
      <p>{(duration / 1000).toFixed(2)}s</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Stopwatch;
