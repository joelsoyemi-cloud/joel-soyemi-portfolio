# Verification

The visitor should be able to explore Joel's projects, change the hero material, use the interaction lab, pause motion, and reach his contact links on desktop and mobile. This is a static portfolio: there is no API or database boundary.

## Confirmed

- Dependency installation succeeds from the committed npm manifest.
- TypeScript and the optimized Next.js static export pass.
- The exported site's project filters return one business project, two editorial projects, and three projects for All work.
- In-page navigation updates the active navigation control.
- Material selection updates the selected control and the CSS sculpture.
- Interaction tabs support both clicks and arrow-key navigation.
- Motion pause updates the page state and disables decorative animations.
- Clipboard denial displays the contact destination and an explanatory fallback.
- Project image, title, and visit links point to their matching deployed websites. Separate source links point to the matching repositories verified through the connected GitHub account.
- Responsive layouts at 320, 390, and 768 CSS pixels have no horizontal overflow. Desktop layout was checked at 1363 CSS pixels.
- Fallback sculpture material selection, arrow-key rotation, and Home to reset work.
- An explicit motion-off preference remains off after a page reload.

## Limits

The managed browser reports that WebGL is disabled. The Three.js code compiles, but GPU rendering, shader appearance, drag behavior in WebGL, and frame-rate performance need a check on a real browser with WebGL enabled. The CSS fallback is the rendered result used in browser checks.

The development preview did not hydrate reliably through the managed preview environment. Interactive checks used the exported production files served by the supported preview supervisor instead. This is separate from the successful Next.js production build.

Pinterest blocked full pin pages. Reference discovery is based on indexed public pin titles and metadata. No claim is made that the full pinned animations were inspected.

The 3D and motion interactions should receive a final device check on Safari/iOS and an Android phone to verify device-specific appearance and performance for the public portfolio launch.

## Screenshot update — 23 October 2026

Real homepage captures replace all three illustrative project studies. NYNTH now references its deployed static demo and matching repository; Academy Press replaces the source-only CGPA tool in the image grid and is labeled as a private preview. Access-code values are not persisted.

The production export was checked again after the screenshot update:

- All three local images load with natural dimensions 1348 × 926 and preserve their aspect ratio.
- Each thumbnail, title, and visit action uses the corresponding website; source icons use matching GitHub repositories.
- Editorial shows two projects, Business shows Academy Press, and All work shows all three.
- The responsive preview at 320, 390, and 768-pixel frame widths has no horizontal document overflow (the content viewport excludes the browser scrollbar).
- The Academy Press preview note remains visible beside its visit action.
- The Next.js optimized static build and its TypeScript check pass.

Vercel project access is currently blocked by the connected account’s team authorization. No Vercel portfolio deployment has been reported as successful.

## Expanded Play section — 23 October 2026

Story: visitors enter Play, choose or manipulate an experiment, and see the result directly in the browser. All new state is local to the component; there is no API, database, account, or external service boundary.

Confirmed on the production static export:

- Orbit, Ribbon, and Lattice controls update the selected shape. Pointer input bends the field; clicking and Enter trigger scattering. Remix advances the edition and scatter count.
- Editing poster text, choosing Grotesk and Electric, and using End on the stretch range updates the poster label, palette, typeface, and 115% stretch. A 22-character unbroken string wraps inside the poster. The new-thought button replaces the text.
- Pointer and keyboard drops increase the pebble count. Gravity strength supports keyboard adjustment, and arrow keys nudge the newest pebble. Shake changes the arrangement; Reset restores five pebbles. At 18, the add button is disabled.
- The global motion toggle pauses continuous animation; shape changes, poster edits, scattering, and static pebble arrangement remain available.
- Both Canvas 2D surfaces render at nonzero dimensions in this browser. Their shared lifecycle explicitly cancels frames on cleanup, when outside the viewport, and when the document is hidden; density is capped at 1.5.
- The new layout has no horizontal document overflow at 320, 390, and 768-pixel responsive frame widths. Desktop was checked at a 1363-pixel frame width.
- The optimized Next.js build and TypeScript check pass.

The existing hero WebGL and physical iOS/Android device checks remain outstanding. Desktop browser checks and responsive frame checks do not establish touch-device frame-rate performance.

## Independent repository — 23 October 2026

The complete custom portfolio has been copied to `joelsoyemi-cloud/joel-soyemi-portfolio` on `main`. This repository is independent of the earlier fork and uses a new commit history. Application code, dependency versions, and public project images are unchanged from the verified portfolio. Deployment remains a separate step.

## Morphism Studio and cinematic journey — 24 October 2026

Story: visitors enter the new cinematic Play sequence, explore three chapters and the project previews, then choose and manipulate a material in the studio. All interaction state is local; there is no API, account, or database requirement.

Verified in the exported production site:

- All 24 material presets update Surface A. Computed backgrounds, borders, shadow treatments, and corner radii confirm distinct finishes rather than palette-only changes.
- Glass, Soft, Physical, Graphic, and Digital tabs show 4, 3, 5, 6, and 6 presets. Home returns to the full 24-style collection.
- Globe, Waves, Torus, Cube, and Bloom update the field. Scatter and Enter increment the scatter count; arrow-key input is handled by the field. Attract, Vortex, and Scatter controls select their behaviors.
- Force reaches 2.0×, roundness reaches 48px and changes the computed corner radius, and depth reaches 100%.
- Comparison renders two nonzero Canvas 2D surfaces. The comparison dropdown updates Surface B independently. Shared scatter targets both fields. Remix changes the edition/style/shape; Reset restores the default studio and full collection.
- With motion off, all three cinematic chapters remain available through buttons. Frames exposes the three matching live-project links; inactive project links leave the keyboard sequence. Jade/Amber selection changes the scene grade. Warp and Enter increment the jump counter; arrow-key exploration remains available.
- The cinematic Canvas fallback renders at a nonzero viewport size when this browser cannot create WebGL. Its orbital composition was visually inspected.
- With motion on, the cinematic journey has a sticky stage and scroll-driven progress. Selecting Orbit reaches the first chapter at approximately 0.133 progress.
- Responsive frame widths 320, 390, and 768 pixels have no horizontal document overflow after clipping the small material story’s decorative artwork on narrow screens. Content widths exclude the browser scrollbar. Comparison stacks on phone widths and uses two columns on the wider frame.
- The optimized static build and its TypeScript check pass, including the Sites build helper.

The uploaded reference clips were reviewed across their full durations through sequential frames. The clips and their car imagery are not distributed with the site. The new scene is original procedural artwork, and the floating previews reuse Joel’s project screenshots.

Limits: cloud WebGL is disabled, so the actual GPU scene, visual parity between GPU and fallback, physical phone touch behavior, and real-device frame rates remain unverified. These are device checks, not compile failures. The managed development preview did not hydrate reliably; interaction verification used a separate static QA copy of the production export served by the supported supervisor.
