const canvas = document.querySelector("#container")
const ctx = canvas.getContext("2d")
const size = 10
const rows = canvas.height / size
const columns = canvas.width / size
const canvasOptions = {
  ctx,
  rows,
  columns
}
const canvasDom = {
  canvas,
  ctx
}

function initContent() {
  const nav = document.querySelector("#game_nav")
  nav.style.width = window.screen.width - 20 + 'px'
  nav.style.height = window.screen.width - 20 + 'px'
}
initContent()

const snake = new Snake(size, 0, 0, canvasDom)
const target = new Target(size, canvasOptions)

function init() {
  target.getRandomLocation()
  snake.draw()
  target.draw()
}
init()

function start() {
  const title = document.querySelector(".title")
  title.style.display = 'none'
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    target.draw()
    snake.update()
    snake.draw()

    if (snake.eatTarget(target)) {
      target.getRandomLocation()
    }
    if (snake.checkCollision()) {
      title.style.display = ''
      clearInterval(interval)
    }
  }, 100);
}

const left_btn = document.querySelector(".left_btn")
const right_btn = document.querySelector(".right_btn")
const up_btn = document.querySelector(".up_btn")
const down_btn = document.querySelector(".down_btn")

window.addEventListener("touchstart", e => {
  switch (e.target) {
    case left_btn.firstElementChild:
    case left_btn:
      snake.changeDirection('left')
      break;
    case right_btn.firstElementChild:
    case right_btn:
        snake.changeDirection('right')
        break;
    case up_btn.firstElementChild:
    case up_btn:
      snake.changeDirection('up')
      break;
    case down_btn.firstElementChild:
    case down_btn:
        snake.changeDirection('down')
        break;
    default:
      break;
  }
})