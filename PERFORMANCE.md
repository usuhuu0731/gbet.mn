# GBET performance records

## Editorial engineering — 2026-10-08

Fresh baseline source: `761a1bd92071aa40892024bd25480a6a570cb65b`, exported before edits into `outputs/editorial-baseline-site/`. Both batches used the recorded runtime **Node v24.14.0**, Chromium **153.0.8010.12**, Windows, the same `https://gbet.mn` export, gzip strict local server, disabled cache/fresh contexts and reduced motion. Desktop: 1440×900, loopback, unthrottled. Mobile: 390×844, DPR 1, 4× CPU, 150ms latency, 1.6Mbps down / 0.75Mbps up. No build or browser QA ran concurrently with measurement. These are controlled local laboratory observations, not field Core Web Vitals or statistical proof of improvement.

Each device/locale/route has five before and five after loads: **40 before + 40 after**, plus **20 after-only schematic loads**. Menu interaction remains identical to the baseline. The comparison script checks matching runtime/browser/configuration and sample counts. The first baseline desktop MN home sample was 4592ms; it is retained in the raw data and range, not discarded.

### Home/detail LCP — ms, median (min–max)

| Device | Locale / route | Baseline | Current | Median change |
| --- | --- | ---: | ---: | ---: |
| Desktop | MN home | 136 (132–4592) | 136 (120–512) | 0.0% |
| Desktop | MN Ikh Tamir | 140 (120–160) | 108 (104–120) | −22.9% |
| Desktop | EN home | 152 (124–164) | 128 (120–136) | −15.8% |
| Desktop | EN Ikh Tamir | 132 (108–168) | 104 (92–136) | −21.2% |
| Mobile | MN home | 2800 (2664–2816) | 2736 (2712–2796) | −2.3% |
| Mobile | MN Ikh Tamir | 2600 (2596–2624) | 2596 (2572–2608) | −0.2% |
| Mobile | EN home | 2728 (2704–2744) | 2712 (2688–2784) | −0.6% |
| Mobile | EN Ikh Tamir | 2592 (2576–2612) | 2588 (2540–2604) | −0.2% |

**All eight cases pass the maximum 5% median regression gate.** The absolute 2500ms LCP target remains unmet in all four mobile home/detail cases. Desktop differences and small mobile changes should not be generalized to real hosting or devices. Source image resolution and existing framework/runtime remain unchanged.

### Current sampled menu INP — ms

| Device | Locale / route | Median (min–max) | Samples |
| --- | --- | ---: | ---: |
| Desktop | MN home | 32 (32–32) | 3/5 |
| Desktop | MN Ikh Tamir | Unavailable | 0/5 |
| Desktop | EN home | 32 (32–32) | 1/5 |
| Desktop | EN Ikh Tamir | Unavailable | 0/5 |
| Mobile | MN home | 40 (24–40) | 5/5 |
| Mobile | MN Ikh Tamir | 32 (24–40) | 5/5 |
| Mobile | EN home | 24 (24–56) | 5/5 |
| Mobile | EN Ikh Tamir | 32 (24–40) | 5/5 |

Every measured current home/detail CLS value is **0**. All observed menu INP samples are within 200ms; missing samples remain null, not zero.

### Schematic interaction — after-only, five loads per case

These runs visit `/innovation/` and select piers → foundations → deck, checking the selected control and SVG state. They are a different route and interaction, not a before/after comparison.

| Device / locale | LCP ms, median (min–max) | INP ms, median (min–max) | INP samples | CLS max |
| --- | ---: | ---: | ---: | ---: |
| Desktop MN | 92 (92–204) | 32 (32–48) | 5/5 | 0 |
| Desktop EN | 88 (76–108) | 32 (32–32) | 5/5 | 0 |
| Mobile MN | 2620 (2596–2628) | 24 (24–24) | 5/5 | 0 |
| Mobile EN | 2616 (2572–2700) | 24 (24–24) | 5/5 | 0 |

Schematic sampled interaction and CLS meet their 200ms / 0.1 targets. Its mobile LCP also exceeds 2500ms. This measurement does not certify all interactions or a real-user session.

Raw evidence: `outputs/performance-editorial-before.json`, `outputs/performance-editorial-after.json`, `outputs/performance-editorial-schematic.json`, `outputs/editorial-performance-comparison.json` and their `editorial-*-performance.log` files. Reproduce the comparison with:

```sh
node scripts/compare-ui-performance.mjs outputs/performance-editorial-before.json outputs/performance-editorial-after.json outputs/editorial-performance-comparison.json
```

Use `QA_REPORT_TAG=editorial-after QA_LAB_RUNS=5` for the default menu batch and add `QA_LAB_INTERACTION=schematic` with a different tag for the diagram. Clear that interaction variable before a home/detail comparison. Preserve fresh baselines and distinct report paths; do not overwrite an unfavorable batch or cherry-pick individual runs. All reports remain ignored local artifacts. Publication was separately requested on 2026-10-08; deployment/live smoke evidence belongs in `outputs/deployment-release-editorial.json` and does not turn these lab measurements into field results.

## UI refinement — 2026-10-06

The new comparison uses a fresh production baseline from deployed source `a83d557c713d77a3ae5eb0a8cfcbb2bebece27f1`, captured before the UI edits. It does not reuse the earlier October 3 batch. Both new batches used Node v24.19.0, Chromium 153.0.8010.12, the same custom-domain export, fresh contexts/disabled cache, reduced motion, gzip strict local static server, and the fixed desktop/mobile conditions below. No build or browser QA ran in parallel with measurement. Each case has five before and five after loads: 40 per batch, 80 total, plus 20 separate after-only native-accordion loads.

### LCP — milliseconds, median (min–max)

| Device  | Locale / route      |   Fresh baseline |    UI refinement | Median change |
| ------- | ------------------- | ---------------: | ---------------: | ------------: |
| Desktop | MN home             |    128 (120–536) |    132 (124–476) |         +3.1% |
| Desktop | MN Ikh Tamir detail |    124 (108–152) |     116 (92–152) |         −6.5% |
| Desktop | EN home             |    140 (124–144) |    136 (120–160) |         −2.9% |
| Desktop | EN Ikh Tamir detail |     124 (88–132) |    108 (100–120) |        −12.9% |
| Mobile  | MN home             | 2796 (2760–3556) | 2776 (2768–2792) |         −0.7% |
| Mobile  | MN Ikh Tamir detail | 2580 (2552–2604) | 2592 (2572–2604) |         +0.5% |
| Mobile  | EN home             | 2732 (2624–2764) | 2716 (2680–2752) |         −0.6% |
| Mobile  | EN Ikh Tamir detail | 2592 (2576–2616) | 2592 (2580–2596) |          0.0% |

All eight median changes meet the planned maximum 5% regression gate. The 2500ms absolute LCP target remains unmet for all four mobile home/detail cases. Small changes and variable desktop timings do not demonstrate statistical significance or real-device improvement. No framework or image-loading change was made to force a score.

### Sampled menu INP — milliseconds

| Device  | Locale / route      | After median (min–max) | Samples |
| ------- | ------------------- | ---------------------: | ------: |
| Desktop | MN home             |             32 (32–32) |     1/5 |
| Desktop | MN Ikh Tamir detail |            Unavailable |     0/5 |
| Desktop | EN home             |             32 (32–32) |     3/5 |
| Desktop | EN Ikh Tamir detail |             32 (32–32) |     1/5 |
| Mobile  | MN home             |             32 (24–40) |     4/5 |
| Mobile  | MN Ikh Tamir detail |             24 (24–40) |     5/5 |
| Mobile  | EN home             |             24 (24–40) |     5/5 |
| Mobile  | EN Ikh Tamir detail |             24 (24–24) |     5/5 |

The after-only service measurements open/close the native bridge rehabilitation row on `/expertise/`. Desktop MN INP is unavailable (0/5); desktop EN is 32ms (1/5). Mobile MN/EN are both 24ms with 5/5 samples each. Service-page mobile LCP medians are 2424/2416ms; these are different pages, not improvements to home/detail. Every measured final CLS value is 0. All observed menu/disclosure INP samples are within 200ms; unavailable samples remain null. These interactions are not a full-session or field INP certification.

Evidence: `outputs/performance-ui-before.json`, `outputs/performance-ui-after.json`, `outputs/performance-ui-accordion.json`, `outputs/ui-performance-comparison.json` and their logs. Re-run the comparison with `node scripts/compare-ui-performance.mjs`; it validates matching browser/runtime/configuration and the five-run gates. For a new before/after experiment, generate fresh batches with distinct `QA_REPORT_TAG` values and pass their paths as the two script arguments. Keep reports ignored and outside the published artifact.

## Historical editorial redesign — 2026-10-03

The production export at starting commit `0fa7805111ac50715749dfc5287184dfafc1bb0e` was snapshotted before edits. Each locale/route/device combination ran five times before and five times after the redesign: 40 loads per batch, 80 in total. The final after batch ran without parallel build/lint work. No analytics or field monitoring is installed.

## Fixed laboratory settings

- Node v24.19.0; Chromium 153.0.8010.12; Windows; gzip strict local static server; custom-domain export configuration `https://gbet.mn`.
- Desktop: 1440x900; loopback; unthrottled. Mobile: 390x844; 4x CPU; 150ms latency; 1.6Mbps down / 0.75Mbps up.
- Fresh context and disabled cache per run. Reduced motion enabled. Mobile viewport uses browser DPR 1; this is a controlled synthetic test, not a real phone.
- Interaction: navigation menu open/close after fonts and network settle. INP covers this sampled interaction only; a missing event stays null and is excluded from its median.

## LCP — milliseconds, median (min–max)

| Device  | Locale / route        | Before, five runs | After, five runs | After target ≤2500 ms |
| ------- | --------------------- | ----------------: | ---------------: | --------------------- |
| Desktop | MN / Home             |     256 (192–688) |    196 (180–768) | Met                   |
| Desktop | MN / Ikh Tamir detail |     424 (204–484) |    232 (184–312) | Met                   |
| Desktop | EN / Home             |     224 (204–236) |    248 (184–328) | Met                   |
| Desktop | EN / Ikh Tamir detail |     208 (200–280) |    292 (256–348) | Met                   |
| Mobile  | MN / Home             |  3736 (3676–4144) | 2900 (2764–3044) | Not met               |
| Mobile  | MN / Ikh Tamir detail |  4656 (4640–4744) | 2820 (2740–2988) | Not met               |
| Mobile  | EN / Home             |  3752 (3460–4004) | 2796 (2728–2864) | Not met               |
| Mobile  | EN / Ikh Tamir detail |  4416 (4352–4504) | 2772 (2596–2856) | Not met               |

Mobile medians improved across all four cases. Desktop EN home/detail medians increased from 224/208 ms to 248/292 ms; do not describe every route/device as faster. Desktop values have substantial local-run variance. These samples do not establish statistical significance or real-host behavior.

## CLS and menu INP

| Device  | Locale / route        |    Before CLS median (range) |     After CLS median (range) | Before INP ms (range) | After INP ms (range) | After INP samples |
| ------- | --------------------- | ---------------------------: | ---------------------------: | --------------------: | -------------------: | ----------------: |
| Desktop | MN / Home             | 0.000000 (0.000000–0.000016) | 0.000000 (0.000000–0.000000) |            24 (24–32) |           28 (24–32) |               4/5 |
| Desktop | MN / Ikh Tamir detail | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) |            24 (24–32) |           24 (24–24) |               4/5 |
| Desktop | EN / Home             | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) |            24 (24–32) |           32 (24–32) |               4/5 |
| Desktop | EN / Ikh Tamir detail | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) |            32 (24–32) |           32 (32–32) |               2/5 |
| Mobile  | MN / Home             | 0.000023 (0.000023–0.000023) | 0.000000 (0.000000–0.000000) |           96 (64–104) |          96 (64–104) |               5/5 |
| Mobile  | MN / Ikh Tamir detail | 0.000000 (0.000000–0.000296) | 0.000000 (0.000000–0.000000) |           96 (80–112) |          80 (40–112) |               5/5 |
| Mobile  | EN / Home             | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) |           80 (48–104) |           80 (64–88) |               5/5 |
| Mobile  | EN / Ikh Tamir detail | 0.000000 (0.000000–0.000000) | 0.000000 (0.000000–0.000000) |           80 (80–104) |           80 (80–80) |               5/5 |

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
