import type { DictionaryEntry } from '../obfuscation/transforms/dictionary'

interface DictionaryEditorProps {
  entries: DictionaryEntry[]
  onChange(entries: DictionaryEntry[]): void
}

export function DictionaryEditor({ entries, onChange }: DictionaryEditorProps) {
  const update = (index: number, key: keyof DictionaryEntry, value: string) => {
    onChange(
      entries.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [key]: value } : entry,
      ),
    )
  }

  return (
    <div className="dictionary-editor">
      <div className="dictionary-labels" aria-hidden="true">
        <span>原词</span>
        <span>替换为</span>
      </div>
      {entries.map((entry, index) => (
        <div className="dictionary-row" key={`${index}-${entry.source}`}>
          <label className="sr-only" htmlFor={`dictionary-source-${index}`}>
            第 {index + 1} 条原词
          </label>
          <input
            id={`dictionary-source-${index}`}
            value={entry.source}
            onChange={(event) => update(index, 'source', event.target.value)}
          />
          <span aria-hidden="true">→</span>
          <label className="sr-only" htmlFor={`dictionary-replacement-${index}`}>
            第 {index + 1} 条替换文字
          </label>
          <input
            id={`dictionary-replacement-${index}`}
            value={entry.replacement}
            onChange={(event) => update(index, 'replacement', event.target.value)}
          />
          <button
            type="button"
            aria-label={`删除第 ${index + 1} 条词典规则`}
            onClick={() => onChange(entries.filter((_, entryIndex) => entryIndex !== index))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="add-rule"
        type="button"
        onClick={() => onChange([...entries, { source: '', replacement: '' }])}
      >
        ＋ 添加规则
      </button>
    </div>
  )
}
