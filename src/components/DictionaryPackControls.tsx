import { useState } from 'react'
import {
  MAX_DICTIONARY_PACK_BYTES,
  mergeDictionaryEntries,
  parseDictionaryPack,
  serializeDictionaryPack,
} from '../dictionary/packs'
import type { DictionaryEntry } from '../obfuscation/transforms/dictionary'
import type {
  DictionaryPack,
  DictionaryPackMetadata,
} from '../types/dictionaryPack'

interface DictionaryPackControlsProps {
  entries: DictionaryEntry[]
  onChange(entries: DictionaryEntry[]): void
}

const initialMetadata: DictionaryPackMetadata = {
  name: '我的共享词典',
  description: '',
  author: '',
  license: 'CC0-1.0',
}

export function DictionaryPackControls({
  entries,
  onChange,
}: DictionaryPackControlsProps) {
  const [metadata, setMetadata] = useState(initialMetadata)
  const [pendingPack, setPendingPack] = useState<DictionaryPack | null>(null)
  const [status, setStatus] = useState('')

  const updateMetadata = (key: keyof DictionaryPackMetadata, value: string) => {
    setMetadata((current) => ({ ...current, [key]: value }))
  }

  const importFile = async (file?: File) => {
    setPendingPack(null)
    if (!file) return
    if (file.size > MAX_DICTIONARY_PACK_BYTES) {
      setStatus('词典文件过大，最大允许 1 MB')
      return
    }
    try {
      const pack = parseDictionaryPack(await file.text())
      setPendingPack(pack)
      setStatus(`已读取“${pack.name}”：${pack.entries.length} 个有效原词`)
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : '无法读取词典文件')
    }
  }

  const applyPending = () => {
    if (!pendingPack) return
    const result = mergeDictionaryEntries(entries, pendingPack.entries)
    onChange(result.entries)
    setMetadata({
      name: pendingPack.name,
      description: pendingPack.description,
      author: pendingPack.author,
      license: pendingPack.license,
    })
    setStatus(
      `合并完成：新增 ${result.addedSources} 个原词、${result.addedCandidates} 个候选词`,
    )
    setPendingPack(null)
  }

  const exportPack = () => {
    const blob = new Blob([serializeDictionaryPack(metadata, entries)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    try {
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${metadata.name.trim() || 'dictionary-pack'}.json`
      anchor.click()
      setStatus('词典包已生成')
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 0)
    }
  }

  return (
    <section className="pack-controls" aria-labelledby="pack-controls-title">
      <div className="pack-controls__title">
        <div>
          <strong id="pack-controls-title">导入 / 导出词典包</strong>
          <span>JSON · 完全本地处理</span>
        </div>
        <label className="file-button">
          导入 JSON
          <input
            aria-label="导入 JSON 词典包"
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]
              void importFile(file)
            }}
          />
        </label>
      </div>

      <div className="pack-metadata">
        <label>
          词典名称
          <input
            value={metadata.name}
            onChange={(event) => updateMetadata('name', event.target.value)}
          />
        </label>
        <label>
          作者
          <input
            value={metadata.author}
            onChange={(event) => updateMetadata('author', event.target.value)}
            placeholder="可选"
          />
        </label>
        <label>
          许可证
          <input
            value={metadata.license}
            onChange={(event) => updateMetadata('license', event.target.value)}
          />
        </label>
        <label className="pack-description">
          说明
          <input
            value={metadata.description}
            onChange={(event) => updateMetadata('description', event.target.value)}
            placeholder="词典用途与维护说明"
          />
        </label>
      </div>

      {pendingPack && (
        <div className="pending-pack">
          <span>待合并：{pendingPack.name}</span>
          <button type="button" onClick={applyPending}>
            合并这个词典
          </button>
        </div>
      )}

      <div className="pack-footer">
        <button
          className="secondary-button"
          type="button"
          onClick={exportPack}
          disabled={entries.length === 0}
        >
          导出当前词典
        </button>
        <span aria-live="polite">{status}</span>
      </div>
    </section>
  )
}
