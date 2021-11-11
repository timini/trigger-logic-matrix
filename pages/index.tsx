import type { NextPage } from "next";
import { useMemo, useReducer, useState } from "react";
import { ClockDivider } from "../components/ClockDivider";
import { EuclidianRhythm } from "../components/EuclidianRhythm";
import { Matrix } from "../components/Matrix";
import { Metronome } from "../components/Metronome";
import { usePrecussion } from "../hooks/Precussion";

const Input = ({
  value,
  setValue,
}: {
  value: boolean;
  setValue: (x: boolean) => void;
}) => {
  return (
    <select
      value={value.toString()}
      onChange={(event) => setValue(event.target.value === "true")}
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
};

const QuantInput = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (x: number) => void;
}) => {
  return (
    <select
      value={value.toString()}
      onChange={(event) => setValue(parseInt(event.target.value))}
    >
      <option value="32">32</option>
      <option value="16">16</option>
      <option value="12">12 (triplets)</option>
      <option value="8">8</option>
      <option value="6">6 (sextuplet)</option>
      <option value="4">4</option>
      <option value="2">2</option>
      <option value="1">1</option>
    </select>
  );
};

const QUANTS = [32, 16, 12, 8, 6, 4, 2, 1];
const randQuant = () => QUANTS[Math.floor(Math.random() * QUANTS.length)];

const app = {
  reducer: (state: any, action: any) => {
    switch (action.type) {
      case "IN":
        let ins = state.ins.slice();
        ins[action.meta.index] = action.payload;
        return {
          ...state,
          ins,
        };
      case "OUT":
        let outs = state.outs.slice();
        outs[action.meta.index] = action.payload;
        return {
          ...state,
          outs,
        };

      case "BASE":
        return {
          ...state,
          base: action.payload,
        };
      default:
        return state;
    }
  },
  initialState: {
    base: false,
    ins: new Array(4).fill(false),
    outs: new Array(4).fill(false),
  },
};

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(app.reducer, app.initialState);
  const [initialised, setInitialised] = useState(false);
  const [quant, setQuant] = useState(16);
  const precussion = useMemo(() => {
    if (initialised) return usePrecussion();
  }, [initialised]);
  const outs = useMemo(
    () => [
      (payload: boolean) => {
        dispatch({
          type: "OUT",
          payload,
          meta: {
            index: 0,
          },
        });
        payload && precussion && precussion.rim.play();
      },
      (payload: boolean) => {
        dispatch({
          type: "OUT",
          payload,
          meta: {
            index: 1,
          },
        });
        payload && precussion && precussion.maracas.play();
      },
      (payload: boolean) => {
        dispatch({
          type: "OUT",
          payload,
          meta: {
            index: 2,
          },
        });
        payload && precussion && precussion.kick.play();
      },
      (payload: boolean) => {
        dispatch({
          type: "OUT",
          payload,
          meta: {
            index: 3,
          },
        });
        payload && precussion && precussion.stick.play();
      },
    ],
    [dispatch, precussion]
  );

  return (
    <Metronome>
      {({ tick, start, stop, isRunning }) => {
        return (
          <>
            <button
              onClick={() => {
                // audio context can only be loaded after user interaction
                setInitialised(true);
                isRunning ? stop() : start();
              }}
            >
              {isRunning ? "STOP" : "START"}
            </button>
            <ClockDivider
              tick={tick}
              division={24}
              onChange={(val) =>
                dispatch({
                  type: "IN",
                  payload: val,
                  meta: {
                    index: 0,
                  },
                })
              }
            />
            <ClockDivider
              tick={tick}
              division={18}
              onChange={(val) =>
                dispatch({
                  type: "IN",
                  payload: val,
                  meta: {
                    index: 1,
                  },
                })
              }
            />
            <ClockDivider
              tick={tick}
              division={12}
              onChange={(val) =>
                dispatch({
                  type: "IN",
                  payload: val,
                  meta: {
                    index: 2,
                  },
                })
              }
            />
            <EuclidianRhythm
              tick={tick}
              length={16}
              hits={11}
              onChange={(val) =>
                dispatch({
                  type: "IN",
                  payload: val,
                  meta: {
                    index: 3,
                  },
                })
              }
            />
            <div>
              BASE VALUE:{" "}
              <Input
                value={state.base}
                setValue={(val) =>
                  dispatch({
                    type: "BASE",
                    payload: val,
                  })
                }
              />
            </div>
            <div>
              Quantise: N steps per bar
              <QuantInput value={quant} setValue={setQuant} />
            </div>
            <Matrix
              base={state.base}
              ins={state.ins}
              outs={outs}
              quant={quant}
              tick={tick}
            />
            <div>out0 (rim) : {state.outs[0].toString()}</div>
            <div>out1 (maracas) : {state.outs[1].toString()}</div>
            <div>out2 (kick) : {state.outs[2].toString()}</div>
            <div>out3 (stick) : {state.outs[3].toString()}</div>
          </>
        );
      }}
    </Metronome>
  );
};

export default Home;
