import {Describable, dictionary, Dictionary} from '@/types/Entity'
import { Span } from '@/types/Basic'

type Tile = Describable & {
  canDig: boolean,
  canPass: boolean,
  density: number,
  value?: number,
  depth?: Span,
  onDig?: () => void,
  onApproach?: () => void,
  onPass?: () => void,
}

const tileTypeList: Tile[] = [
  {
    id: 0,
    name: 'Empty',
    sprite: '',
    text: '',
    canDig: false,
    canPass: true,
    density: 0
  },
  {
    id: 1,
    name: 'Ground',
    sprite: '',
    text: '',
    canDig: true,
    canPass: false,
    density: 5
  },
  {
    id: 2,
    name: 'Iron',
    sprite: '',
    text: '',
    canDig: true,
    canPass: false,
    density: 10
  },
]

export const tileTypes: Dictionary = dictionary(tileTypeList)
export default tileTypes