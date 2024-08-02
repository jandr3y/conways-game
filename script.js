const canvas = document.getElementById('root');
const context = canvas.getContext('2d');
const debugEl = document.getElementById('debug');

const debug = (gen, pop) => debugEl.innerText = `
  Population: ${pop}
  Generation: ${gen}
`

let paused = true;
let gen = 0;
// acorn
const ACORN_CELLS = new Set([ '55,55', '56,55', '56,53', '58,54', '59,55', '60,55', '61,55'])
let ALIVE_CELLS = new Set([...ACORN_CELLS]); 

const pause = () => paused = !paused
const reset = () => {
  ALIVE_CELLS = new Set([...ACORN_CELLS])
  gen = 0
}

function findAliveParents(cell, aliveCells) {
  const parents = new Set()
  const c = cell.split(',').map(Number)

  for (const cellFind of aliveCells) {
    const cf = cellFind.split(',').map(Number)
  
    if (
      cf[0] >= (c[0] - 1) &&
      cf[0] <= (c[0] + 1) &&
      cf[1] >= (c[1] - 1) &&
      cf[1] <= (c[1] + 1) &&
      cell !== cellFind
    ) {
      parents.add(cellFind)
    }
  }

  return parents
}

function findDeadParents(cell, aliveParents) {
  const deadCells = new Set();
  const c = cell.split(',').map(Number)

  for (let i = (c[0] - 1); i <= (c[0] + 1); i++) {
    for (let j = (c[1] - 1); j <= (c[1] + 1); j++) {
      if (!aliveParents.has(`${i},${j}`)) {
        deadCells.add(`${i},${j}`)
      }
    }
  }

  return deadCells
}

function calc() {
  const cellsToCreate = []
  const cellsToKill = []

  ALIVE_CELLS.forEach(cell => {
    const aliveParents = findAliveParents(cell, ALIVE_CELLS)
    const deadParents  = findDeadParents(cell, aliveParents)
    
    for (const deadCell of deadParents) {
      const deadCellAliveParents = findAliveParents(deadCell, ALIVE_CELLS)
      if (deadCellAliveParents.size === 3) {
        cellsToCreate.push(deadCell)
      }
    }

    if (aliveParents.size < 2 || aliveParents.size > 3) {
      cellsToKill.push(cell)
      return
    }
  })

  cellsToKill.forEach(v => ALIVE_CELLS.delete(v))
  cellsToCreate.forEach(v => ALIVE_CELLS.add(v))
}

function gameloop() {
  context.clearRect(0,0,500,500)
  if (!paused) {
    calc()
    gen++;
  }

  debug(gen, ALIVE_CELLS.size)
  ALIVE_CELLS.forEach(cell => {
    const c = cell.split(',')
    context.fillStyle = 'black';
    context.fillRect(c[0] * 4, c[1] * 4, 4, 4)
  })
  window.requestAnimationFrame(gameloop)
}

gameloop();