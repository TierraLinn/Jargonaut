# Jargonaut: Universal Language Interpretation Platform

This document serves as the project submission profile, detailing the story of **Jargonaut**.

---

## Inspiration

Language has always been a double-edged sword. While specialized vocabularies allow experts to communicate with extreme precision, they also build invisible walls that exclude the public. 

*   A patient receives a medical report reading *"Idiopathic Myocardial Infarction"* and feels only panic.
*   A startup founder tries to navigate a contract laden with *"Force Majeure"* clauses and dense legal jargon.
*   A student struggles to read medieval texts, biblical passages, or internet subculture slang.

We realized that current translation tools are built for converting one national language to another (e.g., English to Spanish), but **nothing was built to translate language *within* a language**—moving from impenetrable complexity to everyday clarity. We built Jargonaut to bridge this gap: not to define words, but to translate understanding.

---

## What it does

Jargonaut is a universal interpretation platform that detects and translates specialized language across 20+ categories (Medical, Legal, Biblical, Medieval, Slang, Dialects, Tech, etc.) into plain English. 

Key features include:
1.  **The Cognitive Dial**: A slider that dynamically shifts reading complexity:
    *   **Pro Lite**: Keeps original text but adds definitions inline in parentheses.
    *   **Layman**: Standard everyday English.
    *   **ELI5 (Explain Like I'm 5)**: Extremely simple words using customized metaphors (**LEGO bricks, Cooking, or Sports**).
2.  **Jargon Density Heatmap**: Visualizes clusters of difficult terms in glowing shades of red.
3.  **Fuzzy search Lexicon**: A searchable glossary featuring Levenshtein-driven "Did You Mean?" suggestion chips for typos.
4.  **Utility Tools**: Native speech-to-text dictation, drag-and-drop document parsing (`.txt`/`.md`/`.json`), and one-click Side-by-Side Clarity PDF Report exporting.
5.  **Study Arena**: A gamified study station with 3D card-flip animations and mcq-choices to review terms and build streaks.

---

## How we built it

We built Jargonaut using a layer-by-layer architectural workflow:

1.  **The Web Prototype**: Designed a premium, serverless glassmorphism frontend using **HTML5**, **Vanilla CSS**, and **JavaScript (ES6)**.
2.  **The AI Engine**: Directly integrated the **Gemini 2.5 Flash API** using structured JSON schemas to ensure reliable API responses.
3.  **The Fuzzy Finder**: Coded a native Levenshtein Distance matrix calculation for search queries. For a user input string \(a\) of length \(i\) and term \(b\) of length \(j\), the edit distance is computed as:
    \[
    \text{lev}_{a,b}(i,j) = \begin{cases}
      \max(i, j) & \text{if } \min(i,j) = 0, \\
      \min \begin{cases}
        \text{lev}_{a,b}(i-1,j) + 1 \\
        \text{lev}_{a,b}(i,j-1) + 1 \\
        \text{lev}_{a,b}(i-1,j-1) + \mathbb{I}(a_i \neq b_j)
      \end{cases} & \text{otherwise.}
    \end{cases}
    \]
4.  **The Native Android Companion**: Bootstrapped and compiled a native app using **Kotlin** and **Jetpack Compose**. It mirrors the web app's features (Decipher, Lexicon, 3D Quiz, and Settings) and caches custom vocabulary locally.

We also designed a mathematical metric for **Clarity (\(C\))** based on the density of detected jargon words \(J\) with category weight \(w_i\) over total words \(N\):
\[
C = \max\left(15, \,\, 100 - \sum_{i=1}^{k} \left( w_i \cdot \frac{J_i}{N} \cdot 100 \right)\right)
\]

---

## Challenges we ran into

*   **Contextual Slang Inversion**: Slang words often use standard vocabulary with inverted meanings (e.g., gamer *'aggro'* or surfing *'shred'*). Standard dictionary lookups failed. We solved this by using detailed system prompt engineering instructing Gemini to prioritize figurative, context-dependent usage.
*   **JSON Schema Reliability**: Dynamic highlights require the UI to know exactly where terms start and end. Free-form AI responses caused frequent layout breakage. We resolved this by forcing Gemini to output strict, structured JSON arrays that map directly to our frontend components.
*   **Android Dependency Conflicts**: Integrating heavy third-party JSON serialization libraries caused build failures in Gradle. We bypassed this by utilizing Android's built-in, native `org.json.JSONObject` class, resulting in a lightweight, robust build with zero external classpath dependencies.

---

## Accomplishments that we're proud of

*   **Beautiful Aesthetics**: Creating a premium, glassmorphic UI with smooth animations, custom progress gauges, and intuitive user controls on both web and Android.
*   **The Metaphor Analogizer**: Having the system dynamically generate analogies matching LEGOs, cooking, or sports, which makes abstract concepts immediately understandable.
*   **The 3D Card Flipping Animation**: Writing a custom Jetpack Compose graphics pipeline that smoothly rotates quiz flashcards along the Y-axis.

---

## What we learned

*   **The Power of Structured Output**: Constraining model outputs using JSON schemas completely eliminates the need for complex, post-process regex parsing.
*   **Modular Architecture**: Keeping our glossary database completely decoupled from the UI enabled us to reuse the exact same core lexicon logic across both Javascript and Kotlin.

---

## What's next for Jargonaut

*   **On-Device AI Integration**: Run localized, offline translations using **Gemini Nano** directly on the mobile device.
*   **Visual Deciphering (OCR)**: Allow users to snap a photo of a document (like a physical menu or a printed patient summary) and overlay translations directly on the image.
*   **Vocabulary Sharing**: Create team workspaces where colleagues can share a custom lexicon database.

---

## Built With (Tags)

Here are the 25 tags for the platform submission profile:

`kotlin`, `jetpack-compose`, `javascript`, `css3`, `html5`, `gemini-api`, `google-ai-studio`, `android-sdk`, `android-cli`, `gradle`, `sharedpreferences`, `localstorage`, `web-speech-api`, `json-schema`, `rest-api`, `levenshtein-distance`, `markdown`, `latex`, `material-design-3`, `http-connection`, `git`, `android-emulator`, `node-js`, `artificial-intelligence`, `accessibility`

---

## Try It Out Links

*   **GitHub Repository**: `https://github.com/TierraLinn/Jargonaut`
*   **Web Live Demo (GitHub Pages)**: `https://tierralinn.github.io/Jargonaut/web/`
*   **Android APK Download (GitHub Releases)**: `https://github.com/TierraLinn/Jargonaut/releases/download/v1.0/app-debug.apk`
