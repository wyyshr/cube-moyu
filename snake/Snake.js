class Snake {
  size = 10;
  factor = 3
  xSpeed = this.size * this.factor
  ySpeed = 0
  targetNum = 0
  positionHistory = [];
  tails = []
  dirStatus = 'right'
  center = {
    x: 0, y: 0
  }

  constructor(size = 10, x, y, canvasDom) {
    this.x = x
    this.y = y
    this.size = size
    this.canvasDom = canvasDom
    this.sound_press = document.getElementById("offline-sound-press")
    this.sound_hit = document.getElementById("offline-sound-hit")
    this.sound_reached = document.getElementById("offline-sound-reached")
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
    const radius = this.size / 2
    ctx.fillStyle = '#fff'
    for (let i = 0; i < this.tails.length; i++) {
      const { x, y } = this.tails[i];
      ctx.beginPath();
      // ctx.fillRect(x, y, this.size, this.size)
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      // ctx.fillRect(this.x, this.y, this.size, this.size)
      ctx.fill();
      ctx.closePath()
    }
    ctx.fillStyle = '#fff'
    ctx.beginPath();
    // ctx.fillRect(this.x, this.y, this.size, this.size)
    ctx.arc(this.center.x, this.center.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()

    // 眼睛
    ctx.fillStyle = '#000'
    ctx.beginPath();
    // ctx.fillRect(this.x, this.y, this.size, this.size)
    ctx.arc(this.center.x, this.center.y, radius*0.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()
  }

  update(dt = 0) {
    // 头
    this.x += this.xSpeed * this.factor * dt
    this.y += this.ySpeed * this.factor * dt
    this.center.x = this.x + (this.size / 2)
    this.center.y = this.y + (this.size / 2)
    // 尾巴
    this.updateTails(dt)

    // 边界
    const { width, height } = this.canvasDom.canvas
    if (this.center.x >= width) { this.x = -this.size/2 }
    if (this.center.y >= height) { this.y = -this.size/2 }
    if (this.center.x < 0) { this.x = width - (this.size/2) }
    if (this.center.y < 0) { this.y = height - (this.size/2) }
  }

  changeDirection(direction) {
    if (this.isContrary(direction)) return
    switch (direction) {
      case 'up':
        this.xSpeed = 0
        this.ySpeed = -this.size * this.factor
        break;
      case 'down':
        this.xSpeed = 0
        this.ySpeed = this.size * this.factor
        break;
      case 'left':
        this.xSpeed = -this.size * this.factor
        this.ySpeed = 0
        break;
      case 'right':
        this.xSpeed = this.size * this.factor
        this.ySpeed = 0
        break;
      default:
        break;
    }
    this.dirStatus = direction
    this.sound_press.play()
  }

  eatTarget(target) {

    if (this.distance(this.center, target) <= this.size) {
      this.targetNum++
      // 添加尾巴
      this.addTail()
      this.sound_reached.play()
      return true
    }
    return false
  }

  addTail() {
    const p = this.tails.length == 0 ? this : this.tails[this.tails.length - 1]
    const pos = { x: p.x + this.size, y: p.y }
    this.tails.push(pos)
  }

  updateTails(dt) {
    // 添加当前位置到历史
    this.positionHistory.unshift({ x: this.x, y: this.y });
    const tailSpacing = 30
    // 保持历史长度足够长
    const minHistoryLength = this.tails.length * tailSpacing + 10;
    while (this.positionHistory.length > minHistoryLength) {
      this.positionHistory.pop();
    }
    
    // 更新每个尾巴的位置
    for (let i = 0; i < this.tails.length; i++) {
      // 计算应该在历史中的哪个位置
      const index = (i + 1) * tailSpacing;
      if (index < this.positionHistory.length) {
        this.tails[i].x = this.positionHistory[index].x;
        this.tails[i].y = this.positionHistory[index].y;
      }
    }
  }

  checkCollision() {
    const { width } = this.canvasDom.canvas
    const minDis = this.size * 0.8;
    for (let i = 0; i < this.tails.length; i++) {
      const dis = this.distance(this, this.tails[i])      
      if (dis <= minDis && i > 3) {
        this.x = width - this.size
        this.y = 0
        this.xSpeed = 0
        this.ySpeed = this.size * 1
        this.targetNum = 0
        this.tails = []
        this.sound_hit.play()
        return true
      }
    }
  }

  distance(p1, p2) {
    const x = Math.abs(p1.x - p2.x), y = Math.abs(p1.y - p2.y)
    return Math.sqrt(x * x + y * y)
  }
}