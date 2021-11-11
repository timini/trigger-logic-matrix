import React, { useEffect, useRef, useState } from "react";
import { PPQN } from "./Metronome";

const bresenhamEuclidean = (onsets: number, totalPulses: number) => {
  var previous = null;
  var pattern = [];

  for (var i = 0; i < totalPulses; i++) {
    var xVal = Math.floor((onsets / totalPulses) * i);
    pattern.push(xVal === previous ? 0 : 1);
    previous = xVal;
  }
  return pattern;
};

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const EuclidianRhythm = ({
  tick,
  onChange,
  hits,
  length = 16,
  quant = 16,
}: {
  tick: number;
  onChange: (x: boolean) => void;
  hits: number;
  length?: number;
  quant?: number;
}) => {
  const [steps, setSteps] = useState<boolean[]>(
    new Array(PPQN * 4).fill(false)
  );
  const prevTick = usePrevious(tick);
  const rhythm = bresenhamEuclidean(hits, length);
  useEffect(() => {
    if (tick !== prevTick) {
      const ppqnQuant = (PPQN * 4) / quant;
      const ppqnTick = tick / ((PPQN * 4) / 16);
      const currentPosition = ppqnTick % length;
      const newStep = !!rhythm[currentPosition];
      const shouldPlay = tick % ppqnQuant === 0;
      shouldPlay && onChange(newStep);
      setSteps((s) => {
        const [oldestStep, ...rest] = s;
        return [...rest, newStep];
      });
    }
  }, [tick, prevTick, onChange]);
  return (
    <div>
      {steps.map((s) => (s ? "8" : "_"))} Euclidian Rhythm. length:{length},
      hits:{hits}
    </div>
  );
};

export default EuclidianRhythm;
