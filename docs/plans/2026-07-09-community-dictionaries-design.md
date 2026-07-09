# Community Dictionaries and Dense Vertical Lines Design

## Goal

Extend the local-only application with shareable JSON dictionary packs, multiple replacement candidates per source phrase, and denser vertical image overlays.

## Dictionary model

Each dictionary entry stores one source phrase and one or more replacement candidates:

```json
{
  "source": "中国",
  "replacements": ["印度", "东大", "老钟"]
}
```

The transformation continues to match longer source phrases first. When a match is selected by the configured intensity, it chooses one non-empty replacement candidate through the existing seeded random source. Identical text, configuration, and seed therefore reproduce identical output.

## Dictionary pack format

Portable packs use a versioned JSON envelope:

```json
{
  "schemaVersion": 1,
  "name": "示例词典",
  "description": "演示一词多替换和社区共享格式",
  "author": "Community",
  "license": "CC0-1.0",
  "entries": [
    {
      "source": "中国",
      "replacements": ["印度", "东大", "老钟"]
    }
  ]
}
```

The application accepts JSON files only, enforces a conservative file-size limit, validates required fields, discards empty candidates, and never evaluates imported content as code.

## Import and merge

Import shows the pack name and merge summary before applying changes. Applying an import:

- Matches existing entries by exact source text.
- Appends new candidates to existing entries.
- Removes duplicate candidates while preserving first-seen order.
- Adds new source entries at the end.
- Leaves current entries untouched when an imported row is invalid.

Import errors produce a clear local message and do not partially modify the active dictionary.

## Export

The user can edit pack metadata and export the active dictionary as UTF-8 JSON. Export creates a new local file through a temporary object URL. No content is uploaded.

## Editor

The dictionary editor displays each replacement candidate as an editable row or compact tag-like control. Users can:

- Add and remove source entries.
- Add, edit, and remove multiple replacement candidates.
- Import a pack.
- Export the current pack.
- See import validation or merge feedback.

Every entry must retain at least one editable candidate field in the UI, although empty candidates are ignored during transformation and export.

## Repository sharing

The repository adds:

- `dictionaries/example.json`
- `dictionaries/schema.json`
- `dictionaries/README.md`
- `CONTRIBUTING.md`

Contributors can submit dictionary packs through ordinary GitHub pull requests. The application itself remains network-free.

## Vertical overlay density

Vertical line spacing expands from `50–240px` to `12–240px`. The UI displays the current pixel spacing and a qualitative density hint. Rendering retains a lower bound of 12 pixels to avoid pathological loops or completely obscured output.

## Testing

- Dictionary transformation selects only configured candidates and remains seed-reproducible.
- Migration/default configuration supports candidate arrays.
- Pack parsing rejects malformed or oversized input.
- Merge behavior deduplicates candidates and remains atomic.
- Export removes empty candidates and produces schema version 1.
- UI tests cover adding candidates, import feedback, and export availability.
- Image settings tests cover the new 12-pixel minimum.

