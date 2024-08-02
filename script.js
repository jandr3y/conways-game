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
const reset = () => ALIVE_CELLS = new Set([...ACORN_CELLS])

function findAliveParents(cell, aliveCells) {
  const parents = new Set()
  aliveCells.forEach(cellFind => {
    const cf = cellFind.split(',')
    const c = cell.split(',')

    if (
      cf[0] >= (Number(c[0]) - 1) &&
      cf[0] <= (Number(c[0]) + 1) &&
      cf[1] >= (c[1] - 1) &&
      cf[1] <= (Number(c[1]) + 1) &&
      cell !== cellFind
    ) {
      parents.add(cellFind)
    }
  })

  return parents
}

function findDeadParents(cell, aliveParents) {
  const deadCells = new Set();
  const c = cell.split(',')

  for (let i = (c[0] - 1); i <= (Number(c[0]) + 1); i++) {
    for (let j = (c[1] - 1); j <= (Number(c[1]) + 1); j++) {
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
    
    deadParents.forEach(deadCell => {
      const deadCellAliveParents = findAliveParents(deadCell, ALIVE_CELLS)
      if (deadCellAliveParents.size === 3) {
        cellsToCreate.push(deadCell)
      }
    })

    if (aliveParents.size < 2) {
      cellsToKill.push(cell)
      return
    }
  
    if (aliveParents.size > 3) {
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