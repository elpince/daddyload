<template>
  <div class="game">
    <game-canvas @register-focus="registerFocus"/>
    <game-ui @register-focus="registerFocus"/>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import GameCanvas from '@/components/GameCanvas.vue'
import GameUi from '@/components/GameUi.vue'
import Controls, { Focus } from '@/classes/Controls'

@Options({
  name: 'game-view',
  components: {
    GameCanvas,
    GameUi
  }
})
export default class GameView extends Vue {
  controls: Controls = new Controls().init()

  registerFocus(focus: Focus): void {
    this.controls.registerFocus(focus)
  }
}
</script>
