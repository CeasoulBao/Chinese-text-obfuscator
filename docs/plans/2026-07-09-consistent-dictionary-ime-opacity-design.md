# Consistent Dictionary Choices, IME Stability, and Vertical Opacity Design

## Consistent candidate choice

During one dictionary transformation run, each source phrase selects at most one replacement candidate. The choice is made lazily the first time an occurrence is actually replaced and is cached by source phrase until the run ends.

Intensity remains an occurrence-level decision: at intensity below 100 percent, some occurrences may remain unchanged, but every replaced occurrence uses the same cached candidate. A new input, configuration, or random seed starts a new pipeline run and may produce a different candidate.

## Chinese IME stability

Dictionary entry containers must not use editable source text as a React key. Stable row identity prevents the browser input element from being destroyed during `compositionstart`, intermediate pinyin changes, and `compositionend`.

For the current non-reorderable dictionary list, the stable array position is sufficient. Regression tests verify that the same input DOM node remains mounted while Chinese text changes.

## Vertical-line opacity

Vertical overlay configuration already contains an opacity field and the canvas renderer already consumes it. The image settings UI adds a bounded `0.1–1.0` range control matching the horizontal-line opacity control.

## Verification

- Repeated sources use one candidate throughout a transformation run.
- Seeded output remains reproducible.
- Partial intensity can preserve occurrences without changing the cached replacement.
- Chinese composition input retains the same DOM node.
- Vertical opacity is editable and passed through existing image state.

