import React, { useEffect, useRef, useState } from "react";
import { PPQN } from "./Metronome";

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const ClockDivider = ({
  division,
  tick,
  onChange,
  quant = 16,
}: {
  division: number;
  tick: number;
  onChange: (x: boolean) => void;
  quant?: number;
}) => {
  const [steps, setSteps] = useState<boolean[]>(
    new Array(PPQN * 4).fill(false)
  );
  const prevTick = usePrevious(tick);
  useEffect(() => {
    if (tick !== prevTick) {
      const isHit = tick % division === 0;
      const ppqnQuant = (PPQN * 4) / quant;
      const shouldPlay = tick % ppqnQuant === 0;
      shouldPlay && onChange(isHit);
      setSteps((s) => {
        const [oldestStep, ...rest] = s;
        return [...rest, isHit];
      });
    }
  }, [tick, division, prevTick, onChange]);
  return (
    <div>
      {steps.map((s) => (s ? "8" : "_"))} clock divider. division:
      {PPQN / division}
    </div>
  );
};
