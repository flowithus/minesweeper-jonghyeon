import React, { useState, useEffect } from "react";

import Button from "../Button";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import { Face, Cell, CellState } from "../../types";
import imgFossil from "../../assets/fossil.png";
import { NUMBER_OF_PINS, NUMBER_OF_BOMBS } from "../../constants";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.curious);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NUMBER_OF_PINS);

  useEffect(() => {
    const handleMousedown = (): void => {
      setFace(Face.finding);
    };
    const handleMouseup = (): void => {
      setFace(Face.curious);
    };
    window.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mouseup", handleMouseup);

    return () => {
      window.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("mouseup", handleMouseup);
    };
  }, []);

  useEffect(() => {
    if (live) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (!live) {
      setLive(true);
    }
  };

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (bombCounter <= 0) {
      return;
    }

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const handleFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${colIndex}-${rowIndex}`}
          onClick={handleCellClick}
          onContext={handleCellContext}
          row={rowIndex}
          col={colIndex}
          value={cell.value}
          state={cell.state}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 900 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 50,
              fontWeight: 900,
              color: "gray",
            }}
          >
            <img
              src={imgFossil}
              alt="fossil"
              style={{ width: 300, borderRadius: 16 }}
            />
            × {NUMBER_OF_BOMBS}
          </div>
        </div>
        <div
          style={{
            width: 380,
            lineHeight: 1.7,
            letterSpacing: -0.3,
            color: "#222222",
          }}
        >
          <strong style={{ fontSize: 20, fontWeight: 900 }}>
            게임하는 방법
          </strong>{" "}
          <br />이 곳에는{" "}
          <strong>티라노사우르스 화석 {NUMBER_OF_BOMBS}개</strong>가 묻혀
          있어요.{" "}
          <strong>
            화석이 묻혀 있는 땅 주변을 모두 곡괭이로 파내면 온전한 화석
          </strong>
          을 얻을 수 있어요. 하지만 조심하세요!{" "}
          <strong>실수로 화석이 있는 땅을 파내면 화석이 깨질 수 있어요.</strong>{" "}
          그렇지만 너무 걱정마세요. 여러분이 잘 발굴할 수 있게{" "}
          <strong>땅 속에 땅 주변 화석 수를 잘 표시</strong>해두었어요.
          <br />
          <br />
          <small>⛏️ (좌 클릭): 화석 주변의 땅을 곡괭이로 파세요</small>
          <br />
          <small>
            📍 (우 클릭): 화석이 있을 것 같은 땅을 핀으로 표시해 기억하세요
          </small>
        </div>
        <div className="Header">
          <div className="Face" onClick={handleFaceClick}>
            <span role="img" aria-label="face">
              {face}
            </span>
          </div>
          <NumberDisplay value={bombCounter} type={"📍"} />
          <NumberDisplay value={time} type={"⏱️"} />
        </div>
      </div>
      <div>
        <div className="Body"> {renderCells()} </div>
      </div>
    </div>
  );
};

export default App;
