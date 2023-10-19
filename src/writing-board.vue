<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: number
    height?: number
    capturePointer?: boolean
    listenResize?: boolean
  }>(),
  {
    width: 300,
    height: 150,
    capturePointer: true,
    listenResize: true,
  }
)

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null

let rect: DOMRect | null = null

let active = false

const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target === canvas.value) {
      rect = canvas.value?.getBoundingClientRect() as DOMRect
    }
  })
})

onMounted(() => {
  canvas.value?.addEventListener('mousedown', handleMouseDown)
  canvas.value?.addEventListener('mousemove', handleMouseMove)
  canvas.value?.addEventListener('mouseup', handleMouseUp)
  canvas.value?.addEventListener('pointerdown', handlePointerDown)
  canvas.value?.addEventListener('pointerup', handlePointUp)

  ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

  rect = canvas.value?.getBoundingClientRect() as DOMRect

  props.listenResize && observer.observe(canvas.value as HTMLCanvasElement)
})

onUnmounted(() => {
  canvas.value?.removeEventListener('mousedown', handleMouseDown)
  canvas.value?.removeEventListener('mousemove', handleMouseMove)
  canvas.value?.removeEventListener('mouseup', handleMouseUp)
  canvas.value?.removeEventListener('pointerdown', handlePointerDown)
  canvas.value?.removeEventListener('pointerup', handlePointUp)

  ctx = null

  rect = null

  props.listenResize && observer.unobserve(canvas.value as HTMLCanvasElement)
})

const handlePointerDown = (e: PointerEvent) => {
  props.capturePointer && canvas.value?.setPointerCapture(e.pointerId)
}

const handlePointUp = (e: PointerEvent) => {
  props.capturePointer && canvas.value?.releasePointerCapture(e.pointerId)
}

const handleMouseDown = (e: MouseEvent) => {
  active = true

  ctx?.moveTo(e.clientX, e.clientY)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!active) return

  ctx?.lineTo(e.clientX - (rect?.x ?? 0), e.clientY - (rect?.y ?? 0))
  ctx?.stroke()
}

const handleMouseUp = () => {
  active = false

  ctx?.stroke()
}

const generateDataURL = (type?: string, encoderOptions?: number) => {
  return canvas.value?.toDataURL(type, encoderOptions) ?? null
}

const generateBlob = (callback: (blob: Blob | null) => void, type?: string, quality?: number) => {
  return canvas.value?.toBlob(callback, type, quality)
}

const generateStream = (frameRequestRate?: number) => {
  return canvas.value?.captureStream(frameRequestRate)
}

defineOptions({
  name: 'WritingBoard',
  inheritAttrs: false,
})

defineExpose({
  canvas,
  generateDataURL,
  generateBlob,
  generateStream,
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
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
