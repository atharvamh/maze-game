import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateMaze } from './utils/mazeutils';
import './App.css';
import confetti from 'canvas-confetti';
import myAudio from "./assets/audio/kiss-me.mp3";
import yourMission from "./assets/audio/your-mission.mp3";

const MAZE_SIZE = 15;

function App() {
  const [maze, setMaze] = useState(generateMaze(MAZE_SIZE));
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: MAZE_SIZE - 1 });
  const [showMaze, setShowMaze] = useState(false);
  const [play, setPlay] = useState(false);
  const [win, setWin] = useState(false);

  const audio = useMemo(() => new Audio(myAudio), []);
  const missionAudio = useMemo(() => new Audio(yourMission), []);

  const movePlayer = useCallback((dx, dy) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE && maze[newY][newX] === 0 && !win) {
      setPlayerPosition({ x: newX, y: newY });
      if(newX === MAZE_SIZE-1 && newY === 0) {
        setWin(true);
        triggerConfetti();
        audio.play();
      }
    }
  },[maze, playerPosition, audio, win]);

  useEffect(() => {
    function handleKeyDown(event) {
      switch (event.key) {
        case 'ArrowUp':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movePlayer]);

  useEffect(() => {
    let confettiInterval;
    if (win) {
      confettiInterval = setInterval(() => {
        triggerConfetti();
      }, 3000);
    }
    
    return () => {
      clearInterval(confettiInterval);
    };
  }, [win]);

  function triggerConfetti(){
    confetti({
      particleCount: 500,
      spread: 100,
      origin: { y: 1 }
    });
  }

  function resetGame(){
    audio.pause();
    audio.currentTime = 0;
    missionAudio.currentTime = 0;
    setWin(false);
    setPlayerPosition({ x: 0, y: MAZE_SIZE - 1 });
    setMaze(generateMaze(MAZE_SIZE));
  }

  function renderMaze() {
    return maze.map((row, rowIndex) => (
      <div key={crypto.randomUUID()} className="maze-row">
        {row.map((cell, cellIndex) => (
          <div
            key={crypto.randomUUID()}
            className={`maze-cell ${cell === 1 ? "wall" : "path"}
            ${playerPosition.x === cellIndex && playerPosition.y === rowIndex ? 'player' : ''}`}
          >
            {
              playerPosition.x === cellIndex && playerPosition.y === rowIndex ? "🐱" : 
              cellIndex == MAZE_SIZE-1 && rowIndex == 0 ? "❤️" : ""
            }
          </div>
        ))}
      </div>
    ));
  }

  function handlePlay(){
    missionAudio.play();
    setTimeout(() => {
      setPlay(true);
    },500);
  }

  function acceptMission(){
    setShowMaze(true);
    missionAudio.pause();
    missionAudio.currentTime = 0;
  }

  return (
    <div className="App">
      <div className="title">
        🐱 Maze
      </div>
      {
        showMaze ? 
        <>
          {
            win ?
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1em", color: "#000" }}>
              <h3>Kitty found love !</h3>
              <h2 style={{ marginTop: "-0.8em", marginBottom : "-0.1em" }}>
                Happy Valentine&apos;s Day Prachiii (Peachy7) ❤️
              </h2>
            </div> : <></>
          }
          <div className="maze-container">
            {renderMaze()}
          </div>
          {
            win ? 
            <button onClick={resetGame}>
              Play again
            </button> : 
            <div className="arrow-container">
              <div className="top-level">
                <button onClick={() => movePlayer(0, -1)}>↑</button>
              </div>
              <div className="bottom-level">
                <button onClick={() => movePlayer(-1, 0)}>←</button>
                <button onClick={() => movePlayer(0, 1)}>↓</button>
                <button onClick={() => movePlayer(1, 0)}>→</button>
              </div>
            </div>
          }
        </> : 
        play ? 
        <>
          <div style={{ fontSize: "1.5em", color: "#000", fontWeight: 500, display: "flex", 
            justifyContent: "center", alignItems: "center", padding: "0.5em" }}>
            Guide the kitty 🐱 through the twists and turns to uncover a delightful surprise waiting at the end.
          </div>
          <button onClick={acceptMission}>Accept Mission</button>
        </> :
        <button onClick={handlePlay}>
          Play
        </button>
      }
    </div>
  );
}

export default App;
