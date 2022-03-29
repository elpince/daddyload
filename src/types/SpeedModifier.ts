import {Span} from '@/types/Basic'

type SpeedModifier = Span & {
  base: number
}

export const SpeedModifier = {
  min: .25,
  max: 10,
  base: 2
}