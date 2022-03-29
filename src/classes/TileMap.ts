import SimplexNoise from 'simplex-noise'
import { Position } from '@/types/Basic'
import {Id} from "@/types/Entity";

export default class TileMap {
  columns: number
  rows: number
  mapOptions: { [key: string]: number }
  simplex: SimplexNoise
  map: Id[][]
  openings: Position[][]

  constructor() {
    this.columns = 40
    this.rows = 100
    this.mapOptions = {
      noiseZoom: 10,
      emptyThreshold: .5,
      baseLayerCount: 2,
      skyLayerCount: 15,
      smallOpening: 6
    }
    this.simplex = new SimplexNoise()
    this.map = []
    this.openings = []
  }

  init(): TileMap {
    this.initMap()
    return this
  }

  initMap(): void {
    // Noise map
    const map: number[][] = []
    for (let y = 0; y < this.rows; y++) {
      map[y] = []
      for (let x = 0; x < this.columns; x++) {
        const isEmpty = this.simplex.noise2D(x / this.mapOptions.noiseZoom, y / this.mapOptions.noiseZoom) > this.mapOptions.emptyThreshold
        map[y][x] = (isEmpty && y >= this.mapOptions.baseLayerCount + this.mapOptions.skyLayerCount) || y < this.mapOptions.skyLayerCount ? 0 : 1
      }
    }
    // openings
    let id = 0
    const openings: Position[][] = []
    const pendingTiles: Position[] = []
    map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile !== 0) return
        if (pendingTiles.some((t) => t.x === x && t.y === y)) {
          pendingTiles.splice(pendingTiles.findIndex((t) => t.x === x && t.y === y), 1)
          return
        }
        const adjacent = this.emptyAdjacentCells({ x: x, y: y }, map, [{ x: x, y: y }])
        openings[id] = [
          { x: x, y: y },
          ...adjacent
        ]
        adjacent.forEach(t => {
          pendingTiles.push(t)
        })
        id++
      })
    })
    // collapse openings
    const smallOpenings: number[] = []
    openings.forEach((opening, index) => {
      if (opening.length > this.mapOptions.smallOpening) return
      opening.forEach((tile) => {
        map[tile.y][tile.x] = 1
      })
      smallOpenings.push(index)
    })
    smallOpenings.forEach(index => {
      openings.splice(index, 1)
    })
    this.openings = openings
    this.map = map
  }

  emptyAdjacentCells(tile: Position, map: number[][], list: Position[]): Position[] {
    const p: { [key: string]: number } = {
      l: tile.x - 1,
      r: tile.x + 1,
      t: tile.y - 1,
      b: tile.y + 1
    }
    const valid: { [key: string]: boolean } = {
      l: p.l >= 0,
      r: p.r < map[tile.y].length,
      t: p.t >= 0,
      b: p.b < map.length
    }
    const cells: Position[] = [];
    ['l', 'r', 't', 'b'].forEach((side: string) => {
      if (!valid[side]) return
      if (['l', 'r'].includes(side) && map[tile.y][p[side]] === 0 && !list.some(t => t.x === p[side] && t.y === tile.y)) {
        cells.push({ x: p[side], y: tile.y })
        list.push({ x: p[side], y: tile.y })
      }
      if (['t', 'b'].includes(side) && map[p[side]][tile.x] === 0 && !list.some(t => t.x === tile.x && t.y === p[side])) {
        cells.push({ x: tile.x, y: p[side] })
        list.push({ x: tile.x, y: p[side] })
      }
    })
    let a: Position[] = []
    if (cells.length > 0) {
      cells.forEach((cell) => {
        a = [
          ...a,
          ...this.emptyAdjacentCells(cell, map, list)
        ]
      })
    }
    return [ ...cells, ...a]
  }
}