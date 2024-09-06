import React, { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(215); // Example initial time in seconds

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="timer">Your worker is coming in {formatTime(time)}</div>
  );
};

export default Timer;
