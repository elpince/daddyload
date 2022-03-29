import { Span } from './Utils'

interface Cell {
  id: number,
  title: string,
  sprite: string,
  text: string,
  canDig: boolean,
  canPass: boolean,
  value?: number,
  depth?: Span,
  onDig?: () => void,
  onApproach?: () => void,
  onPass?: () => void,
}

export const cellList: Cell[] = [
  {
    id: 0,
    title: 'Empty',
    sprite: '',
    text: '',
    canDig: false,
    canPass: true
  },
  {
    id: 1,
    title: 'Ground',
    sprite: '',
    text: '',
    canDig: true,
    canPass: false
  },
]

const cellTypes: { [key: number]: Cell } = {}
cellList.forEach((type: Cell) => {
  cellTypes[type.id] = type
})

export default cellTypes