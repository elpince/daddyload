import { Size } from '@/entities/Utils'
import TileMap from '@/classes/TileMap'

export default class Canvas {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  size: Size
  tileMap: TileMap

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.size = {
      width: 0,
      height: 0
    }
    this.tileMap = new TileMap()
  }

  init(): Canvas {
    this.setCanvasSize()
    window.addEventListener('resize', this.setCanvasSize)

    return this
  }

  setCanvasSize(): void {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}