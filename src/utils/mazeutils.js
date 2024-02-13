export function generateMaze(size) {
  const maze = Array.from({ length: size }, () => Array.from({ length: size }, () => 1));
  const stack = [];
  const visited = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

  let currentCell = { x: 0, y: 0 };
  visited[0][0] = true;
  maze[0][0] = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const neighbors = [];
    const { x, y } = currentCell;

    if (x > 1 && !visited[y][x - 2]) neighbors.push({ x: x - 2, y });
    if (x < size - 2 && !visited[y][x + 2]) neighbors.push({ x: x + 2, y });
    if (y > 1 && !visited[y - 2][x]) neighbors.push({ x, y: y - 2 });
    if (y < size - 2 && !visited[y + 2][x]) neighbors.push({ x, y: y + 2 });

    if (neighbors.length > 0) {
      const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push(currentCell);
      maze[nextCell.y][nextCell.x] = 0;
      visited[nextCell.y][nextCell.x] = true;
      maze[(currentCell.y + nextCell.y) / 2][(currentCell.x + nextCell.x) / 2] = 0;
      currentCell = nextCell;
    } else if (stack.length > 0) {
      currentCell = stack.pop();
    } else {
      break;
    }
  }
  
  // start and end points are open
  maze[0][size-1] = 0;
  maze[size - 1][0] = 0;
  return maze;
}