import { Size, Position, Direction } from '@/types/Basic'
import TileMap from '@/classes/TileMap'
import Machine from '@/classes/Machine'

export default class Scene {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  size: Size
  grid: {
    columns: number,
    rows: number
  }
  offset: Position
  tileSize: number
  tileMap: TileMap
  position: Position
  machine: Machine
  timer: {
    now: number,
    then: number
  }
  frameRate: number
  moving: number
  machineSpeed: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.size = {
      width: 0,
      height: 0
    }
    this.grid = {
      columns: 25,
      rows: 100
    }
    this.offset = {
      x: Math.floor(this.grid.columns / 2),
      y: Math.floor(this.grid.rows / 2)
    }
    this.tileSize = 0
    this.tileMap = new TileMap().init()
    this.position = {
      x: Math.floor(this.tileMap.columns / 2),
      y: this.tileMap.mapOptions.skyLayerCount - 1
    }
    this.machine = new Machine(this.tileMap, this.position, this.canvas).init()
    this.timer = {
      now: 0,
      then: 0
    }
    this.frameRate = 1000 / 60
    this.moving = 1
    this.machineSpeed = 0
  }

  init(): Scene {
    window.addEventListener('resize', () => {
      this.setCanvasSize()
    })
    this.setCanvasSize()
    this.update()
    return this
  }

  setCanvasSize(): void {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.canvas.width = this.size.width
    this.canvas.height = this.size.height
    this.tileSize = this.size.width / this.grid.columns
    this.grid.rows = Math.ceil(this.size.height / this.tileSize)
    this.offset.y = Math.floor(this.grid.rows / 2)
  }

  update(): void {
    this.timer.now = Date.now()
    const elapsed = this.timer.now - this.timer.then
    if (elapsed > this.frameRate) {
      this.moveMachine(elapsed - (elapsed % this.frameRate))
      this.updatePosition()
      this.renderTileMap()
      this.renderMachine()
      this.timer.then = this.timer.now - (elapsed % this.frameRate)
    }
    window.requestAnimationFrame(this.update.bind(this))
  }
  moveMachine(elapsed: number): void {
    if (this.moving >= 1 && this.machine.movement) {
      this.machine.move()
      this.moving = 0
    }
    this.moving += elapsed / 1000 * this.machine.speed
    // console.log(elapsed / 1000 * this.machine.speed)
  }
  updatePosition(): void {
    this.position.y = this.machine.position.y
    this.position.x = this.machine.position.x - this.offset.x <= 0 || this.machine.position.x + this.offset.x >= this.tileMap.columns
      ? this.position.x
      : this.machine.position.x
  }
  renderTileMap(): void {
    if (!this.ctx || !this.tileMap) return
    this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    // background
    this.ctx.fillStyle = 'rgba(0,0,0,0.7)'
    this.ctx.beginPath()
    this.ctx.rect(0, 0, this.size.width, this.size.height)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.textAlign = 'center'
    for (let y = 0; y < this.grid.rows; y++) {
      for (let x = 0; x < this.grid.columns; x++) {
        const position: Position = {
          x: this.position.x - this.offset.x + x,
          y: this.position.y - this.offset.y + y
        }
        if (position.x < 0 || position.x >= this.tileMap.map[y].length || position.y < 0 || this.tileMap.map[position.y][position.x] === 0) continue
        if (this.tileMap.map[position.y][position.x] === 1) this.ctx.fillStyle = 'rgb(0,0,0)'
        if (this.machine.collisionCells.some(cell => cell.x === position.x && cell.y === position.y)) this.ctx.fillStyle = 'rgb(0,0,255)'
        if (this.machine.movementCells.some(cell => cell.x === position.x && cell.y === position.y)) this.ctx.fillStyle = 'rgb(150,0,150)'
        this.ctx.beginPath()
        this.ctx.rect(
          this.tileSize * x,
          this.tileSize * y,
          this.tileSize,
          this.tileSize
        )
        this.ctx.fill()
        this.ctx.closePath()

        // Display coordinates
        this.ctx.beginPath()
        this.ctx.fillStyle = 'rgb(255,255,255)'
        this.ctx.fillText(`${position.x} - ${position.y}`, this.tileSize * x + this.tileSize / 2, this.tileSize * y + this.tileSize / 2)
        this.ctx.closePath()
      }
    }
  }
  renderMachine(): void {
    if (!this.ctx || !this.tileMap) return
    const position: Position = {
      x: this.machine.position.x - this.position.x + this.offset.x,
      y: this.machine.position.y - this.position.y + this.offset.y
    }
    for (let i = 0; i < this.machine.shape.length; i++) {
      this.ctx.beginPath()
      if (this.machine.movement && this.machine.edges[this.machine.movement].some(cell => cell.x === this.machine.shape[i].position.x && cell.y === this.machine.shape[i].position.y)) {
        this.ctx.fillStyle = 'rgb(0,255,0)'
      } else {
        this.ctx.fillStyle = 'rgb(255,0,0)'
      }
      this.ctx.rect(
        this.tileSize * (position.x + this.machine.shape[i].position.x),
        this.tileSize * (position.y + this.machine.shape[i].position.y),
        this.tileSize,
        this.tileSize
      )
      this.ctx.fill()
      this.ctx.closePath()
    }
  }
}