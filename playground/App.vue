<script setup lang="ts">
import { AudioPlayer, ControllableComponent, FsTreeSelect, LocalFontSelect, ScreenRecorder, WritingBoard } from '@'
import { ref } from 'vue'

// @ts-expect-error - Local Font Access API
const font = ref<FontData>(null)

const file = ref<FileSystemFileHandle | null>(null)
</script>

<template>
  <div style="margin: 25px">
    <screen-recorder />
  </div>
  <div style="margin: 25px">
    <writing-board />
  </div>
  <div style="margin: 25px">
    <controllable-component />
  </div>
  <div style="margin: 25px">
    <local-font-select v-model="font" />
    <div>{{ font }}</div>
  </div>
  <div style="margin: 25px">
    <fs-tree-select v-model="file" />
    <div>{{ file }}</div>
  </div>
  <div style="margin: 25px">
    <audio-player source="/audio.m4a" />
  </div>
</template>

<style scoped lang="scss"></style>
