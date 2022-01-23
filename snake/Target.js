class Target {
  colorIdx = -1
  colors = ['#f15b6c', '#f3704b','#fcaf17', '#7fb80e', '#5e7c85', '#50b7c1', '#9b95c9']
  // colors = ['#f15b6c', '#ffd400' ,'#50b7c1']
  size = 10
  constructor(size, canvasOptions) {
    this.size = size
    this.canvasOptions = canvasOptions
  }

  draw () {
    const { ctx } = this.canvasOptions
    // ctx.fillStyle = this.colors[Math.round(Math.random() * 6)]
    ctx.fillStyle = this.colors[this.colorIdx]
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }

  getRandomLocation() {
    const { rows, columns } = this.canvasOptions
    this.x = (Math.floor(Math.random() * columns - 1) + 1) * this.size
    this.y = (Math.floor(Math.random() * rows - 1) + 1) * this.size
    this.colorIdx++
    if (this.colorIdx >= 7) this.colorIdx = 0
  }
}