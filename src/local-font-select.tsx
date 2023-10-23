/* global FontData */
import { ElOption, ElSelect } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'

const LocalFontSelect = /* #__PURE__ */ defineComponent({
  name: 'LocalFontSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      // @ts-expect-error - Local Font Access API
      type: FontData,
      required: true,
    },
    name: {
      type: String,
      default: 'Local Font Select',
    },
    placeholder: {
      type: String,
      default: 'Please select the font',
    },
    postscriptNames: {
      type: Boolean,
      default: null,
    },
  },
  emits: {
    // @ts-expect-error - Local Font Access API
    'update:modelValue': (font: FontData) => font,
  },
  setup: (props, { emit, expose }) => {
    const isSupported = 'queryLocalFonts' in window

    const font = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })

    // @ts-expect-error - Local Font Access API
    // eslint-disable-next-line no-undef
    const fonts = ref<FontData[]>([])

    const loadFont = async (): Promise<void> => {
      if (!isSupported) {
        console.error('Current Browser does not support for Local Font Access API')
      }

      const options =
        props.postscriptNames != null
          ? {
              postscriptNames: props.postscriptNames,
            }
          : {}

      // @ts-expect-error - Local Font Access API
      const data = await window.queryLocalFonts(options)

      fonts.value = data
    }

    expose({
      isSupported,
      font,
      fonts,
      loadFont,
    })

    return () => (
      <>
        <ElSelect modelValue={font} onUpdate:modelValue={(value) => (font.value = value)} disabled={!isSupported} name={props.name} placeholder={props.placeholder} ariaLabel={props.name} onVisible-change={loadFont}>
          {fonts.value.map((font) => (
            <ElOption key={font.postscriptName} label={font.fullName} value={font} />
          ))}
        </ElSelect>
      </>
    )
  },
})

export default LocalFontSelect
