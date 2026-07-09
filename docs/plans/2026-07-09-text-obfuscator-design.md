# Text Obfuscator Design

## Purpose

Build a static, browser-only tool that applies configurable text transformations and can render the result as images. The project describes these operations as obfuscation, not encryption, and does not claim that they can reliably bypass platform moderation, AI classification, or OCR.

## Product shape

- React, TypeScript, and Vite single-page application.
- Deployable to GitHub Pages.
- All text processing and image rendering happen locally in the browser.
- No server, analytics, uploads, persistence, or automatic storage of source text.

## Text workflow

The user enters text and configures an ordered pipeline of built-in transformations. Each transformation can be enabled, disabled, reordered, and assigned an independent intensity.

Initial transformations:

1. Custom dictionary replacement, with editable source and replacement values.
2. Homophone or visually similar character substitution from a conservative built-in map.
3. Word or character-group shuffling that preserves paragraph boundaries and punctuation where possible.
4. Random symbol insertion using a configurable symbol set.

The application provides light, medium, heavy, and custom presets. A seeded pseudo-random generator makes the same input, configuration, and seed reproducible.

The UI always labels the result as obfuscated text. Heavy settings show a readability warning.

## Image workflow

The final transformed text can be rendered to an HTML Canvas with configurable:

- Font family and size.
- Line height and page margins.
- Foreground and background colors.
- Horizontal lines, vertical lines, noise dots, and small character-position jitter.
- Overlay color, opacity, thickness, spacing, and intensity.

Horizontal overlays can align with the visual center of text rows. Vertical overlays can run through text columns. A live preview helps the user keep the output human-readable.

Users can export:

- One PNG long image.
- A numbered set of PNG images split at a configurable target height.

Generated images do not inherit EXIF metadata because they are newly rendered canvas output.

## Architecture

- `src/obfuscation`: transformation contracts, registry, presets, seeded random source, and transformation implementations.
- `src/image`: text layout, canvas rendering, overlays, long-image export, and page splitting.
- `src/components`: input, pipeline controls, preset controls, preview, image settings, export controls, warnings, and status feedback.
- `src/state`: application state and reducer.
- `src/types`: shared configuration and result types.

Every transformation implements one small interface and receives text, module configuration, and a random source. The registry supplies metadata and the implementation, allowing the UI to remain independent of transformation details.

## Data flow

1. Source text remains in in-memory React state.
2. The ordered enabled modules run sequentially.
3. The transformed result updates the text preview.
4. Image settings feed the transformed result into the canvas renderer.
5. Export creates temporary browser object URLs and revokes them after use.
6. Clear resets source, result, preview canvas, and temporary resources.

## Failure handling

- Empty input disables transformation and export actions.
- Excessive input length displays a performance warning.
- Canvas dimensions are checked against conservative browser limits.
- Long-image rendering falls back to split images when a single canvas would be unsafe.
- Invalid colors, numeric ranges, dictionary rows, and seeds receive inline validation.
- Image export failures produce an actionable message without losing source text.

## Testing

- Unit tests cover transformation order, enable/disable behavior, intensity boundaries, dictionary replacement, punctuation preservation, and seeded reproducibility.
- Image tests cover text wrapping, page-height calculation, split boundaries, and export naming.
- Component tests cover presets, custom mode, warnings, clearing, and accessibility labels.
- A production build verifies the GitHub Pages artifact.
- Manual checks cover Chinese text, mixed punctuation, emoji, long paragraphs, long-image export, and split-image export.

## Safety and documentation

The README explains that simple substitutions, inserted symbols, shuffling, and image overlays may be normalized or reversed by modern systems. It makes no guarantee of avoiding recognition, moderation, account restrictions, or metadata analysis. Users are advised that the platform may still observe sender, recipient, timing, device, and social-graph information.

