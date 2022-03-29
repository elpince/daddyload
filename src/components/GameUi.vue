<template>
  <div
    class="game-ui"
    ref="gameUI"
  >
    <machine-editor v-if="currentUi === 'machineEditor'"/>
    <ui-button
      class="parameters-button"
      @click="openUI"
    >
      Open
    </ui-button>
  </div>
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Vue, Options } from 'vue-class-component'
import UiButton from '@/elements/ui-button.vue'
import MachineEditor from '@/components/MachineEditor.vue'

const ui = namespace('ui')

@Options({
  name: 'game-ui',
  components: {
    UiButton,
    MachineEditor
  }
})
export default class GameUi extends Vue {
  @ui.Getter('currentUi') currentUi!: string
  @ui.Mutation('currentUi') setCurrentUi!: (element: string) => void
  $refs!: {
    gameUI: HTMLElement
  }

  mounted() {
    this.$emit('register-focus', {
      name: 'gameUI',
      element: this.$refs.gameUI
    })
  }

  openUI() {
    this.setCurrentUi('machineEditor')
  }
}
</script>
