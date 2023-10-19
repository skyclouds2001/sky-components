<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, useCssModule, type CSSProperties } from 'vue'

const module = useCssModule()

const props = withDefaults(
  defineProps<{
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    capturePointer?: boolean
  }>(),
  {
    width: 100,
    height: 100,
    capturePointer: true,
  }
)

const slots = defineSlots<{
  default?: () => unknown
}>()

const controller = ref<HTMLDivElement | null>(null)

const classes = computed(() => [module.box, isDrag.value ? module.drag : ''])

const styles = reactive({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  left: '0',
  top: '0',
})

const isDrag = ref(false)

const handleMouseDown = () => {
  isDrag.value = true
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDrag.value) {
    styles.left = `${Number.parseInt(styles.left) + e.movementX}px`
    styles.top = `${Number.parseInt(styles.top) + e.movementY}px`
  }
}

const handleMouseUp = () => {
  isDrag.value = false
}

const handlePointerDown = (e: PointerEvent) => {
  props.capturePointer && controller.value?.setPointerCapture(e.pointerId)
}

const handlePointUp = (e: PointerEvent) => {
  props.capturePointer && controller.value?.releasePointerCapture(e.pointerId)
}

onMounted(() => {
  controller.value?.addEventListener('mousedown', handleMouseDown)
  controller.value?.addEventListener('mousemove', handleMouseMove)
  controller.value?.addEventListener('mouseup', handleMouseUp)
  controller.value?.addEventListener('pointerdown', handlePointerDown)
  controller.value?.addEventListener('pointerup', handlePointUp)
})

onUnmounted(() => {
  controller.value?.removeEventListener('mousedown', handleMouseDown)
  controller.value?.removeEventListener('mousemove', handleMouseMove)
  controller.value?.removeEventListener('mouseup', handleMouseUp)
  controller.value?.removeEventListener('pointerdown', handlePointerDown)
  controller.value?.removeEventListener('pointerup', handlePointUp)
})

defineOptions({
  name: 'ControllableComponent',
  inheritAttrs: false,
})

defineExpose({
  box: controller,
})
</script>

<template>
  <div :class="$style.container">
    <div ref="controller" :class="classes" :style="styles">{{ slots.default?.() }}</div>
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  border: 1px solid #ccc;

  &.drag {
    cursor: grabbing;
  }
}
</style>
