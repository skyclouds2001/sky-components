<script setup lang="ts">
import { ControllableComponent, WritingBoard } from '@'
</script>

<template>
  <div style="margin: 25px 0">
    <writing-board />
  </div>
  <div style="margin: 25px 0">
    <controllable-component />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
</style>
