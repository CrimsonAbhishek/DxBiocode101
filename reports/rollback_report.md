# Rollback Report

This report outlines the optimizations that were reverted during the architectural review and the justification for their removal.

## 1. `requestIdleCallback` for `index.json`
**Action:** Reverted
**File:** `shared.js`
**Justification:** The optimization wrapped the `fetch()` call for `index.json` in a `requestIdleCallback` along with a `setTimeout` fallback and a `hasLoadedDB` state variable. While this technically defers the fetch off the critical rendering path for Lighthouse, it introduced speculative complexity and unidiomatic JavaScript. Given the small size of the JSON and the low likelihood of blocking the main thread, a standard asynchronous `fetch()` is objectively more readable and maintainable.

## 2. Global Namespace Pollution (Scroll Observer)
**Action:** Reverted (Rewritten)
**File:** `shared.js`
**Justification:** The scroll layout optimization fixed thrashing but declared variables (`ticking`, `scrollY`, `scrollHeight`, `winInnerHeight`) directly in the global scope of `shared.js`. This is a poor architectural practice that could conflict with future scripts. It was rewritten into a self-contained IIFE (Immediately Invoked Function Expression) to protect the global namespace.

## 3. Inline GPU Keyframes
**Action:** Reverted (Moved)
**File:** `index.html`
**Justification:** The GPU-accelerated animations (`transform` over `box-shadow`) were a valid improvement, but the keyframes (`@keyframes badgePulseGPU` and `@keyframes gradientShiftGPU`) were injected directly into inline `<style>` tags in `index.html`. This creates duplicate CSS and violates the separation of concerns. They were reverted from `index.html` and cleanly added to `shared.css`.

## 4. Temporary Python Scripts
**Action:** Reverted (Deleted)
**Files:** `add_main_tag.py`, `defer_js.py`, `optimize_logo.py`, etc.
**Justification:** These were one-off scripts generated to rapidly apply optimizations across the project. They served their purpose but should not persist in a production Git repository.
