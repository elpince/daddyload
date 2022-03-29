import {Span} from '@/types/Basic'

type Speed = Span & {
  base: number
}

export const Speed = {
  min: 2,
  max: .1,
  base: .5
}