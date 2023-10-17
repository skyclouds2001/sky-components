<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    capturePointer?: boolean
  }>(),
  {
    width: 300,
    height: 150,
    capturePointer?: boolean
  }
)

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null

let rect: DOMRect | null = null

let active = false

onMounted(() => {
  canvas.value?.addEventListener('mousedown', handleMouseDown)
  canvas.value?.addEventListener('mousemove', handleMouseMove)
  canvas.value?.addEventListener('mouseup', handleMouseUp)
  canvas.value?.addEventListener('pointerdown', handlePointerDown)
  canvas.value?.addEventListener('pointerup', handlePointUp)

  ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

  rect = canvas.value?.getBoundingClientRect() as DOMRect
})

onUnmounted(() => {
  canvas.value?.removeEventListener('mousedown', handleMouseDown)
  canvas.value?.removeEventListener('mousemove', handleMouseMove)
  canvas.value?.removeEventListener('mouseup', handleMouseUp)
  canvas.value?.removeEventListener('pointerdown', handlePointerDown)
  canvas.value?.removeEventListener('pointerup', handlePointUp)

  ctx = null

  rect = null
})

const handlePointerDown = (e: PointerEvent): void => {
  canvas.value?.setPointerCapture(e.pointerId)
}

const handlePointUp = (e: PointerEvent): void => {
  canvas.value?.releasePointerCapture(e.pointerId)
}

const handleMouseDown = (e: MouseEvent): void => {
  active = true

  ctx?.moveTo(e.clientX, e.clientY)
}

const handleMouseMove = (e: MouseEvent): void => {
  if (!active) return

  ctx?.lineTo(e.clientX - (rect?.x ?? 0), e.clientY - (rect?.y ?? 0))
  ctx?.stroke()
}

const handleMouseUp = (): void => {
  active = false

  ctx?.stroke()
}

defineOptions({
  name: 'WritingBoard',
  inheritAttrs: false,
})

defineExpose({
  canvas,
})
</script>

<template>
  <canvas ref="canvas" :class="$style.canvas" :width="props.width" :height="props.height"></canvas>
</template>

<style module lang="scss">
.canvas {
  display: block;
  width: v-bind('props.width');
  height: v-bind('props.height');
}
</style>
