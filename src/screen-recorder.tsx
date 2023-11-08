import { defineComponent, ref, shallowRef, type CSSProperties, type PropType } from 'vue'

const ScreenRecorder = /* #__PURE__ */ defineComponent({
  name: 'ScreenRecorder',
  inheritAttrs: false,
  props: {
    width: {
      type: [Number, String],
      default: 800,
    },
    height: {
      type: [Number, String],
      default: 600,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    controlsList: {
      type: String,
      default: '',
    },
    crossorigin: {
      type: String as PropType<'' | 'anonymous' | 'use-credentials'>,
      default: '',
    },
    disablepictureinpicture: {
      type: Boolean,
      default: true,
    },
    disableremoteplayback: {
      type: Boolean,
      default: true,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    muted: {
      type: Boolean,
      default: true,
    },
    playsinline: {
      type: Boolean,
      default: true,
    },
    poster: {
      type: String,
      default: '',
    },
    preload: {
      type: String as PropType<'' | 'none' | 'metadata' | 'auto'>,
      default: 'metadata',
    },
    classes: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => [],
    },
    styles: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    options: {
      type: Object as PropType<DisplayMediaStreamOptions>,
      default: () => ({
        audio: true,
        video: true,
      }),
    },
    initOnClick: {
      type: Boolean,
      default: true,
    },
    playOnInit: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    play: null,
    pause: null,
  },
  setup: (props, { emit, expose }) => {
    const isSupported = 'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices

    const video = ref<HTMLVideoElement | null>(null)

    const stream = shallowRef<MediaStream | null>(null)

    const init = async (): Promise<void> => {
      if (video.value == null || stream.value != null) return

      try {
        stream.value = await navigator.mediaDevices.getDisplayMedia(props.options)

        video.value.srcObject = stream.value

        if (props.playOnInit) {
          await play()
        }
      } catch (error) {
        reportError(error)
      }
    }

    const close = (): void => {
      if (video.value == null || stream.value == null) return

      pause()
      stream.value.getTracks().forEach((track) => {
        track.stop()
      })
      stream.value = null
      video.value.srcObject = null
    }

    const play = async (): Promise<void> => {
      if (video.value == null || stream.value == null) return

      await video.value.play()
    }

    const pause = (): void => {
      if (video.value == null || stream.value == null) return

      video.value.pause()
    }

    const handleClick = (): void => {
      if (props.initOnClick) {
        void init()
      }
    }

    expose({
      isSupported,
      video,
      stream,
      init,
      close,
      play,
      pause,
    })

    return () => (
      <>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          {...props}
          ref={video}
          class={Array.isArray(props.classes) ? props.classes.join(' ') : props.classes}
          style={Object.entries(props.styles).reduce((styles, style) => styles + `${style[0]}:${style[1]};`, '')}
          onClick={handleClick}
          onPlay={() => {
            emit('play')
          }}
          onPause={() => {
            emit('pause')
          }}
        ></video>
      </>
    )
  },
})

export default ScreenRecorder
