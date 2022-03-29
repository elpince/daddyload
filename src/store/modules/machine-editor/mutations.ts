import { MutationTree } from 'vuex'
import { MachineEditorState } from './state'
import { Position } from '@/types/Basic'
import Machine from '@/classes/Machine'

const machineEditorMutations: MutationTree<MachineEditorState> = {
  workshopSize(state, size: number): void {
    state.workshopSize = size
  },
  machineShape(state, position: Position): void {
    if (position.x === 0 && position.y === 0) return
    if (state.machineShape.some(p => position.x === p.x && position.y === p.y)) {
      state.machineShape = state.machineShape.filter(p => position.x !== p.x || position.y !== p.y)
    } else {
      state.machineShape = [ ...state.machineShape, position ]
    }
    if (state.machine) state.machine.setMachineShape(state.machineShape.map(cell => ({ position: cell })))
  },
  machine(state, machine: Machine) {
    state.machine = machine
    state.machine.setMachineShape(state.machineShape.map(cell => ({ position: cell })))
  }
}

export default machineEditorMutations