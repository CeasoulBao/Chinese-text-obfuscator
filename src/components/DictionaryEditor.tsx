import type { DictionaryEntry } from '../obfuscation/transforms/dictionary'
import { DictionaryPackControls } from './DictionaryPackControls'

interface DictionaryEditorProps {
  entries: DictionaryEntry[]
  onChange(entries: DictionaryEntry[]): void
}

export function DictionaryEditor({ entries, onChange }: DictionaryEditorProps) {
  const updateSource = (entryIndex: number, source: string) => {
    onChange(
      entries.map((entry, index) => (index === entryIndex ? { ...entry, source } : entry)),
    )
  }

  const updateCandidate = (entryIndex: number, candidateIndex: number, value: string) => {
    onChange(
      entries.map((entry, index) =>
        index === entryIndex
          ? {
              ...entry,
              replacements: entry.replacements.map((candidate, replacementIndex) =>
                replacementIndex === candidateIndex ? value : candidate,
              ),
            }
          : entry,
      ),
    )
  }

  const removeCandidate = (entryIndex: number, candidateIndex: number) => {
    onChange(
      entries.map((entry, index) => {
        if (index !== entryIndex) return entry
        const replacements = entry.replacements.filter(
          (_, replacementIndex) => replacementIndex !== candidateIndex,
        )
        return { ...entry, replacements: replacements.length ? replacements : [''] }
      }),
    )
  }

  return (
    <div className="dictionary-editor">
      <div className="dictionary-editor__heading">
        <div>
          <strong>共享词典</strong>
          <span>一个原词可以随机对应多个候选词</span>
        </div>
        <span>{entries.length} 个原词</span>
      </div>

      {entries.map((entry, entryIndex) => (
        <article className="dictionary-entry" key={entryIndex}>
          <div className="dictionary-source-row">
            <label htmlFor={`dictionary-source-${entryIndex}`}>
              原词 {String(entryIndex + 1).padStart(2, '0')}
            </label>
            <input
              id={`dictionary-source-${entryIndex}`}
              aria-label={`第 ${entryIndex + 1} 条原词`}
              value={entry.source}
              onChange={(event) => updateSource(entryIndex, event.target.value)}
            />
            <button
              type="button"
              aria-label={`删除第 ${entryIndex + 1} 条词典规则`}
              onClick={() => onChange(entries.filter((_, index) => index !== entryIndex))}
            >
              删除
            </button>
          </div>
          <div className="candidate-list">
            {entry.replacements.map((candidate, candidateIndex) => (
              <div className="candidate-row" key={candidateIndex}>
                <label htmlFor={`dictionary-candidate-${entryIndex}-${candidateIndex}`}>
                  候选 {candidateIndex + 1}
                </label>
                <input
                  id={`dictionary-candidate-${entryIndex}-${candidateIndex}`}
                  aria-label={`第 ${entryIndex + 1} 条第 ${candidateIndex + 1} 个候选词`}
                  value={candidate}
                  onChange={(event) =>
                    updateCandidate(entryIndex, candidateIndex, event.target.value)
                  }
                />
                <button
                  type="button"
                  aria-label={`删除第 ${entryIndex + 1} 条的候选词 ${candidateIndex + 1}`}
                  onClick={() => removeCandidate(entryIndex, candidateIndex)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="add-candidate"
              type="button"
              onClick={() =>
                onChange(
                  entries.map((candidateEntry, index) =>
                    index === entryIndex
                      ? {
                          ...candidateEntry,
                          replacements: [...candidateEntry.replacements, ''],
                        }
                      : candidateEntry,
                  ),
                )
              }
            >
              ＋ 添加候选词
            </button>
          </div>
        </article>
      ))}

      <button
        className="add-rule"
        type="button"
        onClick={() => onChange([...entries, { source: '', replacements: [''] }])}
      >
        ＋ 添加原词
      </button>

      <DictionaryPackControls entries={entries} onChange={onChange} />
    </div>
  )
}
