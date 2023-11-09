import { defineComponent, ref, shallowRef, type CSSProperties, type PropType } from 'vue'

const CameraRecorder = /* #__PURE__ */ defineComponent({
  name: 'CameraRecorder',
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
    mediaOptions: {
      type: Object as PropType<DisplayMediaStreamOptions>,
      default: () => ({
        audio: true,
        video: true,
      }),
    },
    recorderOptions: {
      type: Object as PropType<MediaRecorderOptions>,
      default: () => ({}),
    },
    downloadOptions: {
      type: [Object, Function] as PropType<Partial<Record<'filename' | 'filetype', string>> | ((data: Blob) => void)>,
      default: () => ({}),
    },
    initOnClick: {
      type: Boolean,
      default: true,
    },
    playOnInit: {
      type: Boolean,
      default: true,
    },
    thrownIfError: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    play: null,
    pause: null,
  },
  setup: (props, { emit, expose }) => {
    const isSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices

    const video = ref<HTMLVideoElement | null>(null)

    const stream = shallowRef<MediaStream | null>(null)

    const recorder = shallowRef<MediaRecorder | null>(null)

    const init = async (): Promise<void> => {
      if (video.value == null || stream.value != null) return

      try {
        stream.value = await navigator.mediaDevices.getUserMedia(props.mediaOptions)

        video.value.srcObject = stream.value

        recorder.value = new MediaRecorder(stream.value, props.recorderOptions)

        recorder.value.addEventListener(
          'dataavailable',
          (e) => {
            if (typeof props.downloadOptions === 'function') {
              props.downloadOptions(e.data)
              return
            }

            const { filename = 'media', filetype = 'video/mp4' } = props.downloadOptions

            const blob = new Blob([e.data], {
              type: filetype,
            })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.target = '_blank'
            a.style.display = 'none'
            document.documentElement.appendChild(a)
            a.click()
            document.documentElement.removeChild(a)

            URL.revokeObjectURL(url)
          },
          {
            passive: true,
          }
        )

        if (props.playOnInit) {
          await play()
        }
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
    }

    const close = (): void => {
      if (video.value == null || stream.value == null) return

      stream.value.getTracks().forEach((track) => {
        track.stop()
      })
      stream.value = null

      video.value.srcObject = null

      recorder.value?.stop()
      recorder.value = null
    }

    const play = async (): Promise<void> => {
      if (video.value == null || stream.value == null) return

      try {
        await video.value.play()
        switch (recorder.value?.state) {
          case 'inactive':
            recorder.value?.start()
            break
          case 'paused':
            recorder.value?.resume()
            break
        }
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
    }

    const pause = (): void => {
      if (video.value == null || stream.value == null) return

      try {
        video.value.pause()
        recorder.value?.pause()
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
    }

    const enterFullscreen = async (): Promise<void> => {
      if (video.value == null || stream.value == null || document.fullscreenElement === video.value) return

      try {
        await video.value.requestFullscreen()
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
    }

    const exitFullscreen = async (): Promise<void> => {
      if (video.value == null || stream.value == null || document.fullscreenElement !== video.value) return

      try {
        await document.exitFullscreen()
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
    }

    const enterPictureInPicture = async (): Promise<void> => {
      if (video.value == null || stream.value == null || document.pictureInPictureElement === video.value) return

      try {
        await video.value.requestPictureInPicture()
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
    }

    const exitPictureInPicture = async (): Promise<void> => {
      if (video.value == null || stream.value == null || document.pictureInPictureElement !== video.value) return

      try {
        await document.exitPictureInPicture()
      } catch (error) {
        if (props.thrownIfError) {
          throw error
        } else {
          reportError(error)
        }
      }
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
      recorder,
      init,
      close,
      play,
      pause,
      enterFullscreen,
      exitFullscreen,
      enterPictureInPicture,
      exitPictureInPicture,
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

export default CameraRecorder
