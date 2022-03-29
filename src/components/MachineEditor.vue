<template>
  <div
    class="machine-editor"
    :style="styles"
  >
    <template v-for="(i, y) in workshopSize">
      <div v-for="(j, x) in workshopSize"
           class="machine-editor__cell"
           :class="{ 'machine-editor__cell--active': cellActive(x, y) }"
           :key="`${x}-${y}`"
           @click="addCell(x, y)"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { namespace } from 'vuex-class'
import { Vue, Options } from 'vue-class-component'
import { Position } from '@/types/Basic'

const machineEditor = namespace('machineEditor')

@Options({
  name: 'machine-editor',
})
export default class GameUi extends Vue {
  @machineEditor.Getter('workshopSize') workshopSize!: number
  @machineEditor.Getter('machineShape') machineShape!: Position[]
  @machineEditor.Mutation('machineShape') changeMachineShape!: (position: Position) => void

  get styles() {
    return {
      gridTemplateColumns: `repeat(${this.workshopSize}, 1fr)`
    }
  }
  get halfWorkshop(): number {
    return Math.floor(this.workshopSize / 2)
  }
  cellActive(x: number, y: number): boolean {
    return this.machineShape.some((cell) => {
      return cell.x === x - this.halfWorkshop && cell.y === y - this.halfWorkshop
    })
  }
  addCell(x: number, y: number) {
    this.changeMachineShape({
      x: x - this.halfWorkshop,
      y: y - this.halfWorkshop
    })
  }
}
</script>