# Split Workspace with Settings Tabs Design

## Goal

Keep source and transformed text visible together while configuration and image export occupy an independently scrolling, tabbed settings column.

## Desktop layout

At widths above 900 pixels, the work area becomes a fixed-height two-column workspace:

- Left column: approximately 42 percent of the width.
- Right column: approximately 58 percent of the width.

The left column contains two equal-height panels:

1. Source text.
2. Obfuscated result.

Both textareas keep their own vertical scrollbars and never expand with long content. The left column itself does not move when the user scrolls a settings tab.

## Right settings column

The right column contains a fixed tab bar and two independently retained tab panels:

1. **文本混淆** — active by default; contains presets, readability warning, transformation pipeline, and dictionary pack controls.
2. **图片导出** — contains image settings, canvas preview, and long/split export actions.

Only the active panel is visible. Both panels remain mounted so their form state and scroll position survive tab switching. Each panel owns its own vertical scrolling area.

## Tabs and accessibility

The tab bar uses `tablist`, `tab`, and `tabpanel` semantics. Tabs support:

- Mouse and touch activation.
- Left and right arrow navigation.
- Home and End navigation.
- Visible selected and focus states.

## Mobile behavior

Below 900 pixels, the workspace returns to normal document flow:

- Source and result remain stacked.
- Both textareas have practical fixed minimum heights and internal scrolling.
- The right settings column follows below them.
- Tabs remain available to avoid one extremely long settings page.

## Visual hierarchy

Section numbering changes to:

1. 输入原文
2. 混淆结果
3. 文本参数
4. 图片导出

The tab bar uses the existing ink, paper, and vermilion visual system and remains visually attached to the settings column.

## Testing

- Text and result panels are present together.
- Text settings are selected by default.
- Image settings become visible after selecting the image tab.
- Keyboard arrows switch tabs.
- Both tab panels remain mounted.
- CSS browser verification checks independent overflow containers and desktop/mobile layout.

