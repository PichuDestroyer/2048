"use client";
import Image from "next/image";
import Board from "./Component/Board";
import React, { useEffect, useState } from "react";

export default function Home() {
  const TIMER_LIMIT = 1
  const createInitialBoard = () => {
    let board = [];
    for (let i = 0; i < 4; i++) {
      board.push(Array(4).fill(null));
    }
    board = addNewTile(board);
    board = addNewTile(board);
    return board;
  };

  const addNewTile = (board) => {
    const emptyCells = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length > 0) {
      const index = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[index];
      board[row][col] = Math.random() > 0.2 ? 2 : 4;
    }
    return board;
  };

  const [board, setBoard] = useState(createInitialBoard());
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [topScores, setTopScores] = useState( () => {
    if (typeof window !== "undefined"){
      return JSON.parse(localStorage.getItem("score")) || [];
    }
    return [];
  });

  
  const [nameInput, setNameInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [timeAttack, setTimeAttack] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_LIMIT);


  const moveUp = () => {
    const newBoard = [...board];
    const newBoardString = JSON.stringify(newBoard);
    for (let col = 0; col < 4; col++) {
      let newCol = newBoard.map((row) => row[col]).filter((val) => val != null);
      for (let row = 0; row < newCol.length - 1; row++) {
        if (newCol[row] === newCol[row + 1]) {
          newCol[row] *= 2;
          setScore((prevScore) => prevScore + newCol[row]);
          newCol.splice(row + 1, 1);
        }
      }
      const colLength = newCol.length;
      for (let i = 0; i < 4 - colLength; i++) {
        newCol.push(null);
      }
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = newCol[row];
      }
    }
    if (newBoardString === JSON.stringify(newBoard)) {
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  };

  const moveDown = () => {
    const newBoard = [...board];
    const newBoardString = JSON.stringify(newBoard);
    for (let col = 0; col < 4; col++) {
      let newCol = newBoard.map((row) => row[col]).filter((val) => val != null);
      for (let row = newCol.length - 1; row > 0; row--) {
        if (newCol[row] === newCol[row - 1]) {
          newCol[row] *= 2;
          setScore((prevScore) => prevScore + newCol[row]);
          newCol.splice(row - 1, 1);
          row--;
        }
      }
      const colLength = newCol.length;
      for (let i = 0; i < 4 - colLength; i++) {
        newCol.unshift(null);
      }
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = newCol[row];
      }
    }
    if (newBoardString === JSON.stringify(newBoard)) {
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  };

  const moveLeft = () => {
    const newBoard = [...board];
    const newBoardString = JSON.stringify(newBoard);
    for (let row = 0; row < 4; row++) {
      let newRow = newBoard[row].filter((val) => val != null);
      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          setScore((prevScore) => prevScore + newRow[col]);
          newRow.splice(col + 1, 1);
          col++;
        }
      }
      const rowLength = newRow.length;
      for (let i = 0; i < 4 - rowLength; i++) {
        newRow.push(null);
      }
      for (let col = 0; col < 4; col++) {
        newBoard[row][col] = newRow[col];
      }
    }
    if (newBoardString === JSON.stringify(newBoard)) {
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  };

  const moveRight = () => {
    const newBoard = [...board];
    const newBoardString = JSON.stringify(newBoard);
    for (let row = 0; row < 4; row++) {
      let newRow = newBoard[row].filter((val) => val != null);
      for (let col = newRow.length - 1; col > 0; col--) {
        if (newRow[col] === newRow[col - 1]) {
          newRow[col] *= 2;
          setScore((prevScore) => prevScore + newRow[col]);
          newRow.splice(col - 1, 1);
          col--;
        }
      }
      const rowLength = newRow.length;
      for (let i = 0; i < 4 - rowLength; i++) {
        newRow.unshift(null);
      }
      for (let col = 0; col < 4; col++) {
        newBoard[row][col] = newRow[col];
      }
    }
    if (newBoardString === JSON.stringify(newBoard)) {
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
        localStorage.setItem('score', JSON.stringify(topScores));
    }
}, [topScores]);

  const handleKeyDown = (event) => {
    if (gameover) return; 
    if (event.key === "ArrowUp") {
      moveUp();
    } else if (event.key === "ArrowDown") {
      moveDown();
    } else if (event.key === "ArrowLeft") {
      moveLeft();
    } else if (event.key === "ArrowRight") {
      moveRight();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (checkGameover()) {
      setGameover(true);
      if (score > (topScores[topScores.length - 1]?.score || 0) || topScores.length < 10) {
        setShowInput(true);
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [board]);

  useEffect(() => {
    let timer;
    if (timeAttack && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setGameover(true);
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeAttack, timeLeft]);

  const checkGameover = () => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === null) {
          return false;
        }
        if ((row < 3 && board[row][col] === board[row + 1][col]) || (col < 3 && board[row][col] === board[row][col + 1])) {
          return false;
        }
      }
    }
    return true;
  };

  const retry = () => {
    setBoard(createInitialBoard());
    setScore(0);
    setGameover(false);
    setShowInput(false);
    setTimeLeft(TIMER_LIMIT);
  };

  const handleNameChange = (event) => {
    setNameInput(event.target.value);
  };

  const switchTimeAttack = () => {
    if (!timeAttack) {
      setTimeAttack(true);
      retry();
    }
  };

  const switchNormal = () => {
    if (timeAttack) {
      setTimeAttack(false);
      retry();
    }
  };

  const submitScore = () => {
    if (nameInput.trim() !== "") {
      const newTopScore = [...topScores];
      newTopScore.push({ name: nameInput, score: score });
      newTopScore.sort((a, b) => b.score - a.score);
      newTopScore.splice(10);
      setTopScores(newTopScore);
      setShowInput(false);
      setNameInput("");
    }
  };

  return (
    <main className="game-container">
      <header className="header">
        <h1 className="title">2048</h1>
        <div className="score-container">
          <div className="score-label">Score</div>
          <div className="score-value">{score}</div>
        </div>
        {timeAttack && (
          <div className="timer-container">
          <div className="score-label">Time</div>
          <div className="timer-value">{timeLeft}</div>
        </div>
        )}
      </header>

      <div className="game-board-container">
        <Board board={board} />
        <div className="scoreboard-container">
          <h2 className="scoreboard-title">Leaderboard</h2>
          <ul className="scoreboard">
            {topScores.map((score, index) => (
              <li key={index}>
                <div className="scoreboard-item">
                  <span className="scoreboard-name">{score.name}</span>
                  <span className="scoreboard-score">{score.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {gameover && (
        <button className="retry-button" onClick={retry}>Retry</button>
      )}
      {!timeAttack && (
        <button className="time-attack-button" onClick={switchTimeAttack}>
          Time Attack Mode
        </button>
      )}
      {timeAttack && (
        <button className="normal-mode-button" onClick={switchNormal}>
          Normal Mode
        </button>
      )}

      {showInput && (
        <div className="name-input-container">
          <input
            className="nameInput"
            type="text"
            placeholder="Enter your name"
            value={nameInput}
            onChange={handleNameChange}
          />
          <button className="submit-button" onClick={submitScore}>Submit</button>
        </div>
      )}
    </main>
  );
}