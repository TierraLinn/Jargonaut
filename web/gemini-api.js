// Jargonaut Gemini API Client

async function translateWithGemini(text, domainHint, apiKey) {
  if (!apiKey) {
    throw new Error("Gemini API Key is required.");
  }

  const model = "gemini-2.5-flash"; // Use fast and powerful 2.5 flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemInstruction = `You are Jargonaut, a Universal Language Interpretation Engine.
Your task is to analyze the input text, automatically detect the primary language category/context, evaluate its reading clarity/complexity (0-100 scale, where 100 is completely clear and 0 is impenetrable), and decipher it into three distinct levels:
1. Professional/Original (keeps the terms but clarifies definitions inline)
2. Layman (standard everyday English)
3. ELI5 (Explain Like I'm 5, using very simple words and basic ideas)

Categories you must detect and classify inputs into:
- Medical Jargon
- Legal Jargon
- Financial Jargon
- Insurance Jargon
- Engineering Jargon
- Technology Jargon
- Scientific Jargon
- Academic Jargon
- Military Jargon
- Biblical Language
- Medieval Language
- Historical Phrasing
- Idioms
- Slang
- Regional Dialects
- Internet Language
- Pop Culture
- Gaming Jargon
- Music Jargon
- Custom Vocabulary

IMPORTANT: You must identify specific jargon/slang/idiomatic/ancient/scriptural phrases within the text. For each phrase, you must:
- Detect its category from the list above (format with emojis e.g., '⛪ Biblical Language', '🛡️ Insurance Jargon', '🎮 Gaming Jargon').
- Explain its literal dictionary meaning vs. its figurative, context-dependent meaning (e.g., explaining that 'gird up your loins' is about preparing for tough action, not literal clothing belts; or surfer 'shred' is about skilled wave riding).
- Generate three customized analogies: a sports analogy, a cooking analogy, and a LEGO/toy analogy.

You must respond ONLY with a valid JSON object matching the requested schema.`;

  const prompt = `Input Text: "${text}"
${domainHint ? `Context Hint (User selected): ${domainHint}` : "Context Hint: Auto-detect"}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: systemInstruction },
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          detectedCategory: { 
            type: "STRING", 
            description: "The primary category/context detected (e.g., '🏄 Surfer Slang', '⚖️ Legal Jargon', '💬 Gen-Z Slang', '🚀 Corporate Speak')" 
          },
          complexityScore: { 
            type: "INTEGER", 
            description: "A clarity score from 0 (very dense/obscure) to 100 (perfectly simple layman English)" 
          },
          professionalTranslation: { 
            type: "STRING", 
            description: "The translated text written in professional language, but with immediate parenthetical explanations next to difficult terms." 
          },
          laymanTranslation: { 
            type: "STRING", 
            description: "The text translated completely into standard, clear, everyday layman English." 
          },
          eli5Translation: { 
            type: "STRING", 
            description: "The text translated for a 5-year-old child, using simple analogies and high-level concepts." 
          },
          highlightedTerms: {
            type: "ARRAY",
            description: "A list of specific jargon, slang, idioms, or dialect phrases found in the original text that require explanation.",
            items: {
              type: "OBJECT",
              properties: {
                term: { type: "STRING", description: "The exact phrase or word found in the input text." },
                category: { type: "STRING", description: "The category of this specific term (e.g., 'Surfer Slang', 'Legal Jargon')." },
                literalMeaning: { type: "STRING", description: "The literal, raw meaning of the word (e.g. 'shred' = tearing to pieces)." },
                laymanExplanation: { type: "STRING", description: "The figurative, context-dependent definition in plain terms." },
                sportsAnalogy: { type: "STRING", description: "An analogy explaining this concept using sports rules or gameplay." },
                cookingAnalogy: { type: "STRING", description: "An analogy explaining this concept using ingredients, baking, or kitchen scenarios." },
                legoAnalogy: { type: "STRING", description: "An analogy explaining this concept using LEGO bricks or building toys." }
              },
              required: ["term", "category", "literalMeaning", "laymanExplanation", "sportsAnalogy", "cookingAnalogy", "legoAnalogy"]
            }
          }
        },
        required: ["detectedCategory", "complexityScore", "professionalTranslation", "laymanTranslation", "eli5Translation", "highlightedTerms"]
      }
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText || response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Translation failed", error);
    throw error;
  }
}
