import { ElTreeSelect } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'
import 'element-plus/es/components/tree-select/style/css'

type Data =
  | {
      label: string
      value: FileSystemFileHandle
    }
  | {
      label: string
      value: FileSystemDirectoryHandle
      children: Data[]
    }

const FileSystemTreeSelect = /* #__PURE__ */ defineComponent({
  name: 'FileSystemTreeSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: FileSystemFileHandle,
      required: true,
    },
  },
  emits: {
    'update:modelValue': (handle: FileSystemFileHandle) => handle,
  },
  setup: (props, { emit, expose }) => {
    const isSupported = 'showDirectoryPicker' in window

    const file = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })

    const files = ref<Data[]>([])

    const loadFile = async (): Promise<void> => {
      if (!isSupported) {
        console.error('Current Browser does not support for File System Access API')
      }

      const traverse = async (handle: FileSystemDirectoryHandle): Promise<Data> => {
        const children: Data[] = []

        // @ts-expect-error - File System Access API
        for await (const [, value] of handle) {
          if (value.kind === 'directory') {
            children.push(await traverse(value as FileSystemDirectoryHandle))
          }
          if (value.kind === 'file') {
            children.push({
              label: value.name,
              value: value as FileSystemFileHandle,
            })
          }
        }

        return {
          label: handle.name,
          value: handle,
          children,
        }
      }

      // @ts-expect-error - File System Access API
      const handle = await window.showDirectoryPicker()

      files.value.push(await traverse(handle))
    }

    expose({
      isSupported,
      file,
      files,
      loadFile,
    })

    return () => (
      <>
        <ElTreeSelect modelValue={file} onUpdate:modelValue={(value: FileSystemFileHandle) => (file.value = value)} disabled={!isSupported} valueKey="name" onVisibleChange={loadFile} />
      </>
    )
  },
})

export default FileSystemTreeSelect
