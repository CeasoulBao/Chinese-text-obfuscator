# Community Dictionaries Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Add seed-reproducible multi-candidate replacements, offline JSON dictionary pack sharing, and denser vertical image lines.

**Architecture:** The dictionary transform consumes normalized candidate arrays. A pure pack module owns parsing, validation, normalization, merging, and serialization; React components only handle file selection, feedback, and user edits.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, JSON Schema

---

### Task 1: Upgrade dictionary entries to multiple candidates

**Files:**
- Modify: `src/obfuscation/transforms/dictionary.ts`
- Modify: `src/obfuscation/transforms/transforms.test.ts`
- Modify: `src/obfuscation/registry.ts`

**Steps:**
1. Update tests to use `replacements: string[]` and verify candidate selection and seeded reproducibility.
2. Run the focused tests and confirm type or assertion failures.
3. Replace the singular replacement field with a candidate array.
4. Ignore empty candidates and preserve the original source when none remain.
5. Update default entries.
6. Run the focused tests and expect success.
7. Commit with `feat: support multiple dictionary replacements`.

### Task 2: Implement portable dictionary packs

**Files:**
- Create: `src/types/dictionaryPack.ts`
- Create: `src/dictionary/packs.ts`
- Create: `src/dictionary/packs.test.ts`

**Steps:**
1. Write failing tests for schema validation, size limits, candidate cleanup, atomic failure, merge deduplication, and serialization.
2. Run the focused tests and confirm failure.
3. Implement `parseDictionaryPack`, `mergeDictionaryEntries`, and `serializeDictionaryPack`.
4. Run the focused tests and expect success.
5. Commit with `feat: add offline dictionary pack format`.

### Task 3: Upgrade the dictionary editor and sharing controls

**Files:**
- Modify: `src/components/DictionaryEditor.tsx`
- Create: `src/components/DictionaryPackControls.tsx`
- Modify: `src/components/PipelineEditor.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`

**Steps:**
1. Add failing component tests for adding/removing candidate fields and applying a parsed pack.
2. Run the focused test and confirm failure.
3. Implement multi-candidate controls.
4. Implement local file import, metadata inputs, merge summary, and JSON export.
5. Add accessible styling for the new controls.
6. Run the focused test and expect success.
7. Commit with `feat: add dictionary import and export interface`.

### Task 4: Add community contribution assets

**Files:**
- Create: `dictionaries/example.json`
- Create: `dictionaries/schema.json`
- Create: `dictionaries/README.md`
- Create: `CONTRIBUTING.md`
- Modify: `README.md`

**Steps:**
1. Add a valid example pack.
2. Add a JSON Schema for version 1.
3. Document validation, licensing, naming, and pull-request expectations.
4. Link contribution guidance from the main README.
5. Commit with `docs: add community dictionary contribution guide`.

### Task 5: Increase vertical overlay density

**Files:**
- Modify: `src/components/ImageSettings.tsx`
- Modify: `src/image/render.ts`
- Modify: `src/App.test.tsx`

**Steps:**
1. Add a component assertion for the 12-pixel minimum and displayed density value.
2. Update the slider minimum and renderer safety clamp to 12 pixels.
3. Add a qualitative density hint.
4. Run the focused test and expect success.
5. Commit with `feat: support denser vertical image lines`.

### Task 6: Final verification

**Files:**
- Modify only if verification identifies a defect.

**Steps:**
1. Run `npm run test:run`; expect all tests to pass.
2. Run `npm run build`; expect a successful production build.
3. Verify multi-candidate output, import merge behavior, export JSON, and dense vertical preview in the browser.
4. Confirm `git status --short` is clean.

