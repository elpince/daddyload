export interface UIState {
  uiOpen: boolean,
  currentUi: string
}

const uiState: UIState = {
  uiOpen: false,
  currentUi: ''
}

export default uiState