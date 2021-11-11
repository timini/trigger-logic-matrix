import React, { useEffect, useReducer, useState } from "react";

const OPERATORS = ["", "AND", "OR", "XOR", "NOR", "NAND"]; // "NOR", "NAND",

const randomOp = () => OPERATORS[Math.floor(Math.random() * OPERATORS.length)];

const matrix = {
  reducer: (state, action) => {
    switch (action.type) {
      case "UPDATE":
        let newState = state.slice();
        let row = newState[action.meta.rowIndex].slice();
        row[action.meta.colIndex] = action.payload;
        newState[action.meta.rowIndex] = row;
        return newState;
      case "RANDOMISE":
        if (action.meta.colSelection) {
          const newState = state.slice();
          return newState.map((row) => {
            const newRow = [...row];
            newRow[action.meta.colSelection - 1] = randomOp();
            return newRow;
          });
        }
        return Array.from({ length: 4 }, () =>
          Array.from({ length: 4 }, randomOp)
        );
      case "PERTURB":
        if (action.meta.colSelection) {
          const newState = state.slice();
          const randRow = Math.floor(Math.random() * 4);
          return newState.map((row, i) => {
            const newRow = [...row];
            if (i === randRow) {
              newRow[action.meta.colSelection - 1] = randomOp();
            }
            return newRow;
          });
        }
        const randx = Math.floor(Math.random() * 4);
        const randy = Math.floor(Math.random() * 8);
        const newState2 = [...state.map((x) => [...x])];
        newState2[randy][randx] = randomOp();
        return newState2;

      case "CLEAR":
        if (action.meta.colSelection) {
          const newState = state.slice();
          return newState.map((row) => {
            const newRow = [...row];
            newRow[action.meta.colSelection - 1] = "";
            return newRow;
          });
        }
        return Array.from({ length: 4 }, () =>
          Array.from({ length: 4 }, () => "")
        );
      default:
        return state;
    }
  },
  initialState: new Array(4).fill(new Array(4).fill("")),
};

export const Matrix = ({ ins, outs, base }) => {
  const [state, dispatch] = useReducer(matrix.reducer, matrix.initialState);
  useEffect(() => {
    for (let i = 0; i <= 3; i++) {
      let acc = base;
      for (const [index, row] of state.entries()) {
        const operator = row[i];
        switch (operator) {
          case "OR":
            acc = acc || ins[index];
            break;
          case "AND":
            acc = acc && ins[index];
            break;
          case "NOR":
            acc = !(acc || ins[index]);
            break;
          case "NAND":
            acc = !(acc && ins[index]);
            break;
          case "XOR":
            acc = acc !== ins[index];
            break;
          default:
            break;
        }
      }
      outs[i](acc);
    }
  }, [ins, outs, state, base]);
  const [colSelection, setColSelection] = useState();
  return (
    <>
      <button
        onClick={() => dispatch({ type: "RANDOMISE", meta: { colSelection } })}
      >
        RANDOMISE {colSelection ? `col ${colSelection}` : "all"}!
      </button>
      <button
        onClick={() => dispatch({ type: "PERTURB", meta: { colSelection } })}
      >
        Perturb {colSelection ? `col ${colSelection}` : "all"}!
      </button>
      <button
        onClick={() => dispatch({ type: "CLEAR", meta: { colSelection } })}
      >
        Clear {colSelection ? `col ${colSelection}` : "all"}!
      </button>
      <table>
        <tbody>
          <tr>
            <th>--input--</th>
            <th>
              <button
                onClick={() =>
                  setColSelection((val) => (val === 1 ? undefined : 1))
                }
              >
                select 1
              </button>
            </th>
            <th>
              <button
                onClick={() =>
                  setColSelection((val) => (val === 2 ? undefined : 2))
                }
              >
                select 2
              </button>
            </th>
            <th>
              <button
                onClick={() =>
                  setColSelection((val) => (val === 3 ? undefined : 3))
                }
              >
                select 3
              </button>
            </th>
            <th>
              <button
                onClick={() =>
                  setColSelection((val) => (val === 4 ? undefined : 4))
                }
              >
                select 4
              </button>
            </th>
          </tr>
          {state.map((row, rowIndex) => {
            return (
              <tr key={`row-${rowIndex}`}>
                <th key={`col-input`}>{ins[rowIndex] ? "TRUE" : "FALSE"}</th>
                {row.map((cell, colIndex) => {
                  return (
                    <td key={`col-${colIndex}`}>
                      <select
                        value={cell}
                        onChange={(event) =>
                          dispatch({
                            type: "UPDATE",
                            meta: { rowIndex, colIndex },
                            payload: event.target.value,
                          })
                        }
                      >
                        {OPERATORS.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
