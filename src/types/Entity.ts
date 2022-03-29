export type Id = number

export type Describable = {
  id: Id,
  name: string,
  sprite: string,
  text: string
}

export type Dictionary = {
  [id: Id]: any
}

export const dictionary = (list: any[]): Dictionary => list.reduce((a, b) => ({ ...a, [b.id]: b }), {})