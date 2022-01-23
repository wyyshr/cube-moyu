class Snake {
  size = 10;
  xSpeed = this.size * 1
  ySpeed = 0
  targetNum = 0
  tails = []
  dirStatus = 'right'

  constructor(size = 10, x, y, canvasDom) {
    this.x = x
    this.y = y
    this.size = size
    this.canvasDom = canvasDom
  }

  isContrary(dir) {
    if (dir == 'up' && this.dirStatus == 'down') {
      return true
    } else if (dir == 'down' && this.dirStatus == 'up') {
      return true
    } else if (dir == 'left' && this.dirStatus == 'right') {
      return true
    } else if (dir == 'right' && this.dirStatus == 'left') {
      return true
    } else {
      return false
    }
  }

  draw() {
    const { ctx } = this.canvasDom
    ctx.fillStyle = '#fff'
    for (let i = 0; i < this.tails.length; i++) {
      const { x, y } = this.tails[i];
      ctx.fillRect(x, y, this.size, this.size)
    }
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }

  update () {
    for (let i = 0; i < this.tails.length - 1; i++) {
      this.tails[i] = this.tails[i + 1]
    }
    if (this.targetNum > 0) {
      this.tails[this.targetNum - 1] = {
        x: this.x,
        y: this.y
      }
    }
    this.x += this.xSpeed
    this.y += this.ySpeed
    
    const { width, height } = this.canvasDom.canvas
    if(this.x >= width) {
      this.x = 0
    }
    if(this.y >= height) {
      this.y = 0
    }
    if (this.x < 0) {
      this.x = width
    }
    if(this.y < 0) {
      this.y = height
    }
  }

  changeDirection (direction) {
    if(this.isContrary(direction)) return
    switch (direction) {
      case 'up':
        this.xSpeed = 0
        this.ySpeed = -this.size * 1
        break;
      case 'down':
        this.xSpeed = 0
        this.ySpeed = this.size * 1
        break;
      case 'left':
        this.xSpeed = -this.size * 1
        this.ySpeed = 0
        break;
      case 'right':
        this.xSpeed = this.size * 1
        this.ySpeed = 0
        break;
      default:
        break;
    }
    this.dirStatus = direction
  }

  eatTarget (target) {
    if(this.x == target.x && this.y == target.y) {
      this.targetNum++
      return true
    }
    return false
  }

  checkCollision() {
    const { width } = this.canvasDom.canvas
    for (let i = 0; i < this.tails.length; i++) {
      const { x, y} = this.tails[i];
      if (this.x == x && this.y == y) {
        this.x = width - this.size
        this.y = 0
        this.xSpeed = 0
        this.ySpeed = this.size * 1
        this.targetNum = 0
        this.tails = []
        return true
      }
    }
  }
}