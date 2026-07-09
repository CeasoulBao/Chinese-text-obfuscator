import type { DictionaryEntry } from '../obfuscation/transforms/dictionary'

export interface DictionaryPackMetadata {
  name: string
  description: string
  author: string
  license: string
}

export interface DictionaryPack extends DictionaryPackMetadata {
  schemaVersion: 1
  entries: DictionaryEntry[]
}

export interface DictionaryMergeResult {
  entries: DictionaryEntry[]
  addedSources: number
  mergedSources: number
  addedCandidates: number
}
