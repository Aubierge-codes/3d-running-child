# My First 3D World

A small 3D village you can explore in the browser: run, double-jump, collect coins, and change the time of day. Built with React, react-three-fiber and three.js, bundled with Vite.

Works with a keyboard on desktop, and with on-screen touch controls on phones and tablets.

## Run it

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve dist/ on http://localhost:4173
npm run lint
```

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | WASD / arrow keys | Left joystick |
| Sprint | Hold Shift | SPRINT button (toggle) |
| Jump / double jump | Space | JUMP button |
| Rotate / zoom camera | Mouse drag / wheel | One-finger drag / pinch on the world |
| Pause | Esc or ⏸ | ⏸, tap anywhere to resume |
| Speed & time of day | Bottom-right sliders | ⚙️ settings sheet |

Collect all six coins to finish the level. The star coin is worth 5 and pulls nearby coins toward you for 5 seconds. Picking up three or more coins within 2 seconds of each other gives a combo bonus.

## Documentation

- [docs/DEBUGGING.md](docs/DEBUGGING.md) explains how the pieces connect, what to check when something breaks, and how to run the browser smoke test.
