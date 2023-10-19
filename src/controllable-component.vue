<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    initialWidth?: CSSProperties['width']
    initialHeight?: CSSProperties['height']
    initialRotate?: CSSProperties['rotate']
    capturePointer?: boolean
  }>(),
  {
    initialWidth: 100,
    initialHeight: 100,
    initialRotate: '0deg',
    capturePointer: true,
  }
)

const slots = defineSlots<{
  default?: () => unknown
}>()

const container = ref<HTMLDivElement | null>(null)

const box = ref<HTMLDivElement | null>(null)

const styles = reactive({
  width: typeof props.initialWidth === 'number' ? `${props.initialWidth}px` : props.initialWidth,
  height: typeof props.initialHeight === 'number' ? `${props.initialHeight}px` : props.initialHeight,
  left: '0px',
  top: '0px',
  rotate: props.initialRotate,
} satisfies CSSProperties)

const isDrag = ref(false)

const isRotate = ref(false)

const isScale = ref(0)

let rect: DOMRect | null = null

const sets: [width: number, height: number, top: number, left: number][] = [
  [1, 1, -1, -1],
  [1, 0, 0, -1],
  [1, 2, 0, -1],
  [0, 2, 0, 0],
  [2, 2, 0, 0],
  [2, 0, 0, 0],
  [2, 1, -1, 0],
  [0, 1, -1, 0],
]

const handleMouseDown = (e: MouseEvent) => {
  if (e.target instanceof HTMLDivElement) {
    isDrag.value = true
  }
  if (e.target instanceof SVGSVGElement) {
    isRotate.value = true
  }
  if (e.target instanceof HTMLLIElement) {
    isScale.value = Number.parseInt(e.target.dataset.id as string)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDrag.value) {
    styles.left = `${Number.parseInt(styles.left) + e.movementX}px`
    styles.top = `${Number.parseInt(styles.top) + e.movementY}px`
  }
  if (isRotate.value) {
    const x = (rect as DOMRect).left + (rect as DOMRect).width / 2
    const y = (rect as DOMRect).top + (rect as DOMRect).height / 2
    styles.rotate = `${(Math.atan2(y - e.clientY, x - e.clientX) * 180) / Math.PI - 90}deg`
  }
  if (isScale.value !== 0) {
    const [w, h, t, l] = sets[isScale.value - 1]
    styles.width = `${Number.parseInt(styles.width) + e.movementX * w}px`
    styles.height = `${Number.parseInt(styles.height) + e.movementX * h}px`
    styles.top = `${Number.parseInt(styles.top) + e.movementX * t}px`
    styles.left = `${Number.parseInt(styles.left) + e.movementX * l}px`
  }
}

const handleMouseUp = () => {
  if (isDrag.value) {
    isDrag.value = false

    rect = (box.value as HTMLDivElement).getBoundingClientRect()
  }
  if (isRotate.value) {
    isRotate.value = false
  }
  if (isScale.value !== 0) {
    isScale.value = 0

    rect = (box.value as HTMLDivElement).getBoundingClientRect()
  }
}

const handlePointerDown = (e: PointerEvent) => {
  container.value?.setPointerCapture(e.pointerId)
}

const handlePointUp = (e: PointerEvent) => {
  container.value?.releasePointerCapture(e.pointerId)
}

onMounted(() => {
  container.value?.addEventListener('mousedown', handleMouseDown)
  container.value?.addEventListener('mousemove', handleMouseMove)
  container.value?.addEventListener('mouseup', handleMouseUp)

  props.capturePointer && container.value?.addEventListener('pointerdown', handlePointerDown)
  props.capturePointer && container.value?.addEventListener('pointerup', handlePointUp)

  rect = (box.value as HTMLDivElement).getBoundingClientRect()
})

onUnmounted(() => {
  container.value?.removeEventListener('mousedown', handleMouseDown)
  container.value?.removeEventListener('mousemove', handleMouseMove)
  container.value?.removeEventListener('mouseup', handleMouseUp)

  props.capturePointer && container.value?.removeEventListener('pointerdown', handlePointerDown)
  props.capturePointer && container.value?.removeEventListener('pointerup', handlePointUp)

  rect = null
})

defineOptions({
  name: 'ControllableComponent',
  inheritAttrs: false,
})

defineExpose({
  container,
  box,
  isDrag,
  isRotate,
  isScale,
})
</script>

<template>
  <div ref="container" :class="$style.container" :style="{ width: styles.width, height: styles.height }">
    <div ref="box" :class="[$style.box, isDrag ? $style['is-drag'] : '']" :style="styles">
      <div>{{ slots.default?.() }}</div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="16" height="16" :class="$style['rotate-controller']">
        <path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path>
      </svg>

      <li v-for="(_, i) in Array(8)" :key="i + 1" :data-id="i + 1" :class="$style['scalable-controller']"></li>
    </div>
  </div>
</template>

<style module lang="scss">
$scale-position: 1 0 0 nwse-resize, 2 0 50% ew-resize, 3 0 100% nesw-resize, 4 50% 100% ns-resize, 5 100% 100% nwse-resize, 6 100% 50% ew-resize, 7 100% 0 nesw-resize, 8 50% 0 ns-resize;

.container {
  position: relative;
}

.box {
  position: absolute;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  border: 1px solid black;

  &.is-drag {
    cursor: grabbing;
  }

  .rotate-controller {
    position: absolute;
    top: -20px;
    left: 50%;
    translate: -50% 0;
  }

  .scalable-controller {
    display: inline-block;
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #ccc;
    border-radius: 50%;
    translate: -50% -50%;

    @each $index, $left, $top, $cursor in $scale-position {
      &:nth-of-type(#{$index}) {
        top: $top;
        left: $left;
        cursor: $cursor;
      }
    }
  }
}
</style>
