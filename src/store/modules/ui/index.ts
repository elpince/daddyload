import { Module } from 'vuex'
import uiState from './state'
import uiGetters from './getters'
import uiMutations from './mutations'

const UI: Module<any, any> = {
  namespaced: true,
  state: () => uiState,
  getters: uiGetters,
  mutations: uiMutations
}

export default UI