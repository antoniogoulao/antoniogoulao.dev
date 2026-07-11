---
name: verify
description: Build, serve and inspect the static export of antoniogoulao.dev
---

# Verify antoniogoulao.dev

Static-export Next.js site (output: 'export'), no dev-server needed for verification — the artifact IS `out/`.

```bash
npm run build                      # writes static site to out/
(cd out && python3 -m http.server 8899 &)
curl -s http://localhost:8899/en-GB/ | grep ...   # content is in raw HTML (no JS needed)
```

Flows worth driving:
- `/` — must contain meta refresh + fallback locale links (non-JS redirect stub).
- `/{en-GB,pt-PT,es-ES,fr-FR}/` — check `lang=` attr, `<title>`, hreflang `hrefLang=` (camelCase in Next output!), canonical, JSON-LD.
- `/sitemap.xml`, `/robots.txt`, `/og.png`, `/CV_Antonio_Goulao_FE.pdf` — all 200.
- Screenshots: headless Brave works — `"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless=new --disable-gpu --no-sandbox --user-data-dir=<tmp> --screenshot=<file> --window-size=1280,3400 --virtual-time-budget=8000 <url>` — but is flaky (silently produces nothing on some runs; retry with a fresh user-data-dir). Widths below ~500px may render cropped (min-window artifact), don't trust narrow captures.

Gotchas:
- `npm test` picks up `.worktrees/` unless testPathIgnorePatterns excludes it (already configured).
- `sitemap.ts`/`robots.ts` need `export const dynamic = 'force-static'` under output: 'export'.
- All copy lives in `messages/{locale}.json` ×4 — parity check all four.
