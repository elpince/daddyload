import {Describable, dictionary, Dictionary} from '@/types/Entity'
import {Span} from '@/types/Basic'

type DigEquipment = Describable & {
  speed: Span,
  power: number,
  efficiency: number
}

const digEquipmentList: DigEquipment[] = [
  {
    id: 0,
    name: 'Rusty drill',
    sprite: '',
    text: '',
    speed: {
      min: .5,
      max: 2
    },
    power: 20,
    efficiency: 1
  }
]

const digEquipmentsTypes: Dictionary = dictionary(digEquipmentList)
export default digEquipmentsTypes