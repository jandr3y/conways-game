const canvas = document.getElementById('root');
const context = canvas.getContext('2d');
let ALIVE_CELLS = [
  [1,0],
  [3,1],
  [0,2],
  [1,2],
  [4,2],
  [5,2],
  [6,2],
]; // acorn

ALIVE_CELLS = [
  [1,1],
  [2,0],
  [2,2]
]

function findAliveParents(cell, aliveCells, skip = false) {
  return aliveCells.filter(cellFind => {
    if (skip && cellFind[0] === skip[0] && cellFind[1] === skip[1]) {
      return false;
    }

    return cellFind[0] >= (cell[0] - 1) &&
    cellFind[0] <= (cell[0] + 1) &&
    cellFind[1] >= (cell[1] - 1) &&
    cellFind[1] <= (cell[1] + 1)
  })
}

function findDeadParents(cell, aliveParents) {
  const deadCells = [];
  for (let i = (cell[0] - 1); i <= (cell[0] + 1); i++) {
    for (let j = (cell[1] - 1); j <= (cell[1] + 1); j++) {
      if (aliveParents.filter(parent => parent[0] === i && parent[1] === j).length === 0) {
        deadCells.push([i, j])
      }
    }
  }

  return deadCells
}

function calc() {
  const cellsToCreate = []
  const cellsToKill = []

  for (let i = 0; i < ALIVE_CELLS.length; i++) {
    const cell = ALIVE_CELLS[i];

    if (cell[0] == 2 && cell[1] == 2) {
      //debugger
    }

    const aliveParents = findAliveParents(cell, ALIVE_CELLS, cell)
    const deadParents  = findDeadParents(cell, aliveParents)
    
    if (aliveParents.length < 2) {
      cellsToKill.push(ALIVE_CELLS[i])
      continue;
    }
  
    if (aliveParents.length > 3) {
      cellsToKill.push(ALIVE_CELLS[i])
      continue;
    }

    for (let j = 0; j < deadParents.length; j++) {
      const deadCell = deadParents[j]

      const deadCellAliveParents = findAliveParents(deadCell, ALIVE_CELLS)
      if (deadCellAliveParents.length === 3) {
        cellsToCreate.push([...deadCell])
      }
    }
  }

  ALIVE_CELLS = ALIVE_CELLS.filter(c => {
    for (let cf of cellsToKill) {
      return cf[0] === c[0] && cf[1] === c[1]
    }

    return true
  })
  
  for (let cc in cellsToCreate) {
    if (!ALIVE_CELLS.filter(cf => cf[0] === cellsToCreate[cc][0] && cf[1] === cellsToCreate[cc][1]).length) {
      ALIVE_CELLS.push(cellsToCreate[cc])
    }
  }
}

function gameloop() {
  context.clearRect(0,0,500,500)
  ALIVE_CELLS.map(cell => {
    context.fillStyle = 'black';
    context.fillRect(cell[0] * 4, cell[1] * 4, 4, 4)
  })
  window.requestAnimationFrame(gameloop)
}

//setInterval(() => calc(), 1000)
gameloop();