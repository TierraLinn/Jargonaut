package com.example.jargonaut.data

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.min

data class Analogy(
    val lego: String,
    val sports: String,
    val cooking: String
)

data class Term(
    val term: String,
    val category: String,
    val literal: String,
    val layman: String,
    val eli5: String,
    val professional: String,
    val analogies: Analogy? = null,
    val isCustom: Boolean = false
)

object GlossaryDatabase {
    val defaultTerms = listOf(
        // MEDICAL
        Term(
            term = "Idiopathic",
            category = "Medical Jargon",
            literal = "Of unknown cause.",
            layman = "A disease or condition that arises spontaneously or for which the cause is unknown.",
            eli5 = "When a doctor says a sickness is 'idiopathic', it means they don't know why you got sick.",
            professional = "Denoting any disease or condition which arises spontaneously or for which the cause is unknown.",
            analogies = Analogy(
                lego = "It's like a LEGO tower falling down suddenly when no one was touching it or shaking the table.",
                sports = "It's like a referee calling a foul but nobody, including the referee, knows what rule was broken.",
                cooking = "It's like a cake collapsing in the oven even though you followed the recipe perfectly."
            )
        ),
        Term(
            term = "Myocardial Infarction",
            category = "Medical Jargon",
            literal = "Heart muscle death due to lack of blood.",
            layman = "A heart attack, which happens when blood flow to part of the heart is blocked.",
            eli5 = "A heart attack. The pipes bringing blood to the heart get clogged, and part of the heart muscle gets hurt.",
            professional = "Necrosis of a portion of cardiac muscle caused by obstruction in a coronary artery.",
            analogies = Analogy(
                lego = "It's like a blockage in a water-pump LEGO contraption that stops the motor from getting power.",
                sports = "It's like a stadium's entry gates getting completely blocked, so players can't get any water and collapse.",
                cooking = "It's like a fuel line getting clogged on a gas stove, causing the burner to go cold mid-cook."
            )
        ),
        // LEGAL
        Term(
            term = "In perpetuity",
            category = "Legal Jargon",
            literal = "Forever.",
            layman = "For an unlimited period of time; forever or indefinitely.",
            eli5 = "Forever and ever. Like a promise that never, ever stops.",
            professional = "Continuing forever; legally bound without an expiration date.",
            analogies = Analogy(
                lego = "It's like glueing your LEGO blocks together so they can never be pulled apart.",
                sports = "It's like a game with no timer that keeps playing forever.",
                cooking = "It's like a magical soup pot that never empties; it stays full forever."
            )
        ),
        Term(
            term = "Force Majeure",
            category = "Legal Jargon",
            literal = "Superior force.",
            layman = "An unexpected event, like a natural disaster, that prevents someone from fulfilling a contract.",
            eli5 = "An 'act of God' or super big accident (like a storm) that makes it impossible to do what you promised, so you don't get in trouble.",
            professional = "Unforeseeable circumstances that prevent someone from fulfilling a contract.",
            analogies = Analogy(
                lego = "It's like building a nice LEGO castle, but the family dog walks by and accidentally steps on it.",
                sports = "It's like a baseball game being cancelled because a massive thunderstorm floods the field.",
                cooking = "It's like trying to bake a cake, but a sudden power outage turns off the oven."
            )
        ),
        // TECH
        Term(
            term = "Spaghetti Code",
            category = "Tech Jargon",
            literal = "Tangled programming code.",
            layman = "Programming code that is messy, poorly structured, and tangled, making it very hard to understand or modify.",
            eli5 = "Code that is tangled up like a big bowl of noodles. If you pull one, the whole plate shakes, and you can't find where it starts.",
            professional = "Unstructured and difficult-to-maintain computer program source code, caused by complex control flow.",
            analogies = Analogy(
                lego = "It's like dumping all your LEGO pieces in a giant tangled heap and joining them randomly without instructions.",
                sports = "It's like a football game where there are no playbooks and players just run in random directions.",
                cooking = "It's like throwing twenty different ingredients into a blender without measuring, making it impossible to separate flavors."
            )
        ),
        // BIBLICAL
        Term(
            term = "Gird up your loins",
            category = "⛪ Biblical Language",
            literal = "Tie up your long robes with a belt.",
            layman = "To prepare oneself for action, hard work, or a difficult challenge.",
            eli5 = "Tying your shoes and getting ready to run really fast or do something hard.",
            professional = "An ancient cultural idiom meaning to gather up loose garments to enable swift movement, now used metaphorically to prepare for strenuous effort.",
            analogies = Analogy(
                lego = "It's like double-checking your baseplates and organizing blocks before building a giant castle.",
                sports = "It's like taping your ankles and putting on your mouthguard before heading onto the field.",
                cooking = "It's like putting on your apron and washing your hands before starting a massive feast."
            )
        ),
        // ANCIENT
        Term(
            term = "As above, so below",
            category = "📜 Ancient & Esoteric",
            literal = "What happens in heaven or higher realms happens on earth or lower realms.",
            layman = "The idea that the big universe (macrocosm) and the individual human (microcosm) are reflections of each other; patterns repeat at all scales.",
            eli5 = "Like how a tiny water droplet has the same shape and properties as the giant ocean.",
            professional = "A Hermetic maxim expressing the concept of correspondence, suggesting that the celestial and terrestrial realms, or the universal and individual spheres, operate under identical patterns.",
            analogies = Analogy(
                lego = "It's like how you can build a tiny LEGO house using the exact same structural joints you use for a skyscraper.",
                sports = "It's like how the strategy used by the professional coach in the NFL is the exact same strategy a kid uses in flag football.",
                cooking = "It's like how a tiny pinch of salt changes the flavor of a single bowl of soup in the exact same way it changes a 100-gallon vat."
            )
        ),
        // MILITARY
        Term(
            term = "FUBAR",
            category = "🪖 Military Jargon",
            literal = "Fouled Up Beyond All Recognition.",
            layman = "A situation that is completely ruined, broken down, or ruined beyond repair.",
            eli5 = "Something that is completely and totally broken, like a mud pie ran over by a lawnmower.",
            professional = "An acronym denoting a state of total disorder, failure, or damage beyond repair or recognition.",
            analogies = Analogy(
                lego = "It's like a LEGO spaceship getting stepped on by an elephant, leaving only dust.",
                sports = "It's like a play where the quarterback fumbles, the ball bounces off three referees, and the other team scores.",
                cooking = "It's like dropping a three-tiered wedding cake down a flight of stairs."
            )
        ),
        // GAMING
        Term(
            term = "Aggro",
            category = "🎮 Gaming Jargon",
            literal = "Aggression.",
            layman = "Causing a hostile computer-controlled enemy to focus all their attention and attacks on your character.",
            eli5 = "Waving your hands and shouting at a monster so it chases you instead of your friends.",
            professional = "The state of hostile target threat generation, directing enemy AI attention to a specific player character.",
            analogies = Analogy(
                lego = "It's like waving a red flag at a LEGO bull model to make it crash into your shield.",
                sports = "It's like a defender in basketball waving their arms frantically in front of the shooter to block their view.",
                cooking = "It's like a boiling pot of milk rising up to overflow, requiring your immediate attention so it doesn't spill."
            )
        )
    )

    private const val PREFS_NAME = "jargonaut_prefs"
    private const val CUSTOM_TERMS_KEY = "custom_terms"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun getCustomTerms(context: Context): List<Term> {
        val prefs = getPrefs(context)
        val jsonStr = prefs.getString(CUSTOM_TERMS_KEY, null) ?: return emptyList()
        return try {
            val array = JSONArray(jsonStr)
            val list = mutableListOf<Term>()
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                val analogyObj = if (obj.has("analogies") && !obj.isNull("analogies")) {
                    val aObj = obj.getJSONObject("analogies")
                    Analogy(
                        lego = aObj.optString("lego", ""),
                        sports = aObj.optString("sports", ""),
                        cooking = aObj.optString("cooking", "")
                    )
                } else null

                list.add(
                    Term(
                        term = obj.getString("term"),
                        category = obj.getString("category"),
                        literal = obj.optString("literal", ""),
                        layman = obj.getString("layman"),
                        eli5 = obj.optString("eli5", ""),
                        professional = obj.optString("professional", ""),
                        analogies = analogyObj,
                        isCustom = obj.optBoolean("isCustom", false)
                    )
                )
            }
            list
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun getAllTerms(context: Context): List<Term> {
        return defaultTerms + getCustomTerms(context)
    }

    fun addCustomTerm(context: Context, term: Term): Boolean {
        val prefs = getPrefs(context)
        val current = getCustomTerms(context).filter { it.term.lowercase() != term.term.lowercase() }.toMutableList()
        current.add(term)
        return try {
            val array = JSONArray()
            current.forEach { item ->
                val obj = JSONObject()
                obj.put("term", item.term)
                obj.put("category", item.category)
                obj.put("literal", item.literal)
                obj.put("layman", item.layman)
                obj.put("eli5", item.eli5)
                obj.put("professional", item.professional)
                obj.put("isCustom", item.isCustom)
                if (item.analogies != null) {
                    val aObj = JSONObject()
                    aObj.put("lego", item.analogies.lego)
                    aObj.put("sports", item.analogies.sports)
                    aObj.put("cooking", item.analogies.cooking)
                    obj.put("analogies", aObj)
                }
                array.put(obj)
            }
            prefs.edit().putString(CUSTOM_TERMS_KEY, array.toString()).apply()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deleteCustomTerm(context: Context, termName: String): Boolean {
        val prefs = getPrefs(context)
        val current = getCustomTerms(context).filter { it.term.lowercase() != termName.lowercase() }
        return try {
            val array = JSONArray()
            current.forEach { item ->
                val obj = JSONObject()
                obj.put("term", item.term)
                obj.put("category", item.category)
                obj.put("literal", item.literal)
                obj.put("layman", item.layman)
                obj.put("eli5", item.eli5)
                obj.put("professional", item.professional)
                obj.put("isCustom", item.isCustom)
                if (item.analogies != null) {
                    val aObj = JSONObject()
                    aObj.put("lego", item.analogies.lego)
                    aObj.put("sports", item.analogies.sports)
                    aObj.put("cooking", item.analogies.cooking)
                    obj.put("analogies", aObj)
                }
                array.put(obj)
            }
            prefs.edit().putString(CUSTOM_TERMS_KEY, array.toString()).apply()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getLevenshteinDistance(a: String, b: String): Int {
        val dp = Array(a.length + 1) { IntArray(b.length + 1) }
        for (i in 0..a.length) dp[i][0] = i
        for (j in 0..b.length) dp[0][j] = j
        for (i in 1..a.length) {
            for (j in 1..b.length) {
                val cost = if (a[i - 1] == b[j - 1]) 0 else 1
                dp[i][j] = min(
                    min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost
                )
            }
        }
        return dp[a.length][b.length]
    }

    fun findTerm(context: Context, query: String): SearchResult {
        val clean = query.trim().lowercase()
        val all = getAllTerms(context)

        // Exact match
        val exact = all.find { it.term.lowercase() == clean }
        if (exact != null) return SearchResult(exact, emptyList())

        // Partial match
        val partials = all.filter { it.term.lowercase().contains(clean) }
        if (partials.isNotEmpty()) return SearchResult(null, partials)

        // Fuzzy match Levenshtein
        val suggestions = all.map { Pair(it, getLevenshteinDistance(clean, it.term.lowercase())) }
            .filter { it.second <= maxOf(3, it.first.term.length / 2) }
            .sortedBy { it.second }
            .map { it.first }

        return SearchResult(null, suggestions.take(3))
    }

    private const val PREMIUM_STATUS_KEY = "jargonaut_premium"
    private const val STRIPE_LINK_KEY = "jargonaut_stripe_link"
    private const val TRANSLATION_COUNT_KEY = "jargonaut_translation_count"

    fun isPremium(context: Context): Boolean {
        val prefs = getPrefs(context)
        return prefs.getBoolean(PREMIUM_STATUS_KEY, false)
    }

    fun setPremium(context: Context, status: Boolean) {
        val prefs = getPrefs(context)
        prefs.edit().putBoolean(PREMIUM_STATUS_KEY, status).apply()
    }

    fun getStripeLink(context: Context): String {
        val prefs = getPrefs(context)
        val link = prefs.getString(STRIPE_LINK_KEY, "") ?: ""
        return if (link.isEmpty()) "https://buy.stripe.com/aFa8wH3Wb82g2xRbb10V001" else link
    }

    fun setStripeLink(context: Context, url: String) {
        val prefs = getPrefs(context)
        prefs.edit().putString(STRIPE_LINK_KEY, url).apply()
    }

    fun getTranslationCount(context: Context): Int {
        val prefs = getPrefs(context)
        return prefs.getInt(TRANSLATION_COUNT_KEY, 0)
    }

    fun incrementTranslationCount(context: Context) {
        val prefs = getPrefs(context)
        val current = prefs.getInt(TRANSLATION_COUNT_KEY, 0)
        prefs.edit().putInt(TRANSLATION_COUNT_KEY, current + 1).apply()
    }
}

data class SearchResult(
    val match: Term?,
    val suggestions: List<Term>
)
