# Deep Internalizer

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-State-orange)](https://github.com/pmndrs/zustand)
[![Dexie](https://img.shields.io/badge/Dexie-IndexedDB-blue)](https://dexie.org/)
[![PWA](https://img.shields.io/badge/PWA-Supported-green)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

> **"The goal of reading is not to get through more books, but to let fewer things pass through your soul without leaving a trace."**

**Deep Internalizer** is a specialized English reading platform built on cognitive psychology principles. It transforms reading from a passive activity into a structured, multi-layered "internalization" process, ensuring every word and concept is anchored in its original context.

---

## 🏗️ The Internalization Engine (Architecture)

Deep Internalizer operates on a **Dual-Layer Funnel** architecture designed to manage cognitive load and maximize retention.

### Layer 0: Global Strategic Map
*   **Core Thesis Architecture**: Uses local LLMs (via Ollama) to synthesize the entire document into a single, high-impact thesis statement.
*   **Semantic Segmentation**: Instead of arbitrary character limits, the document is broken down into *thematic chunks* (3-8 sentences each) using semantic analysis.
*   **Strategic Navigation**: A high-level visual grid allowing learners to see the "territory" before diving into the "map."

### Layer 1: Tactical Immersion Cycle (4-Step Loop)
Every semantic chunk must pass through a strict pedagogical circuit:
1.  **Macro Context**: Reviewing the chunk's summary within the global framework.
2.  **Vocabulary Building**: Extracting 5-8 key terms. Feature: **X-Ray Context** (Long-press 👁️ to see exact sentence origin).
3.  **Phonetic Patterning**: Training the "inner ear" with IPA transcriptions and local TTS demonstrations.
4.  **Flow State Execution**: Continuous reading exercise with real-time WPM (Words Per Minute) tracking to smooth out saccadic movements.

---

## 🧠 Core Engineering Principles

### 1. Zero-Trust Persistence (Zustand + Dexie.js)
The app uses a hybrid state management system:
*   **Zustand (Runtime)**: Handles UI state, loading flags, and transient navigation.
*   **Dexie.js (Infrastructure)**: An IndexedDB wrapper ensuring 100% of the reading session, document data, and vocabulary progress is stored locally for offline-first reliability.
*   **Auto-Healing Sessions**: If the app crashes or refreshes, the `restoreSession` hook brings you back to the exact chunk and step you were on.

### 2. Launch Interception (Vocabulary Debt)
Based on the **"Debtless Learning"** philosophy, the app introduces a mandatory barrier:
*   **Semantic Debt**: Any word marked as "Keep" becomes a debt.
*   **The Interception Layer**: Upon startup, if debt exceeds threshold, the main app is locked.
*   **A/B Context Verification**: Debt is cleared only by identifying the word in two contexts: (A) Original phrase and (B) AI-generated new context.

### 3. Local-First AI Integration
*   **Ollama (Brain)**: Directly accesses `llama3.1` or equivalent for deterministic JSON extraction of keywords and summaries.
*   **Kokoro-TTS (Voice)**: A dedicated Python sidecar service running a high-quality 82M parameter model for natural, low-latency speech synthesis.

---

### 4. Verified Performance (2026 Benchmarks)
System functionality is verified via automated Playwright testing pipelines:
| Metric | Benchmark | Status |
| :--- | :--- | :--- |
| **App Shell Load** | < 300ms | 🟢 Instant |
| **Local AI Inference** | ~7.0s | 🟡 Nominal (Thesis Generation) |
| **Asset Delivery** | 100% | 🟢 No Network Errors |
| **Offline Capability** | Full | 🟢 PWA + IndexedDB |

---

## 🎨 Design System (Magazine Aesthetic)

The UI is built focused on a **Premium Magazine Style** using Vanilla CSS variables:

*   **Colors**: A sophisticated dark palette (`#0a0a0f`) with vibrant gradients (`Indigo` to `Violet`).
*   **Typography**: Optimized for reading with `Inter` for interface and system-specific monospaced fonts for phonetic details.
*   **Interactions**: Micro-animations for button hovers, card elevations, and loading spinners that feel "alive."

---

## 🛠️ Technical Setup

### Prerequisites
- **Node.js**: 18.x or above.
- **Python**: 3.11+ (for TTS).
- **Ollama**: Running locally with `llama3.1` pulled.

### Frontend
```bash
npm install
npm run dev
```

### TTS Backend (FastAPI + Kokoro)
The TTS service provides an OpenAI-compatible `/v1/audio/speech` endpoint.
```bash
./scripts/start_tts.sh
# Server runs on http://localhost:8000
```

### Environment Variables (.env.local)
```env
VITE_OLLAMA_API=http://localhost:11434/api/generate
VITE_TTS_API=http://localhost:8000/v1/audio/speech
```

---

## 📂 Project Structure

- `src/components/Layer0`: Global map and strategic overview components.
- `src/components/Layer1`: The 4-step immersion loop logic.
- `src/services/chunkingService.js`: The prompt engineering bridge to Ollama.
- `src/db/schema.js`: The "Source of Truth" for IndexedDB storage.
- `scripts/tts_server/`: Python-based high-fidelity speech generation.

---

## 📜 License
MIT - Designed for personal growth and deep literacy.
