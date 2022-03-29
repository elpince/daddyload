import { GetterTree } from 'vuex'
import { UIState } from '@/store/modules/ui/state'

const uiGetters: GetterTree<UIState, any> = {
  uiOpen(state): boolean {
    return state.uiOpen
  },
  currentUi(state): string {
    return state.currentUi
  }
}

export default uiGetters