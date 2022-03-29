import { GetterTree } from 'vuex'
import { MachineEditorState } from './state'
import { Position } from '@/types/Basic'
import Machine from '@/classes/Machine'

const machineEditorGetters: GetterTree<MachineEditorState, any> = {
  workshopSize(state): number {
    return state.workshopSize
  },
  machineShape(state): Position[] {
    return state.machineShape
  },
  machine(state): Machine | undefined {
    return state.machine
  }
}

export default machineEditorGetters