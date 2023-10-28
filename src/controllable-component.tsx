import { defineComponent, onMounted, onUnmounted, reactive, ref, type SlotsType } from 'vue'
import { normalizeCSSValue } from './util'

const ControllableComponent = /* #__PURE__ */ defineComponent({
  name: 'ControllableComponent',
  inheritAttrs: false,
  props: {
    enableDrag: {
      type: Boolean,
      default: true,
    },
    enableRotate: {
      type: Boolean,
      default: true,
    },
    enableScale: {
      type: Boolean,
      default: true,
    },
    initialWidth: {
      type: [String, Number],
      default: 100,
    },
    initialHeight: {
      type: [String, Number],
      default: 100,
    },
    initialRotate: {
      type: String,
      default: '0deg',
    },
    capturePointer: {
      type: Boolean,
      default: true,
    },
    dragSpeed: {
      type: Number,
      default: 1,
    },
    rotateSpeed: {
      type: Number,
      default: 1,
    },
    scaleSpeed: {
      type: Number,
      default: 1,
    },
  },
  slots: Object as SlotsType<{
    default?: () => unknown
  }>,
  setup: (props, { slots, expose }) => {
    const container = ref<HTMLDivElement | null>(null)

    const box = ref<HTMLDivElement | null>(null)

    const styles = reactive({
      width: normalizeCSSValue(props.initialWidth),
      height: normalizeCSSValue(props.initialHeight),
      left: '0px',
      top: '0px',
      rotate: props.initialRotate,
    })

    const isDrag = ref(false)

    const isRotate = ref(false)

    const isScale = ref(0)

    let rect: DOMRect | null = null

    const factors: Array<[width: number, left: number, height: number, top: number]> = [
      [-2, 0, -2, 0],
      [0, 0, -2, 0],
      [2, 0, -2, 0],
      [2, 0, 0, 0],
      [2, 0, 2, 0],
      [0, 0, 2, 0],
      [-2, 0, 2, 0],
      [-2, 0, 0, 0],
    ]

    const controls: Array<[top: string, left: string, cursor: string]> = [
      ['0', '0', 'nwse-resize'],
      ['0', '50%', 'ns-resize'],
      ['0', '100%', 'nesw-resize'],
      ['50%', '100%', 'ew-resize'],
      ['100%', '100%', 'nwse-resize'],
      ['100%', '50%', 'ns-resize'],
      ['100%', '0', 'nesw-resize'],
      ['50%', '0', 'ew-resize'],
    ]

    const handleMousedown = (e: MouseEvent): void => {
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

    const handleMousemove = (e: MouseEvent): void => {
      if (isDrag.value && props.enableDrag) {
        styles.left = normalizeCSSValue(Number.parseInt(styles.left) + e.movementX * props.dragSpeed)
        styles.top = normalizeCSSValue(Number.parseInt(styles.top) + e.movementY * props.dragSpeed)
      }

      if (isRotate.value && props.enableRotate) {
        const x = (rect as DOMRect).left + (rect as DOMRect).width / 2
        const y = (rect as DOMRect).top + (rect as DOMRect).height / 2
        styles.rotate = normalizeCSSValue(((Math.atan2(y - e.clientY, x - e.clientX) * 180) / Math.PI - 90) * props.rotateSpeed, 'deg')
      }

      if (isScale.value !== 0 && props.enableScale) {
        const [width, left, height, top] = factors[isScale.value - 1]
        styles.width = normalizeCSSValue(Number.parseInt(styles.width) + e.movementX * width * props.scaleSpeed)
        styles.left = normalizeCSSValue(Number.parseInt(styles.left) + e.movementX * left * props.scaleSpeed)
        styles.height = normalizeCSSValue(Number.parseInt(styles.height) + e.movementY * height * props.scaleSpeed)
        styles.top = normalizeCSSValue(Number.parseInt(styles.top) + e.movementY * top * props.scaleSpeed)
      }
    }

    const handleMouseup = (): void => {
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

    const handlePointerdown = (e: PointerEvent): void => {
      props.capturePointer && container.value?.setPointerCapture(e.pointerId)
    }

    const handlePointup = (e: PointerEvent): void => {
      props.capturePointer && container.value?.releasePointerCapture(e.pointerId)
    }

    onMounted(() => {
      rect = (box.value as HTMLDivElement).getBoundingClientRect()
    })

    onUnmounted(() => {
      rect = null
    })

    expose({
      container,
      box,
      isDrag,
      isRotate,
      isScale,
    })

    return () => (
      <>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={container}
          style={{
            position: 'relative',
            width: styles.width,
            height: styles.height,
          }}
          onMousedown={handleMousedown}
          onMousemove={handleMousemove}
          onMouseup={handleMouseup}
          {...(props.capturePointer
            ? {
                onPointerdown: handlePointerdown,
                onPointerup: handlePointup,
              }
            : {})}
        >
          <div
            ref={box}
            style={{
              position: 'absolute',
              zIndex: 999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'grab',
              userSelect: 'none',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#ccc',
              width: styles.width,
              height: styles.height,
              left: styles.left,
              top: styles.top,
              rotate: styles.rotate,
            }}
          >
            <div>{slots.default?.()}</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              width="16"
              height="16"
              style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                translate: '-50% 0',
              }}
            >
              <path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path>
            </svg>

            {controls.map(([top, left, cursor], i) => (
              <li
                key={i + 1}
                data-id={i + 1}
                style={{
                  position: 'absolute',
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ccc',
                  borderRadius: '50%',
                  translate: '-50% -50%',
                  top,
                  left,
                  cursor,
                }}
              ></li>
            ))}
          </div>
        </div>
      </>
    )
  },
})

export default ControllableComponent
