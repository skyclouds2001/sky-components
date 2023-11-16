import { ElTreeSelect } from 'element-plus'
import 'element-plus/es/components/tree-select/style/css'
import { computed, defineComponent, ref, type PropType } from 'vue'

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
      type: [FileSystemFileHandle, null] as PropType<FileSystemFileHandle | null>,
      required: true,
    },
  },
  emits: {
    'update:modelValue': (handle: FileSystemFileHandle | null) => handle,
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
      const traverse = async (files: Data[], handle: FileSystemDirectoryHandle): Promise<void> => {
        // @ts-expect-error - File System Access API
        for await (const [key, value] of handle.entries()) {
          console.log(key, value)
          if (value.kind === 'directory') {
            files.push({
              label: key,
              value: value as FileSystemDirectoryHandle,
              children: [],
            })
            // @ts-expect-error - resolve way
            await traverse(files.find((v) => v.label === key).children, value)
          }
          if (value.kind === 'file') {
            files.push({
              label: key,
              value: value as FileSystemFileHandle,
            })
          }
        }
      }

      // @ts-expect-error - File System Access API
      const handle = await window.showDirectoryPicker()

      void traverse(files.value, handle)
    }

    let loaded = false

    const handleVisibleChange = (visible: boolean): void => {
      if (visible && !loaded) {
        void loadFile().then(() => (loaded = true))
      }
    }

    expose({
      isSupported,
      file,
      files,
      loadFile,
    })

    return () => (
      <>
        <ElTreeSelect modelValue={file} data={files.value} onUpdate:modelValue={(value: FileSystemFileHandle) => (file.value = value)} disabled={!isSupported} valueKey="name" onVisibleChange={handleVisibleChange} />
      </>
    )
  },
})

export default FileSystemTreeSelect
