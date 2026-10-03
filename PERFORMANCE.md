# Performance observation — 2026-10-03

Run `node scripts/measure-lab.mjs` after a custom-domain build. The script uses a gzip local static server and Chromium, opens/closes the navigation menu and writes the measured values and resource timing to ignored `outputs/performance-lab.json`. No analytics or field monitoring is installed.

| Latest observation | Desktop | Mobile |
|---|---:|---:|
| LCP | 492 ms | 3168 ms |
| CLS | 0 | <0.001 |
| INP | No sample | 32 ms |

Desktop used 1440×900 and unthrottled local loopback. Mobile used 390×844, 4× CPU slowdown, 150 ms latency, 1.6 Mbps download and 0.75 Mbps upload. The LCP element was the headline. A very short interaction may not produce an INP event; missing values are stored as null, never zero.

The mobile LCP target of 2500 ms is not met. The observed CLS and sampled menu INP are below their respective 0.1 / 200 ms targets. These individual synthetic observations do not certify real-user Core Web Vitals or every interaction. Real hosting, devices and repeated measurements can differ.

The full-height mobile hero now uses the original 1846×1153 source, because the earlier 900×562 derivative visibly upscaled in the portrait layout. An authorized portrait crop with sufficient effective pixels can reduce download size. The smaller-asset baseline observed 2916 ms mobile LCP; the framework-only candidate observed 2924 ms. See [COMPATIBILITY.md](COMPATIBILITY.md) for that separate comparison.

Further optimization should preserve the image quality and font coverage while investigating the initial framework bundle and heading/font paint. Do not add a weak WebGL hero to demonstrate technology.
