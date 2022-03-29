export interface Focus {
  name: string,
  element: HTMLCanvasElement | HTMLElement,
  default: boolean
}

export default class Controls {
  focusElements: { [key: string]: HTMLCanvasElement | HTMLElement }
  focus?: string
  events: { [key: string]: Event }
  keyMap: { [key: string]: string }
  keysList: string[]
  keys: { [key: string]: string }
  pressedKeys: string[]

  constructor() {
    this.focusElements = {}
    this.focus = undefined
    this.keyMap = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown'
    }
    this.events = Object.keys(this.keyMap).reduce((a, b) => ({ ...a, [b]: new CustomEvent(b, { detail: true }) }), {})
    this.keys = {}
    this.keysList = []
    this.pressedKeys = []
  }

  init(): Controls {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
    this.setKeys()
    return this
  }

  setKeys(): void {
    this.keys = Object.keys(this.keyMap).reduce((a, b) => ({ ...a, [this.keyMap[b]]: b }), {})
    this.keysList = Object.keys(this.keyMap).map((event) => this.keyMap[event])
  }

  registerFocus(focus: Focus): void {
    if (this.focusElements[focus.name]) return
    this.focusElements[focus.name] = focus.element
    if (focus.default && !this.focus) this.focus = focus.name
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.pressedKeys.includes(e.key) || !this.keysList.includes(e.key) || !this.focus) return
    this.pressedKeys.push(e.key)
    this.focusElements[this.focus].dispatchEvent(this.events[this.keys[e.key]])
  }
  onKeyUp(e: KeyboardEvent): void {
    if (!this.pressedKeys.includes(e.key) || !this.keysList.includes(e.key) || !this.focus) return
    this.pressedKeys.splice(this.pressedKeys.indexOf(e.key), 1)
    this.focusElements[this.focus].dispatchEvent(this.events[this.keys[e.key]])
  }
}

export interface EventSettings {
  on?: () => void,
  off?: () => void
}

export class EventMapper {
  held: string[]
  events: { [key: string]: EventSettings }

  constructor(events: { [key: string]: EventSettings }) {
    this.held = []
    this.events = events
  }

  init(target: HTMLCanvasElement | HTMLElement): EventMapper {
    Object.keys(this.events).forEach((event) => {
      target.addEventListener(event, () => {
        this.handleEvent(event)
      })
    })
    return this
  }

  handleEvent(event: string) {
    if (this.held.includes(event)) {
      this.held.splice(this.held.indexOf(event), 1)
      if (this.events[event].off) this.events[event].off?.()
      return
    }
    this.held.push(event)
    if (this.events[event].on) this.events[event].on?.()
  }
}