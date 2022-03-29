import { Module } from 'vuex'
import machineEditorState from './state'
import machineEditorGetters from './getters'
import machineEditorMutations from './mutations'

const MachineEditor: Module<any, any> = {
  namespaced: true,
  state: () => machineEditorState,
  getters: machineEditorGetters,
  mutations: machineEditorMutations
}

export default MachineEditor