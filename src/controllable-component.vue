<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, type CSSProperties } from 'vue'
import { CSSValueToNumber as ctn, NumberToCSSValue as ntc } from './util'

const props = withDefaults(
  defineProps<{
    enableDrag?: boolean
    enableRotate?: boolean
    enableScale?: boolean
    initialWidth?: CSSProperties['width']
    initialHeight?: CSSProperties['height']
    initialRotate?: CSSProperties['rotate']
    capturePointer?: boolean
    dragSpeed?: number
    rotateSpeed?: number
    scaleSpeed?: number
  }>(),
  {
    enableDrag: true,
    enableRotate: true,
    enableScale: true,
    initialWidth: 100,
    initialHeight: 100,
    initialRotate: '0deg',
    capturePointer: true,
    dragSpeed: 1,
    rotateSpeed: 1,
    scaleSpeed: 1,
  }
)

const slots = defineSlots<{
  default?: () => unknown
}>()

const container = ref<HTMLDivElement | null>(null)

const box = ref<HTMLDivElement | null>(null)

const styles = reactive({
  width: typeof props.initialWidth === 'number' ? ntc(props.initialWidth) : props.initialWidth,
  height: typeof props.initialHeight === 'number' ? ntc(props.initialHeight) : props.initialHeight,
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
  if (e.target instanceof HTMLDivElement && props.enableDrag) {
    isDrag.value = true
  }

  if (e.target instanceof SVGSVGElement && props.enableRotate) {
    isRotate.value = true
  }

  if (e.target instanceof HTMLLIElement && props.enableScale) {
    isScale.value = Number.parseInt(e.target.dataset.id as string)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDrag.value && props.enableDrag) {
    styles.left = ntc(ctn(styles.left) + e.movementX * props.dragSpeed)
    styles.top = ntc(ctn(styles.top) + e.movementY * props.dragSpeed)
  }

  if (isRotate.value && props.enableRotate) {
    const x = (rect as DOMRect).left + (rect as DOMRect).width / 2
    const y = (rect as DOMRect).top + (rect as DOMRect).height / 2
    styles.rotate = ntc(((Math.atan2(y - e.clientY, x - e.clientX) * 180) / Math.PI - 90) * props.rotateSpeed, 'deg')
  }

  if (isScale.value !== 0 && props.enableScale) {
    const [w, h, t, l] = sets[isScale.value - 1]
    styles.width = ntc(ctn(styles.width) + e.movementX * w * props.scaleSpeed)
    styles.height = ntc(ctn(styles.height) + e.movementX * h * props.scaleSpeed)
    styles.top = ntc(ctn(styles.top) + e.movementX * t * props.scaleSpeed)
    styles.left = ntc(ctn(styles.left) + e.movementX * l * props.scaleSpeed)
  }
}

const handleMouseUp = () => {
  if (isDrag.value && props.enableDrag) {
    isDrag.value = false

    rect = (box.value as HTMLDivElement).getBoundingClientRect()
  }

  if (isRotate.value && props.enableRotate) {
    isRotate.value = false
  }

  if (isScale.value !== 0 && props.enableScale) {
    isScale.value = 0

    rect = (box.value as HTMLDivElement).getBoundingClientRect()
  }
}

const handlePointerDown = (e: PointerEvent) => {
  props.capturePointer && container.value?.setPointerCapture(e.pointerId)
}

const handlePointUp = (e: PointerEvent) => {
  props.capturePointer && container.value?.releasePointerCapture(e.pointerId)
}

onMounted(() => {
  container.value?.addEventListener('mousedown', handleMouseDown)
  container.value?.addEventListener('mousemove', handleMouseMove)
  container.value?.addEventListener('mouseup', handleMouseUp)

  container.value?.addEventListener('pointerdown', handlePointerDown)
  container.value?.addEventListener('pointerup', handlePointUp)

  rect = (box.value as HTMLDivElement).getBoundingClientRect()
})

onUnmounted(() => {
  container.value?.removeEventListener('mousedown', handleMouseDown)
  container.value?.removeEventListener('mousemove', handleMouseMove)
  container.value?.removeEventListener('mouseup', handleMouseUp)

  container.value?.removeEventListener('pointerdown', handlePointerDown)
  container.value?.removeEventListener('pointerup', handlePointUp)

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
    <div ref="box" v-bind="$attrs" :class="[$style.box]" :style="styles">
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

  .rotate-controller {
    position: absolute;
    top: -20px;
    left: 50%;
    translate: -50% 0;
  }

  .scalable-controller {
    position: absolute;
    display: inline-block;
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
