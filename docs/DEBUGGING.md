# Debugging guide

Short notes for whoever picks this up next. They cover how the app is wired, where to look when something breaks, and how to check a change.

## How it fits together

```
index.html → src/main.jsx → App.jsx
                              ├── ErrorBoundary → Scene.jsx (the <Canvas>)
                              │     ├── Character.jsx      reads inputState every frame
                              │     ├── CameraRig          OrbitControls + auto-follow + shake
                              │     ├── CoinManager        pickup, star magnet, combo
                              │     ├── ObstacleManager    pushes the character out of colliders
                              │     ├── PondZone           tells App when you're in the water
                              │     └── ~35 world components (Trees, Village, Windmill, …)
                              ├── HUD (score, minimap, buttons, settings, toasts, overlays)
                              └── TouchJoystick.jsx  (touch devices only)
```

**Input.** [src/hooks/inputState.js](../src/hooks/inputState.js) is one shared, mutable object: `{ forward, backward, left, right, jump, sprint }`.
- The keyboard ([useKeyboardControls.js](../src/hooks/useKeyboardControls.js)) and the touch controls ([TouchJoystick.jsx](../src/components/TouchJoystick.jsx)) both write to it.
- `Character`, `Dust` and `SprintTrail` read it inside `useFrame`.
- It deliberately lives outside React state, so a key press doesn't cause a re-render.

**App ↔ Scene.**
- `App` owns the HUD state.
- `Scene` is wrapped in `memo`, so every callback passed to it must be stable (`useCallback` or a state setter). An inline arrow function would re-render the whole 3D tree on every HUD update: FPS, speed and position change several times per second.
- `App` sends one-off commands to the scene as counters (`resetSignal`, `screenshotSignal`). Incrementing a counter triggers the action once.

**World layout.**
- [src/world/layout.js](../src/world/layout.js) is the single source of truth for where static objects sit and how big their collision circles are. Components render from it, and `ObstacleManager` collides against `colliders`.
- Scattered objects (trees, rocks, bushes) use a seeded RNG ([random.js](../src/world/random.js)), so they land in the same place on every load.
- To move something, change its position in `layout.js`. Don't hard-code a copy in the component.

**Character model.**
- The model is `public/models/child.glb`, loaded with `useGLTF`.
- The model must contain animation clips named `Idle` and `Run`.
- Material names `Shirt`, `UnderShirt`, `Pants`, `Boots`, `Hair` and `Skin` are recoloured in code.

**Saved settings.**
- The high score, speed, dust, shake, fog and music settings are saved in `localStorage`.
- Every read and write is wrapped in try/catch, so private browsing still works; it just won't remember anything.
- To reset, run `localStorage.clear()` in the devtools console.

## Mobile

- **Detection.** Touch is detected once, at load, with `'ontouchstart' in window || navigator.maxTouchPoints > 0`. When true:
  - the joystick, JUMP and SPRINT controls are shown;
  - the minimap moves under the score;
  - the speed/time sliders move into the ⚙️ sheet;
  - HUD buttons show icons only;
  - the render resolution is capped at 1.5× (`DPR` in `Scene.jsx`).

  A touchscreen laptop counts as touch as well.
- **Safe areas.** HUD offsets use `env(safe-area-inset-*)` (the `safe()` helper in `App.jsx` and `TouchJoystick.jsx`). The viewport meta tag has `viewport-fit=cover` so notches are handled.
- **Page behaviour.** `index.css` blocks pull-to-refresh, rubber-band scrolling, text selection and double-tap zoom, and uses `100dvh` so the URL bar doesn't cut off the bottom controls.
- **Touch listeners.** The joystick and jump button use *native* `{ passive: false }` listeners. React's own touch handlers are passive, so `preventDefault()` in them does nothing.
- **Stuck input.** If the tab loses focus or is hidden (a call, an app switch), all touch input and sprint are reset so the character doesn't keep running.
- **Fullscreen on iPhone.** iPhone Safari has no Fullscreen API, so the ⛶ button is hidden there (`canFullscreen`). "Add to Home Screen" gives a similar result.

**Testing on a real phone.** Run `npm run dev -- --host` and open the printed network URL on a phone on the same Wi-Fi. For remote debugging use Chrome `chrome://inspect` (Android) or Safari → Develop menu (iOS). The Chrome devtools device toolbar is fine for layout checks, but it doesn't reproduce real multi-touch.

## Symptom → where to look

| Symptom | Likely cause / where to look |
| --- | --- |
| "The 3D world couldn't start" screen | `ErrorBoundary` caught a render error. The real error is in the console under `[3D world] Scene failed to render`. Usually WebGL is unavailable or `child.glb` failed to load (check the Network tab, and `base` in `vite.config.js` if the app is deployed under a sub-path). |
| Stuck on "Loading world…" | `useProgress` never finished. Look for a 404 on `models/child.glb`. |
| Character keeps running after alt-tab or a call | The input reset didn't fire. Check the `blur` handler in `useKeyboardControls.js` and the `blur`/`visibilitychange` handlers in `TouchJoystick.jsx`. |
| Character walks through an object | Its entry in `colliders` (`layout.js`) is missing or has the wrong radius, or the component renders at a different position from its layout entry. |
| Space or arrow keys change a slider or press a button | Focus handling in `useKeyboardControls.js` blurs any focused `BUTTON`/`INPUT` on game keys. |
| Whole scene stutters when the HUD updates | A non-stable prop was passed to `<Scene>`, which defeats its `memo`. Look for inline functions or objects in `App.jsx`. |
| Joystick does nothing | `isTouchDevice` was false (for example, touch emulation was turned on after the page loaded), or something is layered above the joystick. |
| Low FPS on phones | Turn off dust and fog in ⚙️. Beyond that, lower `DPR` or the shadow map size (2048) in `Scene.jsx`. |
| Console warning: `THREE.Clock … deprecated` | Comes from inside `@react-three/fiber`, not this code. Harmless; it goes away when that library updates. |

## Checking a change

1. `npm run lint` and `npm run build` should both finish with no errors.
2. Run the browser smoke test. It drives the real app in headless Chromium:
   ```bash
   npm run build
   npx vite preview --port 4173          # leave running
   pip install playwright && python -m playwright install chromium
   python scripts/smoke_test.py          # screenshots go to smoke-screenshots/ (git-ignored)
   ```
   On Windows, set `PYTHONIOENCODING=utf-8` first, or printing the emoji HUD text will crash.

   Headless rendering runs at about 3 FPS. At that rate the character sometimes overshoots and picks up a coin during an earlier step, so the one-shot **"First-coin toast shown"** check can fail even when nothing is broken. If the score already reads 1 in `04-night.png`, that's what happened.
3. For mobile, use the devtools device toolbar at a phone size in both portrait and landscape. Check that nothing overlaps the joystick or the JUMP/SPRINT buttons.
