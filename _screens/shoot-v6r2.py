#!/usr/bin/env python3
"""v6 剧本靠拢版截图验证：CN 全流程 + EN 抽查 + 移动端"""
import sys, time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4399"
OUT = "/Users/kino/Documents/kimi/workspace/blacklake-careers/_screens"
errors = []

def hook(page, tag):
    page.on("console", lambda m: errors.append(f"[{tag}] {m.type}: {m.text}") if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(f"[{tag}] PAGEERROR: {e}"))

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ============ 桌面 CN 1440x900 ============
    pg = browser.new_page(viewport={"width": 1440, "height": 900})
    hook(pg, "CN")
    pg.goto(f"{BASE}/index.html")
    pg.wait_for_timeout(1200)

    # 1. Prelude→Hero 冲开中间帧（SPACE 触发离场，0.42s 截变形中）
    pg.keyboard.press("Space")
    pg.wait_for_timeout(420)
    pg.screenshot(path=f"{OUT}/cn-r2-prelude-burst.png")

    # 2. Hero 完成态（流线画出后）
    pg.wait_for_timeout(1600)
    pg.screenshot(path=f"{OUT}/cn-r2-hero.png")

    # 3. Order conv 态（prog≈0.66，智能节点左入右出）
    pg.keyboard.press("ArrowDown")  # 进 order
    pg.wait_for_timeout(400)
    for _ in range(3):
        pg.keyboard.press("ArrowDown")  # prog +0.22 each → 0.66
        pg.wait_for_timeout(260)
    pg.wait_for_timeout(1200)
    pg.screenshot(path=f"{OUT}/cn-r2-order-conv.png")

    # 4. Order prog=1：verdict + smart-line
    for _ in range(2):
        pg.keyboard.press("ArrowDown")  # → 1.0 (clamp)
        pg.wait_for_timeout(260)
    pg.wait_for_timeout(1300)
    pg.screenshot(path=f"{OUT}/cn-r2-order-verdict.png")

    # 5. Impact 线→照片 中间帧 + 完成帧
    pg.keyboard.press("ArrowDown")  # 进 impact
    pg.wait_for_timeout(450)
    pg.screenshot(path=f"{OUT}/cn-r2-impact-mid.png")
    pg.wait_for_timeout(1600)
    pg.screenshot(path=f"{OUT}/cn-r2-impact.png")

    # 6. Frontier（conf 94→51 掉落 + jolt）
    pg.keyboard.press("ArrowDown")
    pg.wait_for_timeout(1800)
    pg.screenshot(path=f"{OUT}/cn-r2-frontier.png")

    # 7. Jobs
    pg.keyboard.press("ArrowDown")
    pg.wait_for_timeout(1100)
    pg.screenshot(path=f"{OUT}/cn-r2-jobs.png")
    pg.close()

    # ============ 桌面 EN ============
    pg = browser.new_page(viewport={"width": 1440, "height": 900})
    hook(pg, "EN")
    pg.goto(f"{BASE}/index-en.html")
    pg.wait_for_timeout(1000)
    pg.keyboard.press("Space")
    pg.wait_for_timeout(1900)
    pg.screenshot(path=f"{OUT}/en-r2-hero.png")
    pg.keyboard.press("ArrowDown")
    pg.wait_for_timeout(400)
    for _ in range(3):
        pg.keyboard.press("ArrowDown")
        pg.wait_for_timeout(260)
    pg.wait_for_timeout(1200)
    pg.screenshot(path=f"{OUT}/en-r2-order-conv.png")
    for _ in range(2):
        pg.keyboard.press("ArrowDown")
        pg.wait_for_timeout(260)
    pg.wait_for_timeout(1300)
    pg.screenshot(path=f"{OUT}/en-r2-order-verdict.png")
    pg.close()

    # ============ 小视口 CN 1053x702（用户截图尺寸）=========
    pg = browser.new_page(viewport={"width": 1053, "height": 702})
    hook(pg, "CN-small")
    pg.goto(f"{BASE}/index.html")
    pg.wait_for_timeout(900)
    pg.keyboard.press("Space")
    pg.wait_for_timeout(1900)
    pg.screenshot(path=f"{OUT}/cn-r2-hero-small.png")
    pg.keyboard.press("ArrowDown")
    pg.wait_for_timeout(400)
    for _ in range(3):
        pg.keyboard.press("ArrowDown")
        pg.wait_for_timeout(260)
    pg.wait_for_timeout(1200)
    pg.screenshot(path=f"{OUT}/cn-r2-order-conv-small.png")
    pg.close()

    # ============ 移动端 390x844 ============
    pg = browser.new_page(viewport={"width": 390, "height": 844})
    hook(pg, "MOBILE")
    pg.goto(f"{BASE}/index.html")
    pg.wait_for_timeout(1500)
    sw = pg.evaluate("document.documentElement.scrollWidth")
    iw = pg.evaluate("window.innerWidth")
    print(f"mobile scrollWidth={sw} innerWidth={iw} overflow={sw > iw}")
    pg.screenshot(path=f"{OUT}/m-r2-top.png")
    # 滚动到 Order 智能节点区
    pg.evaluate("window.scrollTo(0, document.querySelector('.order').offsetTop)")
    pg.wait_for_timeout(900)
    pg.screenshot(path=f"{OUT}/m-r2-order.png")
    pg.close()

    browser.close()

print("\n=== console errors ===")
print("\n".join(errors) if errors else "(none)")
