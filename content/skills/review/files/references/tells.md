# Common tells of generated UI

Check each against the images. If CONTEXT.md deliberately keeps one of
these, it passes.

## Layout and structure
- Every item is the same card at the same size in the same stack
  (uniform rhythm — nothing earns more space)
- Cards inside cards; a screen that is only a stack of rounded boxes
- Dashboard skeleton by default: hero stat card, 2×2 tiles, "Recent"
- A greeting header ("Good morning, Maya") as the top of the screen
- A centred floating "+" over the tab bar
- A left-border accent bar on cards (the blockquote-callout pattern)

## Colour
- More than one accent hue doing decorative work
- Purple / indigo gradients, gradient text, glows, blurred colour blobs
- Pastel tint on every card
- Meaning carried by colour alone (red = behind, with no word)

## Type
- One weight and size everywhere; no real hierarchy
- Display numbers that aren't larger than the labels next to them
- Default-reach fonts with no reason (Inter, Poppins everywhere)

## Content
- Lorem ipsum, "Title here", grey placeholder boxes
- Round fake numbers ("1,000 users", "100%")
- Emoji used as icons
- Marketing words inside the app ("Supercharge", "Unlock")

## Defects
- Text clipped, overlapping or wrapping badly
- A label closer than ~14px to its container edge
- Pills in a row with unequal widths
- Contrast under 4.5:1 for body text
- Touch targets under 44×44pt (iOS) / 48dp (Android)
- Content under the status bar or home indicator
- Shadows with a visible hard edge
- More than one radius family with no pattern
