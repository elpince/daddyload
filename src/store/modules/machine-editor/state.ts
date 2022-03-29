import { Position } from '@/types/Basic'
import Machine from '@/classes/Machine'

export interface MachineEditorState {
  workshopSize: number,
  machineShape: Position[],
  machine?: Machine
}

const machineEditorState: MachineEditorState = {
  workshopSize: 3,
  machineShape: [{ x: 0, y: 0}],
  machine: undefined
}

export default machineEditorState