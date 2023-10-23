import { defineComponent, onMounted, onUnmounted, ref, type PropType } from 'vue'

const AudioPlayer = /* #__PURE__ */ defineComponent({
  name: 'AudioPlayer',
  inheritAttrs: false,
  props: {
    source: {
      type: String,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 300,
    },
    height: {
      type: [Number, String],
      default: 300,
    },
    color: {
      type: [String, Object] as PropType<string | CanvasGradient | Record<number, string>>,
      default: 'rgba(255,255,255,.5)',
    },
    gradient: {
      type: String as PropType<'conic' | 'linear' | 'radial'>,
      default: 'linear',
    },
  },
  setup: (props, { expose }) => {
    const canvas = ref<HTMLCanvasElement | null>(null)

    const audio = ref<HTMLAudioElement | null>(null)

    let context: AudioContext

    const transformColor = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string | CanvasGradient | Record<number, string>): string | CanvasGradient => {
      if (typeof color === 'object' && !(color instanceof CanvasGradient)) {
        let gradient: CanvasGradient

        switch (props.gradient) {
          case 'linear':
            gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            break
          case 'conic':
            gradient = ctx.createConicGradient(0, canvas.width / 2, canvas.height / 2)
            break
          case 'radial':
            gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height))
            break
        }

        Object.entries(color).forEach(([k, v]) => {
          gradient.addColorStop(parseInt(k), v)
        })

        color = gradient
      }

      return color
    }

    onMounted(() => {
      if (canvas.value == null || audio.value == null) {
        return
      }

      context = new AudioContext()

      const analyser = new AnalyserNode(context, {
        fftSize: 512,
      })

      const source = new MediaElementAudioSourceNode(context, {
        mediaElement: audio.value,
      })

      source.connect(analyser)
      analyser.connect(context.destination)

      const width = canvas.value.width
      const height = canvas.value.height
      const ctx = canvas.value.getContext('2d')
      if (ctx == null) {
        return
      }
      ctx.fillStyle = transformColor(canvas.value, ctx, props.color)

      const data = new Uint8Array(analyser.frequencyBinCount)

      const meterWidth = 5
      const meterGap = 2
      const meterMinHeight = 2
      const meterNum = width / (meterWidth + meterGap)
      const meterStep = Math.round(data.length / meterNum)

      const render = (): void => {
        analyser.getByteFrequencyData(data)

        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < meterNum; ++i) {
          ctx.fillRect(i * (meterWidth + meterGap), height - data[i * meterStep] + meterMinHeight, meterWidth, height)
        }

        window.requestAnimationFrame(render)
      }

      render()
    })

    onUnmounted(() => {
      void context.close()
    })

    expose({
      canvas,
      audio,
    })

    return () => (
      <>
        <div role="article">
          <canvas ref={canvas} width={props.width} height={props.height}></canvas>
          <audio ref={audio} src={props.source} controls autoplay loop>
            <track default kind="captions" />
          </audio>
        </div>
      </>
    )
  },
})

export default AudioPlayer
