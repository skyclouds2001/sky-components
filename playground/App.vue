<script setup lang="ts">
import { ref } from 'vue'
import { ControllableComponent, WritingBoard, LocalFontSelect, FsTreeSelect, AudioPlayer } from '@'

type Mode = 'writing-board' | 'controllable-component' | 'local-font-select' | 'fs-tree-select' | 'audio-player'

const mode = ref<Mode>('audio-player')

const data = ref<any>(null)
</script>

<template>
  <div v-if="mode === 'writing-board'" style="margin: 25px">
    <writing-board />
  </div>
  <div v-if="mode === 'controllable-component'" style="margin: 25px">
    <controllable-component />
  </div>
  <div v-if="mode === 'local-font-select'" style="margin: 25px">
    <local-font-select v-model="data" />
    <div>{{ data }}</div>
  </div>
  <div v-if="mode === 'fs-tree-select'" style="margin: 25px">
    <fs-tree-select v-model="data" />
    <div>{{ data }}</div>
  </div>
  <div v-if="mode === 'audio-player'" style="margin: 25px">
    <audio-player source="/ls.m4a" />
  </div>
</template>

<style scoped lang="scss"></style>
