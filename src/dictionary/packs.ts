import type { DictionaryEntry } from '../obfuscation/transforms/dictionary'
import type {
  DictionaryMergeResult,
  DictionaryPack,
  DictionaryPackMetadata,
} from '../types/dictionaryPack'

export const MAX_DICTIONARY_PACK_BYTES = 1_000_000
const MAX_ENTRIES = 5000
const MAX_FIELD_LENGTH = 500

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cleanText(value: unknown, maximum = MAX_FIELD_LENGTH): string {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : ''
}

function uniqueNonEmpty(values: unknown): string[] {
  if (!Array.isArray(values)) return []
  const result: string[] = []
  for (const value of values) {
    const cleaned = cleanText(value)
    if (cleaned && !result.includes(cleaned)) result.push(cleaned)
  }
  return result
}

export function normalizeDictionaryEntries(values: unknown): DictionaryEntry[] {
  if (!Array.isArray(values)) return []
  const result: DictionaryEntry[] = []

  for (const value of values.slice(0, MAX_ENTRIES)) {
    if (!isRecord(value)) continue
    const source = cleanText(value.source)
    const replacements = uniqueNonEmpty(value.replacements)
    if (!source || replacements.length === 0) continue

    const existing = result.find((entry) => entry.source === source)
    if (existing) {
      existing.replacements = [...new Set([...existing.replacements, ...replacements])]
    } else {
      result.push({ source, replacements })
    }
  }
  return result
}

export function parseDictionaryPack(json: string): DictionaryPack {
  if (new TextEncoder().encode(json).byteLength > MAX_DICTIONARY_PACK_BYTES) {
    throw new Error('词典文件过大，最大允许 1 MB')
  }

  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    throw new Error('词典文件不是有效的 JSON')
  }
  if (!isRecord(value)) throw new Error('词典文件必须是 JSON 对象')
  if (value.schemaVersion !== 1) throw new Error('不支持该词典格式版本')

  const name = cleanText(value.name, 100)
  if (!name) throw new Error('词典名称不能为空')
  if (!Array.isArray(value.entries)) throw new Error('词典 entries 必须是数组')

  return {
    schemaVersion: 1,
    name,
    description: cleanText(value.description, 500),
    author: cleanText(value.author, 100),
    license: cleanText(value.license, 100),
    entries: normalizeDictionaryEntries(value.entries),
  }
}

export function mergeDictionaryEntries(
  current: readonly DictionaryEntry[],
  incoming: readonly DictionaryEntry[],
): DictionaryMergeResult {
  const entries = structuredClone(normalizeDictionaryEntries(current))
  let addedSources = 0
  let mergedSources = 0
  let addedCandidates = 0

  for (const entry of normalizeDictionaryEntries(incoming)) {
    const existing = entries.find((candidate) => candidate.source === entry.source)
    if (!existing) {
      entries.push(structuredClone(entry))
      addedSources += 1
      addedCandidates += entry.replacements.length
      continue
    }

    let changed = false
    for (const replacement of entry.replacements) {
      if (!existing.replacements.includes(replacement)) {
        existing.replacements.push(replacement)
        addedCandidates += 1
        changed = true
      }
    }
    if (changed) mergedSources += 1
  }

  return { entries, addedSources, mergedSources, addedCandidates }
}

export function serializeDictionaryPack(
  metadata: DictionaryPackMetadata,
  entries: readonly DictionaryEntry[],
): string {
  const pack: DictionaryPack = {
    schemaVersion: 1,
    name: metadata.name.trim() || '未命名词典',
    description: metadata.description.trim(),
    author: metadata.author.trim(),
    license: metadata.license.trim(),
    entries: normalizeDictionaryEntries(entries),
  }
  return `${JSON.stringify(pack, null, 2)}\n`
}
