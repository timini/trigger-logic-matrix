import React, { FunctionComponent, useState } from "react";
import { PPQN } from "./Metronome";

export const Treadmill: FunctionComponent = ({ children }) => {
  const [steps, setSteps] = useState<boolean[]>(
    new Array(PPQN * 4).fill(false)
  );
  return (
    <>
      <div>{steps.map((s) => (s ? "8" : "_"))}</div>
      {typeof children === "function" &&
        children({
          setSteps,
        })}
    </>
  );
};
