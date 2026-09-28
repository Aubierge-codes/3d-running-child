"""Browser smoke test for the 3D world.

Drives the real app in headless Chromium and checks the things that a build
alone can't: the model loads, the character moves, input/focus handling, pause,
day/night, coin pickup, the error screen, and that nothing logs a console error.

Usage (from the project root):
    npm run build
    npx vite preview --port 4173          # in another terminal
    pip install playwright && python -m playwright install chromium
    python scripts/smoke_test.py [--url http://localhost:4173/] [--out smoke-screenshots]

Exits with code 1 if any check fails. Screenshots of each step go to --out.
Software rendering in headless mode is slow (single-digit FPS); that's expected.
"""
import argparse, os
import re, sys, time
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("--url", default="http://localhost:4173/")
parser.add_argument("--out", default="smoke-screenshots")
args = parser.parse_args()
URL, OUT = args.url, args.out
os.makedirs(OUT, exist_ok=True)
errors, warnings = [], []
results = []

def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail else ""))

def hud(page):
    return page.locator("body").inner_text()

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    page = browser.new_page(viewport={"width": 1280, "height": 760})
    page.on("console", lambda m: (errors if m.type == "error" else warnings if m.type == "warning" else []).append(m.text))
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))

    page.goto(URL)
    check("Page title", page.title() == "My First 3D World", page.title())
    page.wait_for_selector("canvas", timeout=30000)
    page.wait_for_function("() => !document.body.innerText.includes('Loading world')", timeout=60000)
    time.sleep(2)
    check("Canvas rendered, loading overlay gone", True)
    check("No error boundary fallback", "couldn't start" not in hud(page))
    page.screenshot(path=f"{OUT}/01-start.png")

    # Movement: hold W and the HUD speed should rise above 0
    page.mouse.click(640, 400)
    page.keyboard.down("KeyW")
    time.sleep(1.2)
    speed_text = re.search(r"Speed: ([\d.]+) m/s", hud(page))
    page.keyboard.up("KeyW")
    speed = float(speed_text.group(1)) if speed_text else 0
    check("Character moves on W at ~base speed (3 m/s)", 2.0 < speed < 4.0, f"speed {speed} m/s")
    page.screenshot(path=f"{OUT}/02-moved.png")

    # Focus bug: click Rain, then press Space. Rain must NOT toggle back off.
    page.get_by_role("button", name=re.compile("Rain")).click()
    time.sleep(0.3)
    page.keyboard.press("Space")
    time.sleep(0.5)
    check("Space after clicking a button doesn't re-press it", "Stop Rain" in hud(page))
    page.screenshot(path=f"{OUT}/03-rain.png")
    page.get_by_role("button", name=re.compile("Stop Rain")).click()

    # Arrow keys after touching a slider must not move the slider
    time_slider = page.locator("input[type=range]").nth(1)
    time_slider.focus()
    before = time_slider.input_value()
    page.keyboard.press("ArrowRight")
    check("Arrow keys don't change a focused slider", time_slider.input_value() == before, f"{before} -> {time_slider.input_value()}")

    # Pause stops the play timer
    page.keyboard.press("Escape")
    time.sleep(0.3)
    check("Esc shows pause overlay", "PAUSED" in hud(page))
    t1 = re.search(r"⏱ (\d+:\d+)", hud(page)).group(1)
    time.sleep(2.3)
    t2 = re.search(r"⏱ (\d+:\d+)", hud(page)).group(1)
    check("Play timer stops while paused", t1 == t2, f"{t1} -> {t2}")
    page.keyboard.press("Escape")

    # Night: drag time slider to midnight
    time_slider.fill("0")
    time.sleep(1.5)
    page.screenshot(path=f"{OUT}/04-night.png")
    check("Night mode renders", "Time: 0:00" in hud(page))
    time_slider.fill("12")

    # Respawn resets score to 0
    page.get_by_role("button", name=re.compile("Respawn")).click()
    time.sleep(0.5)
    check("Respawn resets score", re.search(r"🪙 0", hud(page)) is not None)

    # Coin pickup: first coin sits at (3, -3); walk diagonally from spawn
    page.keyboard.down("KeyW"); page.keyboard.down("KeyD")
    deadline = time.time() + 6
    while time.time() < deadline and not re.search(r"🪙 [1-9]", hud(page)):
        time.sleep(0.1)
    page.keyboard.up("KeyW"); page.keyboard.up("KeyD")
    time.sleep(0.4)
    check("Walking into a coin scores exactly 1", re.search(r"🪙 1(?!\d)", hud(page)) is not None, re.search(r"🪙 \d+", hud(page)).group(0))
    check("First-coin toast shown", "First coin collected" in hud(page))
    page.screenshot(path=f"{OUT}/05-coin.png")

    fps = re.search(r"(\d+) FPS", hud(page))
    check("FPS counter shows a number (not NaN)", fps is not None, fps.group(0) if fps else hud(page)[:0] + "no number")
    # Error boundary: block the character model and expect the fallback screen
    page2 = browser.new_page()
    page2.route("**/child.glb", lambda route: route.abort())
    page2.goto(URL)
    try:
        page2.wait_for_function("() => document.body.innerText.includes(\"couldn't start\")", timeout=30000)
        ok = True
    except Exception:
        ok = False
    check("Error screen shown when model fails to load", ok)
    page2.screenshot(path=f"{OUT}/06-error.png")
    browser.close()

real_errors = [e for e in errors if "autoplay" not in e.lower() and "play()" not in e]
check("No console errors", not real_errors, "; ".join(real_errors[:5]))
print("warnings:", len(warnings)); [print("  -", w[:150]) for w in dict.fromkeys(warnings)]
passed = sum(ok for _, ok, _ in results)
print(f"\n{passed}/{len(results)} checks passed")
sys.exit(0 if passed == len(results) else 1)
