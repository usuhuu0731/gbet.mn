# Editorial redesign performance — 2026-10-03

The production export at starting commit `0fa7805111ac50715749dfc5287184dfafc1bb0e` was snapshotted before edits. Each locale/route/device combination ran five times before and five times after the redesign: 40 loads per batch, 80 in total. The final after batch ran without parallel build/lint work. No analytics or field monitoring is installed.

## Fixed laboratory settings

- Node v24.19.0; Chromium 153.0.8010.12; Windows; gzip strict local static server; custom-domain export configuration `https://gbet.mn`.
- Desktop: 1440x900; loopback; unthrottled. Mobile: 390x844; 4x CPU; 150ms latency; 1.6Mbps down / 0.75Mbps up.
- Fresh context and disabled cache per run. Reduced motion enabled. Mobile viewport uses browser DPR 1; this is a controlled synthetic test, not a real phone.
- Interaction: navigation menu open/close after fonts and network settle. INP covers this sampled interaction only; a missing event stays null and is excluded from its median.

## LCP — milliseconds, median (min–max)

| Device | Locale / route | Before, five runs | After, five runs | After target ≤2500 ms |
|---|---|---:|---:|---|
| Desktop | MN / Home | 256 (192–688) | 196 (180–768) | Met |
| Desktop | MN / Ikh Tamir detail | 424 (204–484) | 232 (184–312) | Met |
| Desktop | EN / Home | 224 (204–236) | 248 (184–328) | Met |
| Desktop | EN / Ikh Tamir detail | 208 (200–280) | 292 (256–348) | Met |
| Mobile | MN / Home | 3736 (3676–4144) | 2900 (2764–3044) | Not met |
| Mobile | MN / Ikh Tamir detail | 4656 (4640–4744) | 2820 (2740–2988) | Not met |
| Mobile | EN / Home | 3752 (3460–4004) | 2796 (2728–2864) | Not met |
| Mobile | EN / Ikh Tamir detail | 4416 (4352–4504) | 2772 (2596–2856) | Not met |

Mobile medians improved across all four cases. Desktop EN home/detail medians increased from 224/208 ms to 248/292 ms; do not describe every route/device as faster. Desktop values have substantial local-run variance. These samples do not establish statistical significance or real-host behavior.

## CLS and menu INP

| Device | Locale / route | Before CLS median (range) | After CLS median (range) | Before INP ms (range) | After INP ms (range) | After INP samples |
|---|---|---:|---:|---:|---:|---:|
| Desktop | MN / Home | 0.000000 (0.000000–0.000016) | 0.000000 (0.000000–0.000000) | 24 (24–32) | 28 (24–32) | 4/5 |
| Desktop | MN / Ikh Tamir detail | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) | 24 (24–32) | 24 (24–24) | 4/5 |
| Desktop | EN / Home | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) | 24 (24–32) | 32 (24–32) | 4/5 |
| Desktop | EN / Ikh Tamir detail | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) | 32 (24–32) | 32 (32–32) | 2/5 |
| Mobile | MN / Home | 0.000023 (0.000023–0.000023) | 0.000000 (0.000000–0.000000) | 96 (64–104) | 96 (64–104) | 5/5 |
| Mobile | MN / Ikh Tamir detail | 0.000000 (0.000000–0.000296) | 0.000000 (0.000000–0.000000) | 96 (80–112) | 80 (40–112) | 5/5 |
| Mobile | EN / Home | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) | 80 (48–104) | 80 (64–88) | 5/5 |
| Mobile | EN / Ikh Tamir detail | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) | 80 (80–104) | 80 (80–80) | 5/5 |

All measured final CLS values are 0, below the 0.1 target. Sampled final menu INP values are below 200 ms. That does not certify other interactions, a full session, WCAG conformance, or real-user Core Web Vitals.

## Image and remaining delay observations

The first final mobile MN home run requested the 480px WebP at 255 ms, finished at 1838 ms and recorded image LCP at 2900 ms. Transfer size was 27,620 bytes versus 303,104 bytes for the previous source image. The mobile homepage LCP element changed from H1 to IMG with the new 4:3 layout, so headline/font and image timing are different signals. The detail image now loads eagerly rather than waiting for hydration.

The remaining gap between image response completion and LCP suggests investigating initial rendering/main-thread work with a browser trace. The resource report alone does not prove a specific framework bottleneck. Do not strip bootstrap scripts or hide content to improve a score. An explicit responsive-image preload was tried in a single-run probe and removed because it did not provide conclusive benefit; eager/high priority and srcset remain.

The mobile LCP target is still unmet. Further optimization must preserve readable typography, Mongolian glyph coverage and approved image detail. Higher-DPR image selection is responsive but the original source resolution remains the limit. Real hosting, device CPU, cache and network conditions may differ.

## Reproduction and raw results

Build with the same origin/repository and run `QA_REPORT_TAG=after-final QA_LAB_RUNS=5 npm run measure:lab`. In PowerShell set `$env:QA_REPORT_TAG` and `$env:QA_LAB_RUNS` first. `QA_BROWSER_PATH` selects the installed Chromium; `QA_SITE_DIR` can select the ignored baseline snapshot. Never measure while building or running other browser QA.

- `outputs/performance-before.json`: all 40 baseline runs, resource timings, medians and min/max.
- `outputs/performance-after-final.json`: all 40 final runs, resource timings, medians and min/max.
- `outputs/performance-after.json`: earlier intermediate five-run iteration; not used for the final table.
- `outputs/performance-preload-probe.json`: exploratory single-run hint experiment; not a final comparison.
- `outputs/before/` and `outputs/after/`: production-export screenshots for visual review. The feature capture temporarily enlarges its capture viewport height so the whole facts row is painted; home screenshots retain 390×844 and 1440×900.

Raw reports and screenshots are ignored local/CI artifacts and are excluded from the public deployment. This release has no database migration, WebGL viewer or hosting migration.
