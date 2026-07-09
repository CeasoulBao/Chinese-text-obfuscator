# Split Workspace Tabs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Reorganize the application into a fixed left text workspace and an independently scrolling, tabbed right settings column.

**Architecture:** App owns the active settings tab while a small accessible tab component handles keyboard behavior. Both settings panels remain mounted, and CSS creates independent desktop overflow regions with a mobile document-flow fallback.

**Tech Stack:** React 19, TypeScript, CSS Grid/Flexbox, Testing Library, Vitest

---

### Task 1: Add accessible settings tabs

**Files:**
- Create: `src/components/SettingsTabs.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Steps:**
1. Add failing tests for the default text tab, image-tab activation, and arrow-key switching.
2. Implement the tab list and keyboard behavior.
3. Keep both panels mounted and use the `hidden` attribute for the inactive panel.
4. Run the focused tests and expect success.
5. Commit with `feat: add tabbed settings workspace`.

### Task 2: Build the fixed split workspace

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/OutputPanel.tsx`
- Modify: `src/styles.css`

**Steps:**
1. Group input and output into a left text column.
2. Group tab bar and panels into a right settings column.
3. Give both textareas equal flexible height and independent vertical scrolling.
4. Give each settings panel independent vertical scrolling.
5. Add the mobile stacked fallback below 900 pixels.
6. Run the production build.
7. Commit with `style: add fixed split workspace layout`.

### Task 3: Finish pending community and density work

**Files:**
- Create: `dictionaries/example.json`
- Create: `dictionaries/schema.json`
- Create: `dictionaries/README.md`
- Create: `CONTRIBUTING.md`
- Modify: `README.md`
- Modify: `src/components/ImageSettings.tsx`
- Modify: `src/image/render.ts`
- Modify: `src/App.test.tsx`

**Steps:**
1. Add the community dictionary example, schema, and contribution documentation.
2. Lower the vertical spacing minimum and renderer clamp to 12 pixels.
3. Display the current spacing and density hint.
4. Run focused tests.
5. Commit documentation and density changes separately.

### Task 4: Final verification

**Files:**
- Modify only for verified defects.

**Steps:**
1. Run the complete test suite.
2. Run the production build.
3. Verify both desktop columns, independent scrolling, tabs, long text, dictionary editing, and dense line preview in the browser.
4. Verify the mobile stacked layout.
5. Confirm a clean Git worktree.

