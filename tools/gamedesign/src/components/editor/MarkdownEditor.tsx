import MDEditor from '@uiw/react-md-editor'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export default function MarkdownEditor({ value, onChange, height = 600 }: MarkdownEditorProps) {
  return (
    <div data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="live"
        hideToolbar={false}
        enableScroll={true}
      />
    </div>
  )
}
