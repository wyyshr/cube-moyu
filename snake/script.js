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

let scoreNum = 0
function start() {
  const title = document.querySelector(".title")
  title.style.display = 'none'
  const score = document.querySelector(".score")
  scoreNum = 0
  score.innerHTML = scoreNum
  let animId = null, startTime = performance.now()
  
  animId = requestAnimationFrame(loop)
  function loop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const now = performance.now()
    const dt = (now - startTime) * 0.001

    target.draw()
    snake.update(dt)
    snake.draw()
    startTime = now
    if (snake.eatTarget(target)) {
      target.getRandomLocation()
      scoreNum++
      score.innerHTML = scoreNum
    }
    if (snake.checkCollision()) {
      title.style.display = ''
      cancelAnimationFrame(animId)
      return
    }
    animId = requestAnimationFrame(loop)
  }
  // const interval = setInterval(() => {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height)
  //   target.draw()
  //   snake.update()
  //   snake.draw()

  //   if (snake.eatTarget(target)) {
  //     target.getRandomLocation()
  //     scoreNum++
  //     score.innerHTML = scoreNum
  //   }
  //   if (snake.checkCollision()) {
  //     title.style.display = ''
  //     clearInterval(interval)
  //   //   scoreNum = 0
  //   //   score.innerHTML = scoreNum
  //   }
  // }, 100);
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
      btn_animation(left_btn)
      break;
    case right_btn.firstElementChild:
    case right_btn:
        snake.changeDirection('right')
      btn_animation(right_btn)
        break;
    case up_btn.firstElementChild:
    case up_btn:
      snake.changeDirection('up')
      btn_animation(up_btn)
      break;
    case down_btn.firstElementChild:
    case down_btn:
        snake.changeDirection('down')
      btn_animation(down_btn)
        break;
    default:
      break;
  }
})

function btn_animation(btn, time = 0.2) {
  btn.style.animation = `touched ${time}s`
  setTimeout(() => {
    btn.style.animation = ''
  }, time*1000);
}