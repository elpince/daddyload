import { createStore } from 'vuex'
import UI from './modules/ui'
import MachineEditor from './modules/machine-editor'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    ui: UI,
    machineEditor: MachineEditor
  }
})
