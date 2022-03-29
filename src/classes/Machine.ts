import {axis, Axis, Boundaries, Boundary, Direction, directions, Position} from '@/types/Basic'
import TileMap from '@/classes/TileMap'
import {EventMapper} from '@/classes/Controls'
import tileTypes from '@/entities/Tile'
import {Id} from '@/types/Entity'
import {MachineRoom} from '@/types/MachineRoom'
import enginesTypes from '@/entities/Engine'
import digEquipmentsTypes from "@/entities/DigEquipment";

export default class Machine {
  position: Position
  eventMapper: EventMapper
  movement: directions | null
  moving: boolean
  tileMap: TileMap
  shape: MachineRoom[]
  extremities: Boundary
  edges: Boundaries
  collisionCells: Position[]
  movementCells: Position[]
  movementStack: directions[]
  speed: number
  digEquipment: Id
  engine: Id
  load: number

  constructor(tileMap: TileMap, startPosition: Position, canvas: HTMLCanvasElement) {
    this.position = startPosition
    this.eventMapper = new EventMapper({
      left: {
        on: () => { this.setMovement(directions.left, true) },
        off: () => { this.setMovement(directions.left, false) }
      },
      right: {
        on: () => { this.setMovement(directions.right, true) },
        off: () => { this.setMovement(directions.right, false) }
      },
      up: {
        on: () => { this.setMovement(directions.up, true) },
        off: () => { this.setMovement(directions.up, false) }
      },
      down: {
        on: () => { this.setMovement(directions.down, true) },
        off: () => { this.setMovement(directions.down, false) }
      }
    }).init(canvas)
    this.movement = null
    this.moving = false
    this.tileMap = tileMap
    this.shape = []
    this.extremities = {
      left: 0,
      right: 0,
      up: 0,
      down: 0
    }
    this.edges = {
      left: [],
      right: [],
      up: [],
      down: []
    }
    this.collisionCells = []
    this.movementCells = []
    this.movementStack = []
    this.speed = 0
    this.digEquipment = 0
    this.engine = 0
    this.load = 0
  }

  init(): Machine {
    return this
  }

  setMachineShape(shape: MachineRoom[]) {
    this.shape = shape
    const x = [...new Set(shape.map(cell => cell.position.x))]
    const y = [...new Set(shape.map(cell => cell.position.y))]
    this.edges = {
      left: this.setEdge(y, directions.left, axis.y),
      right: this.setEdge(y, directions.right, axis.y),
      up: this.setEdge(x, directions.up, axis.x),
      down: this.setEdge(x, directions.down, axis.x)
    }
    this.extremities = {
      left: Math.min(...x),
      right: Math.max(...x),
      up: Math.min(...y),
      down: Math.max(...y)
    }
  }

  private setEdge(list: number[], direction: directions, axe: axis) {
    return list.map(val => {
      return this.shape.filter(room => room.position[axe] === val)
        .map(room => room.position)
        .find((cell, i, a) => {
          const ax = axe === axis.x ? axis.y : axis.x
          const value = [directions.left, directions.up].includes(direction)
            ? Math.min(...a.map(c => c[ax]))
            : Math.max(...a.map(c => c[ax]))
          return value === cell[ax]
      }) || { x: 0, y: 0 }
    })
  }

  private setMovement(direction: directions, on: boolean) {
    if (on) {
      this.movementStack.push(direction)
    } else {
      this.movementStack.splice(this.movementStack.indexOf(direction), 1)
    }
    this.movement = this.movementStack.length > 0 ? this.movementStack[this.movementStack.length - 1] : null
    if (!this.movement) {
      this.collisionCells = []
      this.movementCells = []
    }
  }

  move() {
    if (!this.movement) return
    let moved = false
    this.collisionCells = this.adjacentCells(this.movement)
    const ax: axis = Axis[axis.x].includes(this.movement) ? axis.y : axis.x
    this.movementCells = Axis[ax].map(a => this.adjacentCells(a)).flat()
    const collision = !this.collisionCells.every(cell => tileTypes[this.tileMap.map[cell.y][cell.x]]?.canPass)
    const traction = this.movementCells.some(cell => !tileTypes[this.tileMap.map[cell.y][cell.x]]?.canPass)
    this.calcSpeed()
    if (collision) {
      moved = true
      this.dig()
      this.changePosition(this.movement)
    }
    if (!moved && traction) {
      this.changePosition(this.movement)
    }
    this.fall()
  }

  dig() {
    if (this.collisionCells.length > 0) {
      this.collisionCells.forEach(cell => {
        this.tileMap.map[cell.y][cell.x] = 0
      })
    }
  }

  fall() {
    if ([...Axis[axis.x].map(a => this.adjacentCells(a)).flat(), ...this.adjacentCells(directions.down)].some(cell => !tileTypes[this.tileMap.map[cell.y][cell.x]]?.canPass)) return
    this.changePosition(directions.down)
  }

  private changePosition(direction: directions) {
    this.position = {
      x: this.position.x + Direction[direction].x + this.extremities.left <= 0 || this.position.x + Direction[direction].x + this.extremities.right >= this.tileMap.columns ? this.position.x : this.position.x + Direction[direction].x,
      y: this.position.y + Direction[direction].y
    }
  }

  private adjacentCells(direction: directions): Position[] {
    if (!direction) return []
    return this.edges[direction].map(cell => {
      return direction
        ? { x: cell.x + Direction[direction].x + this.position.x, y: cell.y + Direction[direction].y + this.position.y }
        : cell
    })
  }

  private calcSpeed() {
    let friction = Math.max(...this.collisionCells.map(cell => tileTypes[this.tileMap.map[cell.y][cell.x]].density))
    const equipment = friction > 0
      ? digEquipmentsTypes[this.digEquipment]
      : enginesTypes[this.engine]
    friction = friction > 0 ? friction : this.load
    this.speed = equipment.speed.min + (equipment.speed.max - equipment.speed.min) * ((equipment.power - friction) / equipment.power)
    this.speed = this.speed >= equipment.speed.min ? this.speed : equipment.speed.min
  }
}