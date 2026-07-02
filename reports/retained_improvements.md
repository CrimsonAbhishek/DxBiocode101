# Retained Improvements Report

This document highlights the optimizations that were intentionally preserved during the architectural review. These changes represent robust, production-quality engineering that enhances the repository without introducing technical debt.

## 1. SVG Optimization (`logo.svg`)
**Action:** Kept
**Justification:** The primary SVG `logo.svg` was inflated to 4.5MB because it contained an oversized, uncompressed base64 PNG. By extracting, resizing, standardizing the compression, and running SVGO, the file size was reduced to 13KB. This is an objective, massive improvement to payload size and LCP (Largest Contentful Paint) that requires zero maintenance overhead and adds zero complexity to the codebase.

## 2. Scroll Thrashing Mitigation
**Action:** Kept (Rewritten)
**Justification:** The original scroll implementation continuously read `scrollHeight` and triggered layout thrashing on every scroll event. Modifying this to cache dimensions on `resize` and batched DOM writes via `requestAnimationFrame` is a textbook performance improvement. The logic was retained but refactored into a clean, isolated IIFE to prevent global namespace pollution.

## 3. GPU-Accelerated Animations
**Action:** Kept (Moved)
**Justification:** Animating `box-shadow` and `background-position` forces the browser's CPU to recalculate layout and paint on every frame. Swapping these for `transform` and `opacity` offloads the work to the GPU via compositing. This vastly reduces battery drain and frame drops. The logic was preserved but strictly relocated to `shared.css` to maintain architectural separation.

## 4. Font Loading Optimization
**Action:** Kept
**Justification:** Explicitly requesting only the used font weights (`400, 500, 600, 700, 800` for Inter, and `700, 800` for Space Grotesk) instead of blanket-requesting 12+ weights trims unnecessary network overhead. This is a configuration fix, not a code hack, and is highly maintainable.

## 5. Critical Rendering Path (`defer`)
**Action:** Kept
**Justification:** Adding the `defer` attribute to `shared.js` prevents it from blocking the HTML parser. This is a fundamental standard of modern web performance and does not complicate the script logic.

## 6. Accessibility & Semantic HTML (`<main>`)
**Action:** Kept
**Justification:** Ensuring the primary content of all pages is wrapped in a `<main>` tag and fixing `<h2>`/`<h3>` hierarchy gaps directly benefits screen-reader users and SEO. It adds semantic value without any downside.

## 7. Explicit Caching Policies
**Action:** Kept
**Justification:** Adding explicit `Cache-Control` max-age headers for static assets in `vercel.json` and `.htaccess` is an essential backend best practice. It ensures efficient repeat-visits and leverages browser caching mechanisms properly.
