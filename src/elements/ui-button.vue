<template>
  <button
    class="ui-button"
   >
    <slot/>
  </button>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({
  name: 'ui-button'
})
export default class UiButton extends Vue {}
</script>
