<template>
  <canvas
    class="game-canvas"
    ref="gameCanvas"
  />
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Vue, Options } from 'vue-class-component'
import Scene from '@/classes/Scene'
import Machine from '@/classes/Machine'

const machineEditor = namespace('machineEditor')

@Options({
  name: 'game-canvas'
})
export default class GameCanvas extends Vue {
  @machineEditor.Mutation('machine') machine!: (machine: Machine) => void
  $refs!: {
    gameCanvas: HTMLCanvasElement
  }
  scene?: Scene

  mounted() {
    this.scene = new Scene(this.$refs.gameCanvas).init()
    this.machine(this.scene.machine)
    this.$emit('register-focus', {
      name: 'gameCanvas',
      element: this.$refs.gameCanvas,
      default: true
    })
  }
}
</script>
