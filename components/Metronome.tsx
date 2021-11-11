import React, { useCallback, useEffect, useRef, useState } from "react";

export const PPQN = 24;

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const Metronome = ({
  children,
}: {
  children: (p: {
    tick: number;
    start: () => void;
    stop: () => void;
    isRunning: boolean;
  }) => JSX.Element;
}) => {
  const [tick, setTick] = useState(0);
  const [bpm, setBpm] = useState(100);
  const [run, setRun] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timer>();
  // effect to start the timer or change the BPM
  useEffect(() => {
    if (run) {
      const tid = setInterval(
        () => setTick((t) => t + 1),
        (1000 * 60) / (bpm * PPQN)
      );
      setTimerId(tid);
    }
  }, [bpm, run]);
  // effect to stop the timer
  useEffect(() => {
    if (!run && timerId) {
      clearInterval(timerId);
    }
    return function cleanup() {
      timerId && clearInterval(timerId);
    };
  }, [timerId, run]);
  const start = useCallback(() => setRun(true), [setRun]);
  const stop = useCallback(() => setRun(false), [setRun]);
  return (
    <>
      BPM:
      <input
        type="number"
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value))}
      />
      {children({ tick, start, stop, isRunning: run })}
    </>
  );
};
