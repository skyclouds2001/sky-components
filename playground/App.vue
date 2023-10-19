<script setup lang="ts">
import { ref } from 'vue'
import { ControllableComponent, WritingBoard } from '@'

const mode = ref<'writing-board' | 'controllable-component'>('controllable-component')
</script>

<template>
  <div v-if="mode === 'writing-board'" style="margin: 25px">
    <writing-board />
  </div>
  <div v-if="mode === 'controllable-component'" style="margin: 25px">
    <controllable-component />
  </div>
</template>

<style scoped lang="scss"></style>
