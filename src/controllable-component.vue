<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, useCssModule, type CSSProperties } from 'vue'

const module = useCssModule()

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

const rotateIcon = ref<SVGSVGElement | null>(null)

const classes = computed(() => [module.box, isDrag.value ? module.drag : ''])

const styles = reactive({
  width: typeof props.initialWidth === 'number' ? `${props.initialWidth}px` : props.initialWidth,
  height: typeof props.initialHeight === 'number' ? `${props.initialHeight}px` : props.initialHeight,
  left: '0px',
  top: '0px',
  rotate: props.initialRotate,
} satisfies CSSProperties)

const isDrag = ref(false)

const isRotate = ref(false)

let rect: DOMRect | null = null

const handleMouseDown = (e: MouseEvent) => {
  switch (e.target) {
    case box.value:
      isDrag.value = true
      break
    case rotateIcon.value:
      isRotate.value = true
      break
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
}

const handleMouseUp = () => {
  if (isDrag.value) {
    isDrag.value = false

    rect = (box.value as HTMLDivElement).getBoundingClientRect()
  }
  if (isRotate.value) {
    isRotate.value = false
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
})
</script>

<template>
  <div ref="container" :class="$style.container" :style="{ width: styles.width, height: styles.height }">
    <div ref="box" :class="classes" :style="styles">
      <div>{{ slots.default?.() }}</div>

      <svg ref="rotateIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="16" height="16" :class="$style['rotate-icon']">
        <path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path>
      </svg>
    </div>
  </div>
</template>

<style module lang="scss">
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

  &.drag {
    cursor: grabbing;
  }

  .rotate-icon {
    position: absolute;
    top: -16px;
    left: 50%;
    translate: -50% 0;
  }
}
</style>
