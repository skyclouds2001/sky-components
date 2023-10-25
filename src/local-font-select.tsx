/* global FontData */
import { ElOption, ElSelect } from 'element-plus'
import { type PropType, computed, defineComponent, ref } from 'vue'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'

type SelectOptions = Parameters<Exclude<(typeof ElSelect)['setup'], undefined>>[0]

const LocalFontSelect = /* #__PURE__ */ defineComponent({
  name: 'LocalFontSelect',
  inheritAttrs: false,
  props: {
    postscriptNames: {
      type: Array as PropType<string[]>,
      default: null,
    },
    modelValue: {
      // @ts-expect-error - Local Font Access API
      type: FontData,
      required: true,
    },
    disabled: {
      type: Boolean as PropType<Exclude<SelectOptions['disabled'], undefined>>,
      default: false,
    },
    size: {
      type: String as PropType<Exclude<SelectOptions['size'], undefined>>,
      default: '',
    },
    name: {
      type: String as PropType<Exclude<SelectOptions['name'], undefined>>,
      default: 'Local Font Select',
    },
    placeholder: {
      type: String as PropType<Exclude<SelectOptions['placeholder'], undefined>>,
      default: 'Please select the font',
    },
    multiple: {
      type: Boolean as PropType<Exclude<SelectOptions['multiple'], undefined>>,
      default: false,
    },
    multipleLimit: {
      type: Number as PropType<Exclude<SelectOptions['multipleLimit'], undefined>>,
      default: 0,
    },
    effect: {
      type: String as PropType<Exclude<SelectOptions['effect'], undefined>>,
      default: 'light',
    },
    autocomplete: {
      type: String as PropType<Exclude<SelectOptions['autocomplete'], undefined>>,
      default: 'off',
    },
    filterable: {
      type: Boolean as PropType<Exclude<SelectOptions['multiple'], undefined>>,
      default: true,
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
        <ElSelect modelValue={font} onUpdate:modelValue={(value) => (font.value = value)} disabled={!isSupported && props.disabled} size={props.size} name={props.name} placeholder={props.placeholder} multiple={props.multiple} multipleLimit={props.multipleLimit} effect={props.effect} autocomplete={props.autocomplete} filterable={props.filterable} ariaLabel={props.name} onVisible-change={loadFont}>
          {fonts.value.map((font) => (
            <ElOption key={font.postscriptName} label={font.fullName} value={font} />
          ))}
        </ElSelect>
      </>
    )
  },
})

export default LocalFontSelect
