# G.4 Landing Image Analysis

Reviewed: current Landing screenshot supplied with G.4 and the approved Landing reference supplied in G.3. The approved reference remains the visual authority.

## Current issues and corrections

| Element | Current approx. x/y/w/h | Approved approx. x/y/w/h | Problem | Required correction |
| --- | --- | --- | --- | --- |
| Visible HTML title `Meme Physics Lab 67` | 8/5/28/6% | absent | Duplicates the final logo and competes with it. | Remove from all visible Landing DOM. Use only the final logo with an image `alt`. |
| Final logo | 13/26/13/17% visible, asset box larger | 15/5/23/36% visible | PNG transparent padding causes a small perceived logo. | Alpha-trim original, keep 16px safety margin, and use 320–400px visible width at 1600×900. |
| Headline | 8/49/31/9% | 16/46/22/9% | Literal `\\n` is rendered and text overlaps a dense formula/graph region. Typeface has hard shadow/stroke feel. | Two real line spans, moved to a clear notebook region below logo; use global Anuphan, 42–52px, 700, no heavy stroke/shadow. |
| Supporting copy | 8/58/27/3% | 16/59/22/3% | Too close to headline and background detail. | Tight group below headline, 17–20px/500/1.5. |
| Primary CTA | 12/62/16/6% | 15/64/22/7% | The visual frame is valid, but current group is slightly narrow. | Keep vertical stack; 260–320px wide, 58–66px high. |
| Secondary CTA | 14/69/12/4% | 18/72/16/4% | Correctly below primary in current screenshot, but needs typographic consistency. | Retain below primary at 70–85% primary width. |
| Bottom cards | 9/85/30/7% | 15/80/24/8% | Current selected-state UI makes them look like input radio controls. | Keep three cards as neutral information teasers; clicking opens a modal and must not mutate input preference. |
| Mascot | 47/9/47/83% | 39/2/55/96% | Artwork is dominant but current balance pushes the content group too high/left. | Preserve final asset; let mascot use 60–64% zone and keep all left content in one group. |

## Logo alpha padding

The original logo canvas is 1536×1024. Its perceived logo artwork occupies a substantially smaller portion of its transparent canvas, which is why a CSS width that appears numerically large still looks undersized. G.4 creates an alpha-bounded derivative with a 16px transparent safety margin. The source file remains untouched.

## Typography difference

- Current screenshot shows an inconsistent browser/system stack and an accidental literal escape sequence.
- Reference uses a rounded, friendly Thai game UI: clear weight hierarchy, moderate tracking, clean dark navy text, and compact line grouping.
- G.4 uses a global `--font-ui` token: `Anuphan`, then `Leelawadee UI`, `Tahoma`, sans-serif. It applies to all form controls as well as body text.

## Interaction correction

The current bottom cards were incorrectly implemented as `InputModeSelector` controls. They must not select a persistent mode, request camera permission, or alter gameplay input from Landing. They are informational teasers only. Each now opens an accessible explainer modal that closes with its close button, Escape, or backdrop click and restores focus to the originating card.
