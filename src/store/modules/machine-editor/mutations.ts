import { MutationTree } from 'vuex'
import { UIState } from '@/store/modules/ui/state'

const uiMutations: MutationTree<UIState> = {
  uiOpen(state, isOpen: boolean): void {
    state.uiOpen = isOpen
  },
  currentUi(state, currentUi: string): void {
    if (state.currentUi === currentUi) {
      state.currentUi = ''
      return
    }
    state.currentUi = currentUi
  }
}

export default uiMutations