package com.example.jargonaut.net

import com.example.jargonaut.data.Analogy
import com.example.jargonaut.data.Term
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets

data class ApiTranslationResult(
    val detectedCategory: String,
    val complexityScore: Int,
    val professionalTranslation: String,
    val laymanTranslation: String,
    val eli5Translation: String,
    val highlightedTerms: List<Term>
)

object GeminiApi {
    private const val MODEL = "gemini-2.5-flash"

    suspend fun translateText(text: String, domainHint: String?, apiKey: String): ApiTranslationResult = withContext(Dispatchers.IO) {
        val urlStr = "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent?key=$apiKey"
        
        val systemInstruction = """
            You are Jargonaut, a Universal Language Interpretation Engine.
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

            You must respond ONLY with a valid JSON object matching the requested schema.
        """.trimIndent()

        val prompt = """
            Input Text: "$text"
            Context Hint: ${domainHint ?: "Auto-detect"}
        """.trimIndent()

        // Create Payload JSON manually using org.json
        val requestJson = JSONObject()
        val contentsArray = JSONArray()
        val contentObj = JSONObject()
        val partsArray = JSONArray()

        partsArray.put(JSONObject().put("text", systemInstruction))
        partsArray.put(JSONObject().put("text", prompt))
        contentObj.put("role", "user")
        contentObj.put("parts", partsArray)
        contentsArray.put(contentObj)
        requestJson.put("contents", contentsArray)

        // Set response schema to match requested output
        val generationConfig = JSONObject()
        generationConfig.put("responseMimeType", "application/json")
        
        val responseSchema = JSONObject()
        responseSchema.put("type", "OBJECT")
        
        val properties = JSONObject()
        properties.put("detectedCategory", JSONObject().put("type", "STRING"))
        properties.put("complexityScore", JSONObject().put("type", "INTEGER"))
        properties.put("professionalTranslation", JSONObject().put("type", "STRING"))
        properties.put("laymanTranslation", JSONObject().put("type", "STRING"))
        properties.put("eli5Translation", JSONObject().put("type", "STRING"))
        
        val highlightedTermsSchema = JSONObject()
        highlightedTermsSchema.put("type", "ARRAY")
        
        val itemSchema = JSONObject()
        itemSchema.put("type", "OBJECT")
        val itemProps = JSONObject()
        itemProps.put("term", JSONObject().put("type", "STRING"))
        itemProps.put("category", JSONObject().put("type", "STRING"))
        itemProps.put("literalMeaning", JSONObject().put("type", "STRING"))
        itemProps.put("laymanExplanation", JSONObject().put("type", "STRING"))
        itemProps.put("sportsAnalogy", JSONObject().put("type", "STRING"))
        itemProps.put("cookingAnalogy", JSONObject().put("type", "STRING"))
        itemProps.put("legoAnalogy", JSONObject().put("type", "STRING"))
        
        val requiredItemProps = JSONArray()
        requiredItemProps.put("term")
        requiredItemProps.put("category")
        requiredItemProps.put("literalMeaning")
        requiredItemProps.put("laymanExplanation")
        requiredItemProps.put("sportsAnalogy")
        requiredItemProps.put("cookingAnalogy")
        requiredItemProps.put("legoAnalogy")
        
        itemSchema.put("properties", itemProps)
        itemSchema.put("required", requiredItemProps)
        highlightedTermsSchema.put("items", itemSchema)
        
        properties.put("highlightedTerms", highlightedTermsSchema)
        responseSchema.put("properties", properties)
        
        val requiredProps = JSONArray()
        requiredProps.put("detectedCategory")
        requiredProps.put("complexityScore")
        requiredProps.put("professionalTranslation")
        requiredProps.put("laymanTranslation")
        requiredProps.put("eli5Translation")
        requiredProps.put("highlightedTerms")
        
        responseSchema.put("required", requiredProps)
        generationConfig.put("responseSchema", responseSchema)
        requestJson.put("generationConfig", generationConfig)

        val url = URL(urlStr)
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.setRequestProperty("Content-Type", "application/json")
        conn.doOutput = true
        conn.connectTimeout = 15000
        conn.readTimeout = 15000

        OutputStreamWriter(conn.outputStream, StandardCharsets.UTF_8).use { writer ->
            writer.write(requestJson.toString())
            writer.flush()
        }

        val responseCode = conn.responseCode
        if (responseCode != HttpURLConnection.HTTP_OK) {
            val errStream = conn.errorStream
            val errText = errStream?.bufferedReader()?.use { it.readText() } ?: conn.responseMessage
            throw Exception("API Error ($responseCode): $errText")
        }

        val jsonResponse = conn.inputStream.bufferedReader().use { it.readText() }
        val rootObj = JSONObject(jsonResponse)
        val textResponse = rootObj.getJSONArray("candidates")
            .getJSONObject(0)
            .getJSONObject("content")
            .getJSONArray("parts")
            .getJSONObject(0)
            .getString("text")

        val resultObj = JSONObject(textResponse)
        val category = resultObj.getString("detectedCategory")
        val score = resultObj.getInt("complexityScore")
        val proTrans = resultObj.getString("professionalTranslation")
        val laymanTrans = resultObj.getString("laymanTranslation")
        val eli5Trans = resultObj.getString("eli5Translation")
        
        val termsArray = resultObj.getJSONArray("highlightedTerms")
        val termsList = mutableListOf<Term>()
        
        for (i in 0 until termsArray.length()) {
            val tObj = termsArray.getJSONObject(i)
            termsList.add(
                Term(
                    term = tObj.getString("term"),
                    category = tObj.getString("category"),
                    literal = tObj.getString("literalMeaning"),
                    layman = tObj.getString("laymanExplanation"),
                    eli5 = tObj.getString("laymanExplanation"), // Fallback duplicate
                    professional = tObj.getString("laymanExplanation"), // Fallback duplicate
                    analogies = Analogy(
                        lego = tObj.getString("legoAnalogy"),
                        sports = tObj.getString("sportsAnalogy"),
                        cooking = tObj.getString("cookingAnalogy")
                    )
                )
            )
        }

        ApiTranslationResult(
            detectedCategory = category,
            complexityScore = score,
            professionalTranslation = proTrans,
            laymanTranslation = laymanTrans,
            eli5Translation = eli5Trans,
            highlightedTerms = termsList
        )
    }
}
