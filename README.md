# Jargonaut: Universal Language Interpretation Platform

Jargonaut is a universal interpretation platform that recognizes and translates specialized or context-heavy language (jargon, slang, dialects, idioms, and ancient texts) into plain, understandable English.

---

## 📂 Project Structure

This repository is a monorepo containing both the Web prototype client and the native Android app:

*   📂 **`/web`**: The premium, client-side glassmorphic web application.
    *   `index.html` - Core layout and dual-pane workspace.
    *   `style.css` - Custom styling tokens, animations, and PDF print stylesheet.
    *   `app.js` - Dynamic controllers for translations, heatmap, and the Study Quiz.
    *   `database.js` - Preloaded terms database and fuzzy suggestion engine.
    *   `gemini-api.js` - REST client for Google AI Studio API calls.
*   📂 **`/android`**: The native Android application built with Jetpack Compose and Kotlin.
    *   `app/src/main/java/com/example/jargonaut/`
        *   `MainActivity.kt` - Main edge-to-edge entry point.
        *   `data/Database.kt` - Local SQLite/SharedPreferences cache and Levenshtein suggestion logic.
        *   `net/GeminiApi.kt` - Direct HTTP client for API connections.
        *   `ui/Screens.kt` - Jetpack Compose views (Decipher, Lexicon, Quiz, Settings) featuring 3D card-flip animations.

---

## 🌟 Key Features

1.  **Cognitive Dial**: Dynamic reading complexity selection (Pro Lite, Layman, ELI5).
2.  **Analogizer**: Generates contextual analogies across three themes: **LEGO blocks, Cooking, and Sports**.
3.  **Jargon Density Heatmap**: Glows red to highlight concentrated clusters of complex words.
4.  **Fuzzy suggestions**: Corrects typos using Levenshtein distance suggestions.
5.  **Offline Lexicon**: Instant translations for preloaded terms without an active internet connection.
6.  **Utility Tools (Web)**: Speech-to-text voice dictation, drag-and-drop document parser, and high-contrast PDF printing.
7.  **3D Study Flashcards**: Flipping cards with multiple-choice questions to review terms and track scores.

---

## 🚀 How to Run

### Web Client
Double-click `/web/index.html` to run locally inside any browser, or spin up a dev server:
```bash
npx http-server ./web -p 8080
```

### Android App
Ensure your emulator is running or a device is connected, then compile and deploy:
```bash
android run --project_dir=./android
```
Or find the precompiled APK at `/android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🛠️ Built With
`Kotlin`, `Jetpack Compose`, `JavaScript (ES6)`, `HTML5`, `CSS3 (Vanilla)`, `Gemini API`, `SharedPreferences`, `LocalStorage`, `Web Speech API`, `Levenshtein Matrix`
