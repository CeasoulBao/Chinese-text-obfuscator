# Consistent Dictionary Choices, IME, and Vertical Opacity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Keep dictionary candidate choices consistent within each input, preserve Chinese IME composition, and expose vertical-line opacity.

**Architecture:** The pure dictionary transform caches candidate choices for one invocation. The editor uses stable row keys, while the existing image configuration gains one missing UI control.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library

---

### Task 1: Cache one replacement per source phrase

**Files:**
- Modify: `src/obfuscation/transforms/dictionary.ts`
- Modify: `src/obfuscation/transforms/transforms.test.ts`

**Steps:**
1. Write a failing test asserting all replaced occurrences use one candidate.
2. Implement a per-invocation candidate map.
3. Run the focused tests.
4. Commit with `fix: keep dictionary replacements consistent per input`.

### Task 2: Preserve Chinese IME composition

**Files:**
- Modify: `src/components/DictionaryEditor.tsx`
- Modify: `src/App.test.tsx`

**Steps:**
1. Write a regression test that retains the same source input node through Chinese composition events.
2. Replace the editable-content key with stable row identity.
3. Run the focused test.
4. Commit with `fix: preserve dictionary input during IME composition`.

### Task 3: Add vertical-line opacity control

**Files:**
- Modify: `src/components/ImageSettings.tsx`
- Modify: `src/App.test.tsx`

**Steps:**
1. Add a component assertion for the vertical opacity control.
2. Add the bounded range input and state update.
3. Run focused tests and the production build.
4. Commit with `feat: add vertical line opacity control`.

### Task 4: Publish and verify

**Steps:**
1. Run the complete test suite.
2. Run the production build.
3. Push `main`.
4. Confirm GitHub Actions and the live Pages site.

