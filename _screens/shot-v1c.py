import asyncio, sys
from playwright.async_api import async_playwright

URL = "http://localhost:4399/proto-v1c.html"
OUT = "/Users/kino/Documents/kimi/workspace/blacklake-careers/_screens"

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={"width":1440,"height":900})
        errors = []
        pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errors.append(str(e)))
        await pg.goto(URL)
        await pg.wait_for_timeout(900)
        # 各滚动进度截图
        stops = [(0.0,"p0"), (0.3,"p3"), (0.6,"p6"), (1.0,"p10")]
        for prog, name in stops:
            await pg.evaluate(f"""() => {{
                const max = document.documentElement.scrollHeight - innerHeight;
                window.scrollTo(0, max * {prog});
            }}""")
            await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f"{OUT}/v1c-{name}.png")
        # 移动端粗查
        ctx = await b.new_context(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
        m = await ctx.new_page()
        await m.goto(URL)
        await m.wait_for_timeout(800)
        await m.evaluate("() => { const x = document.documentElement.scrollHeight - innerHeight; window.scrollTo(0, x); }")
        await m.wait_for_timeout(1200)
        await m.screenshot(path=f"{OUT}/v1c-mobile.png")
        print("CONSOLE ERRORS:", errors if errors else "none")
        await b.close()

asyncio.run(main())
