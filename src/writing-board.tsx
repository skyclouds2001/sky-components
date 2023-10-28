import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { normalizeCSSValue } from './util'

const WritingBoard = /* #__PURE__ */ defineComponent({
  name: 'WritingBoard',
  inheritAttrs: false,
  props: {
    width: {
      type: [Number, String],
      default: 300,
    },
    height: {
      type: [Number, String],
      default: 150,
    },
    capturePointer: {
      type: Boolean,
      default: true,
    },
  },
  setup: (props, { expose }) => {
    const canvas = ref<HTMLCanvasElement | null>(null)

    let ctx: CanvasRenderingContext2D | null = null

    let rect: DOMRect | null = null

    let active = false

    const handlePointerdown = (e: PointerEvent): void => {
      props.capturePointer && canvas.value?.setPointerCapture(e.pointerId)
    }

    const handlePointup = (e: PointerEvent): void => {
      props.capturePointer && canvas.value?.releasePointerCapture(e.pointerId)
    }

    const handleMousedown = (e: MouseEvent): void => {
      active = true

      ctx?.moveTo(e.clientX - (rect?.x ?? 0), e.clientY - (rect?.y ?? 0))
    }

    const handleMousemove = (e: MouseEvent): void => {
      if (!active) return

      ctx?.lineTo(e.clientX - (rect?.x ?? 0), e.clientY - (rect?.y ?? 0))
      ctx?.stroke()
    }

    const handleMouseup = (): void => {
      active = false

      ctx?.stroke()
    }

    const generateDataURL = (type?: string, encoderOptions?: number): string | null => {
      return canvas.value?.toDataURL(type, encoderOptions) ?? null
    }

    const generateBlob = (callback: (blob: Blob | null) => void, type?: string, quality?: number): void => {
      return canvas.value?.toBlob(callback, type, quality)
    }

    const generateStream = (frameRequestRate?: number): MediaStream | null => {
      return canvas.value?.captureStream(frameRequestRate) ?? null
    }

    onMounted(() => {
      ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D

      rect = canvas.value?.getBoundingClientRect() as DOMRect
    })

    onUnmounted(() => {
      ctx = null

      rect = null
    })

    expose({
      canvas,
      generateDataURL,
      generateBlob,
      generateStream,
    })

    return () => (
      <>
        <canvas
          ref={canvas}
          width={props.width}
          height={props.height}
          style={{
            display: 'block',
            border: '1px solid #ccc',
            borderRadius: 10,
            width: normalizeCSSValue(props.width),
            height: normalizeCSSValue(props.height),
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
        ></canvas>
      </>
    )
  },
})

export default WritingBoard
