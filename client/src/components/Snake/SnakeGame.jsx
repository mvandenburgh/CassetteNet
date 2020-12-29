import React, { useContext, useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval.js";
import {
  snakePos,
  goalPos,
  scale,
  SPEED,
  directions
} from "./constants";
import { Typography } from "@material-ui/core";
import UserContext from '../../contexts/UserContext';
import { resetPlayerScore } from '../../utils/api';

function SnakeGame({ gameScreenStartX, gameScreenEndX, gameScreenStartY, gameScreenEndY, gameScreenHeight, gameScreenWidth, listeningRoom, scores, setScores }) {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(snakePos);
  const [apple, setApple] = useState(goalPos);
  const [score,setScore] = useState(0);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const gameSize = [gameScreenWidth, gameScreenHeight]

  const { user } = useContext(UserContext);

  useInterval(() => gameLoop(), speed);

  useEffect(() => gameOver ? setSpeed(null) : undefined, [gameOver]);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    resetPlayerScore(listeningRoom._id).then(() => {
      setScore(0);
      const newScores = [...scores];
      for (const s of newScores) {
        if (s.user === user._id) {
          s.score = 0;
          break;
        }
      }
      setScores(newScores);
    });


  };
  const addScore=()=>{
    setScore(score+1);
    const newScores = [...scores];
    for (const s of newScores) {
      if (s.user === user._id) {
        s.score++;
        break;
      }
    }
    setScores(newScores);
    // socket.emit('snakeScoreChange', 1);
  }
  const moveSnake = ({ keyCode }) => {
    
    var inputDir = directions[keyCode];
    if(inputDir==null || dir == null){
      console.log("invalid input ");
    }
    else if((dir[0] !== (inputDir[0] * -1) || dir[1] !== (inputDir[1] * -1)) && keyCode >= 37 && keyCode <= 40) {
      setDir(directions[keyCode]);
    }
  };


  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * ((gameSize[i] / scale)*0.85)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * scale >= gameSize[0] ||
      piece[0] < 0 ||
      piece[1] * scale >= gameSize[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      addScore();
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    console.log("width " + gameScreenWidth);
    console.log("height " + gameScreenHeight);
    setScore(0);
    setSnake(snakePos);
    setApple(goalPos);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "pink";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "green";
    context.fillRect(snake[0], snake[1], 1, 1);
    context.fillStyle = "blue";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      <Typography variant="h5" style={{left: `calc(${gameScreenEndX}px - 1em)`, position: 'absolute', zIndex: 1}}>{score}</Typography>
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${gameSize[0]}px`}
        height={`${gameSize[1]}px`}
      />
      {/* TODO: display game over as a dialog box or something */}
      {gameOver && <div>GAME OVER!</div>}
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default SnakeGame;
