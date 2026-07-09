# Text Obfuscator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Build a private, browser-only, modular text obfuscator with configurable transformations and long-image or split-image PNG export.

**Architecture:** A React single-page application keeps all content in memory. Pure TypeScript modules implement a seeded transformation pipeline and canvas layout/export, while React components configure and preview both workflows.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, HTML Canvas, CSS

---

### Task 1: Scaffold the static application

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`

**Steps:**
1. Create a Vite React TypeScript package with scripts for `dev`, `build`, `test`, and `test:run`.
2. Configure the base URL as `./` so the artifact works from GitHub Pages project paths.
3. Add Vitest with a jsdom environment and Testing Library cleanup.
4. Render a minimal application shell.
5. Run `npm install`.
6. Run `npm run build`; expect a successful production build.
7. Commit with `chore: scaffold React application`.

### Task 2: Implement deterministic pipeline primitives

**Files:**
- Create: `src/types/obfuscation.ts`
- Create: `src/obfuscation/random.ts`
- Create: `src/obfuscation/pipeline.ts`
- Create: `src/obfuscation/pipeline.test.ts`

**Steps:**
1. Write failing tests proving disabled modules are skipped, enabled modules run in order, intensity is clamped to `0..1`, and equal seeds reproduce equal output.
2. Run `npm test -- --run src/obfuscation/pipeline.test.ts`; expect failures for missing modules.
3. Define `TransformContext`, `TransformModule`, `PipelineItem`, and `PipelineResult`.
4. Implement a small deterministic string-seeded PRNG and `clampIntensity`.
5. Implement sequential `runPipeline(text, items, seed)`.
6. Re-run the focused test; expect all tests to pass.
7. Commit with `feat: add deterministic transformation pipeline`.

### Task 3: Add built-in text transformations

**Files:**
- Create: `src/obfuscation/transforms/dictionary.ts`
- Create: `src/obfuscation/transforms/similarChars.ts`
- Create: `src/obfuscation/transforms/shuffle.ts`
- Create: `src/obfuscation/transforms/symbols.ts`
- Create: `src/obfuscation/registry.ts`
- Create: `src/obfuscation/transforms/transforms.test.ts`

**Steps:**
1. Write failing tests for longest-first dictionary matching, conservative similar-character replacement, punctuation-preserving shuffle, and symbol insertion without leading or trailing symbols.
2. Run the focused test; expect failures for missing transforms.
3. Implement each transform as a pure module using only its context and seeded random source.
4. Register module metadata, default configuration, and stable IDs.
5. Re-run the focused test; expect all tests to pass.
6. Commit with `feat: add configurable text transforms`.

### Task 4: Add presets and reducer-managed application state

**Files:**
- Create: `src/state/appState.ts`
- Create: `src/state/appState.test.ts`
- Create: `src/obfuscation/presets.ts`

**Steps:**
1. Write failing tests for light, medium, and heavy presets; custom edits; module reordering; reset; and source clearing.
2. Run the focused test; expect failure.
3. Implement immutable state, reducer actions, preset values, and derived custom-preset behavior.
4. Re-run the focused test; expect all tests to pass.
5. Commit with `feat: add presets and application state`.

### Task 5: Implement image layout and page splitting

**Files:**
- Create: `src/types/image.ts`
- Create: `src/image/layout.ts`
- Create: `src/image/layout.test.ts`
- Create: `src/image/render.ts`
- Create: `src/image/export.ts`

**Steps:**
1. Write failing tests for Chinese character wrapping, explicit newlines, page-height calculation, safe canvas limits, and split-image numbering.
2. Run the focused test; expect failure.
3. Implement width-aware text wrapping through an injected text-measure function so unit tests do not depend on real canvas fonts.
4. Implement canvas rendering for backgrounds, text, horizontal and vertical overlays, dots, and seeded character jitter.
5. Implement long-image safety checks and split-page rendering.
6. Implement PNG blob creation, temporary object URL download, and URL revocation.
7. Re-run the focused test; expect all tests to pass.
8. Commit with `feat: add canvas image rendering and splitting`.

### Task 6: Build the text workflow interface

**Files:**
- Create: `src/components/TextEditor.tsx`
- Create: `src/components/PresetSelector.tsx`
- Create: `src/components/PipelineEditor.tsx`
- Create: `src/components/DictionaryEditor.tsx`
- Create: `src/components/OutputPanel.tsx`
- Create: `src/components/Notice.tsx`
- Modify: `src/App.tsx`
- Create: `src/App.test.tsx`

**Steps:**
1. Write failing component tests for input, presets, module toggles, module movement, dictionary editing, result copying, clearing, and the heavy-mode warning.
2. Run the component test; expect failure.
3. Implement accessible labeled controls and live transformed preview.
4. Use explicit up/down controls for reliable keyboard-accessible ordering.
5. Add copy success and failure status messages.
6. Re-run the component test; expect all tests to pass.
7. Commit with `feat: build text obfuscation interface`.

### Task 7: Build image preview and export controls

**Files:**
- Create: `src/components/ImageSettings.tsx`
- Create: `src/components/CanvasPreview.tsx`
- Create: `src/components/ExportControls.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Steps:**
1. Write failing tests for overlay toggles, line settings, long/split export choice, disabled empty export, and canvas-limit fallback messaging.
2. Run the component test; expect failure.
3. Implement image settings with bounded numeric inputs and color controls.
4. Render a scaled live preview without changing export resolution.
5. Add long-image and split-image export actions with progress feedback.
6. Re-run the component test; expect all tests to pass.
7. Commit with `feat: add image preview and export controls`.

### Task 8: Apply the visual system and responsive layout

**Files:**
- Modify: `src/styles.css`
- Modify: `src/App.tsx`

**Steps:**
1. Build a restrained editorial interface with a warm neutral background, high-contrast typography, clear sections, and no decorative gradients.
2. Add responsive two-column desktop and single-column mobile layouts.
3. Verify focus states, minimum touch target sizes, reduced-motion behavior, overflow, and contrast.
4. Run `npm run build`; expect success.
5. Commit with `style: add responsive editorial interface`.

### Task 9: Add privacy documentation and GitHub Pages deployment

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `.github/workflows/deploy.yml`
- Create: `.gitignore`

**Steps:**
1. Document local development, build, test, and GitHub Pages deployment.
2. Document that the application does not upload or persist text.
3. Explain that transformations and image overlays do not guarantee bypassing AI, OCR, moderation, account restrictions, or metadata analysis.
4. Add an MIT license and standard Node/Vite ignores.
5. Configure the official Pages artifact deployment workflow.
6. Commit with `docs: add usage and deployment documentation`.

### Task 10: Final verification

**Files:**
- Modify as required by verification findings.

**Steps:**
1. Run `npm test -- --run`; expect all tests to pass.
2. Run `npm run build`; expect a successful production build.
3. Start the local preview and manually check Chinese input, mixed punctuation, presets, fixed-seed output, readability warnings, long-image export, and split export.
4. Inspect `git status --short`; expect no unintended files.
5. Commit any verification fixes with `fix: resolve final verification issues`.

