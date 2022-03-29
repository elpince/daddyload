export enum directions {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down'
}

export enum axis {
  x = 'x',
  y = 'y'
}

export type Span = {
  min: number,
  max: number
}

export type Size = {
  width: number,
  height: number
}

export type Position = {
  [key in axis]: number
}

export const Axis: { [key in axis]: directions[] } = {
  x: [ directions.left, directions.right ],
  y: [ directions.up, directions.down ]
}

export type Boundaries = {
  [key in directions]: Position[]
}

export type Boundary = {
  [key in directions]: number
}

export const Direction: { [key in directions]: Position } = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 }
}
