import {Describable, dictionary, Dictionary} from '@/types/Entity'
import {Span} from '@/types/Basic'

type Engine = Describable & {
  speed: Span,
  power: number
}

const engineList: Engine[] = [
  {
    id: 0,
    name: 'Rusty engine',
    sprite: '',
    text: '',
    speed: {
      min: .5,
      max: 4
    },
    power: 10
  }
]

const enginesTypes: Dictionary = dictionary(engineList)
export default enginesTypes