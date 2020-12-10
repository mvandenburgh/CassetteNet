const gameSize = [400, 400];
const snakePos = [
  [8, 7],
  [8, 8]
];
const goalPos = [8, 3];
const scale = 40;
const SPEED = 100;
const directions = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export {
  gameSize,
  snakePos,
  goalPos,
  scale,
  SPEED,
  directions
};