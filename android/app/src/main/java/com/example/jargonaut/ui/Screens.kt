package com.example.jargonaut.ui

import android.content.Context
import android.widget.Toast
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.jargonaut.data.Analogy
import com.example.jargonaut.data.GlossaryDatabase
import com.example.jargonaut.data.Term
import com.example.jargonaut.net.ApiTranslationResult
import com.example.jargonaut.net.GeminiApi
import kotlinx.coroutines.launch

// Styling Palette Constants
val DeepSlate = Color(0xFF080C14)
val CardBg = Color(0xFF121929)
val ElectricViolet = Color(0xFF8B5CF6)
val CyberCyan = Color(0xFF06B6D4)
val WarningAmber = Color(0xFFF59E0B)
val LightGray = Color(0xFF9CA3AF)

// ==========================================
// 1. DECIPHER SCREEN (Translator)
// ==========================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DecipherScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var inputPhrase by remember { mutableStateOf("") }
    var domainHint by remember { mutableStateOf<String?>(null) }
    var translationResult by remember { mutableStateOf<ApiTranslationResult?>(null) }
    var cognitiveLevel by remember { mutableStateOf(2) } // 1=Pro, 2=Layman, 3=ELI5
    var isHeatmapActive by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }

    // Bottom Sheet Analogy State
    var showBottomSheet by remember { mutableStateOf(false) }
    var selectedTerm by remember { mutableStateOf<Term?>(null) }

    // Load API key from prefs
    val sharedPrefs = context.getSharedPreferences("jargonaut_prefs", Context.MODE_PRIVATE)
    val apiKey = remember { mutableStateOf(sharedPrefs.getString("api_key", "") ?: "") }

    LaunchedEffect(Unit) {
        apiKey.value = sharedPrefs.getString("api_key", "") ?: ""
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DeepSlate)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Section Header
        Column {
            Text(
                text = "Universal Decipherer",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "Translate dense jargon, slang, or dialects into layman's terms.",
                fontSize = 14.sp,
                color = LightGray
            )
        }

        // Input Card
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBg),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = inputPhrase,
                    onValueChange = { inputPhrase = it },
                    placeholder = { Text("Paste or type phrasing...", color = Color.Gray) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ElectricViolet,
                        unfocusedBorderColor = Color.DarkGray
                    )
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Category Dropdown simulated via basic menu
                    var dropdownExpanded by remember { mutableStateOf(false) }
                    Box {
                        Button(
                            onClick = { dropdownExpanded = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray)
                        ) {
                            Text(domainHint ?: "🔮 Auto-Detect")
                        }
                        DropdownMenu(
                            expanded = dropdownExpanded,
                            onDismissRequest = { dropdownExpanded = false }
                        ) {
                            listOf("Medical Jargon", "Legal Jargon", "Tech Jargon", "Financial Jargon", "Slang", "Biblical Language").forEach { cat ->
                                DropdownMenuItem(
                                    text = { Text(cat) },
                                    onClick = {
                                        domainHint = cat
                                        dropdownExpanded = false
                                    }
                                )
                            }
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {
                                inputPhrase = ""
                                translationResult = null
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray)
                        ) {
                            Text("Clear")
                        }

                        Button(
                            onClick = {
                                if (inputPhrase.trim().isEmpty()) return@Button
                                isLoading = true
                                coroutineScope.launch {
                                    try {
                                        if (apiKey.value.isNotEmpty()) {
                                            // AI Mode
                                            val res = GeminiApi.translateText(inputPhrase, domainHint, apiKey.value)
                                            translationResult = res
                                        } else {
                                            // Fallback local translator
                                            val res = performLocalTranslation(context, inputPhrase, domainHint)
                                            translationResult = res
                                        }
                                    } catch (e: Exception) {
                                        Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                                    } finally {
                                        isLoading = false
                                    }
                                }
                            },
                            enabled = !isLoading,
                            colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet)
                        ) {
                            if (isLoading) {
                                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                            } else {
                                Text("Decipher")
                            }
                        }
                    }
                }
            }
        }

        // Cognitive Dial Slider Center
        translationResult?.let { result ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBg),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Cognitive Dial", color = Color.White, fontWeight = FontWeight.Bold)
                        Text(
                            text = when (cognitiveLevel) {
                                1 -> "PRO LITE"
                                2 -> "LAYMAN"
                                else -> "ELI5"
                            },
                            color = CyberCyan,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Slider(
                        value = cognitiveLevel.toFloat(),
                        onValueChange = { cognitiveLevel = it.toInt() },
                        valueRange = 1f..3f,
                        steps = 1
                    )

                    // Clarity Gauge & Category badge
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Small Circular Clarity score
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(60.dp)
                                .clip(CircleShape)
                                .border(
                                    2.dp,
                                    if (result.complexityScore >= 70) Color.Green else if (result.complexityScore >= 40) WarningAmber else Color.Red,
                                    CircleShape
                                )
                                .background(Color.Black)
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    result.complexityScore.toString(),
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                )
                                Text("Clarity", color = Color.Gray, fontSize = 8.sp)
                            }
                        }

                        Column {
                            Text(
                                result.detectedCategory,
                                color = ElectricViolet,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            Text(
                                "Detected context. Hover/tap terms to explain.",
                                color = Color.LightGray,
                                fontSize = 11.sp
                            )
                        }
                    }

                    Button(
                        onClick = { isHeatmapActive = !isHeatmapActive },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isHeatmapActive) Color.Red else Color.DarkGray
                        ),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("🔥 Toggle Jargon Heatmap")
                    }
                }
            }

            // Output Card
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBg),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Deciphered Phrasing", color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.Bold)

                    val displayText = when (cognitiveLevel) {
                        1 -> result.professionalTranslation
                        2 -> result.laymanTranslation
                        else -> result.eli5Translation
                    }

                    // Format text annotated with highlights
                    val annotatedString = buildAnnotatedString {
                        var currentIndex = 0
                        val textLower = displayText.lowercase()

                        // Simple highlight implementation
                        // We find the indices of translated terms or original terms matching the result list
                        val sortedTerms = result.highlightedTerms.sortedBy { displayText.lowercase().indexOf(it.term.lowercase()) }
                        
                        sortedTerms.forEach { termObj ->
                            val termIndex = textLower.indexOf(termObj.term.lowercase(), currentIndex)
                            if (termIndex != -1) {
                                // Append prefix
                                append(displayText.substring(currentIndex, termIndex))
                                
                                // Push annotated term style
                                pushStringAnnotation(tag = "TERM", annotation = termObj.term)
                                withStyle(
                                    style = SpanStyle(
                                        color = if (isHeatmapActive) Color.Red else ElectricViolet,
                                        textDecoration = TextDecoration.Underline,
                                        fontWeight = FontWeight.Bold,
                                        background = if (isHeatmapActive) Color.Red.copy(alpha = 0.15f) else ElectricViolet.copy(alpha = 0.1f)
                                    )
                                ) {
                                    append(displayText.substring(termIndex, termIndex + termObj.term.length))
                                }
                                pop()
                                currentIndex = termIndex + termObj.term.length
                            }
                        }
                        if (currentIndex < displayText.length) {
                            append(displayText.substring(currentIndex))
                        }
                    }

                    ClickableText(
                        text = annotatedString,
                        style = TextStyle(color = Color.White, fontSize = 16.sp, lineHeight = 24.sp),
                        onClick = { offset ->
                            annotatedString.getStringAnnotations(tag = "TERM", start = offset, end = offset)
                                .firstOrNull()?.let { annotation ->
                                    val matched = result.highlightedTerms.find { it.term.lowercase() == annotation.item.lowercase() }
                                    if (matched != null) {
                                        selectedTerm = matched
                                        showBottomSheet = true
                                    }
                                }
                        }
                    )
                }
            }
        }
    }

    // Modal Sheet representation via clean overlay Dialog in Compose
    if (showBottomSheet && selectedTerm != null) {
        val term = selectedTerm!!
        Dialog(onDismissRequest = { showBottomSheet = false }) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1626)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(term.category, color = ElectricViolet, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(term.term, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        }
                        IconButton(onClick = { showBottomSheet = false }) {
                            Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                        }
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Literal Meaning:", color = CyberCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text(term.literal, color = Color.White, fontSize = 14.sp)
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Layman Explanation:", color = CyberCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text(term.layman, color = Color.White, fontSize = 14.sp, modifier = Modifier
                            .background(Color.White.copy(alpha = 0.03f))
                            .padding(8.dp)
                            .clip(RoundedCornerShape(4.dp)))
                    }

                    // Analogizer Theme Tabs
                    var activeTheme by remember { mutableStateOf("lego") }
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("The Analogizer", color = LightGray, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("lego", "sports", "cooking").forEach { theme ->
                                Button(
                                    onClick = { activeTheme = theme },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (activeTheme == theme) ElectricViolet.copy(alpha = 0.2f) else Color.DarkGray,
                                        contentColor = if (activeTheme == theme) ElectricViolet else Color.White
                                    )
                                ) {
                                    Text(theme.uppercase())
                                }
                            }
                        }

                        val analogyText = when (activeTheme) {
                            "lego" -> term.analogies?.lego ?: "Lego description."
                            "sports" -> term.analogies?.sports ?: "Sports description."
                            else -> term.analogies?.cooking ?: "Cooking description."
                        }

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.Black.copy(alpha = 0.3f))
                                .padding(16.dp)
                                .clip(RoundedCornerShape(8.dp))
                        ) {
                            Text(analogyText, color = Color.White, fontSize = 13.sp)
                        }
                    }
                }
            }
        }
    }
}

// Local regex processor matching the JS performLocalTranslation
fun performLocalTranslation(context: Context, text: String, hint: String?): ApiTranslationResult {
    val all = GlossaryDatabase.getAllTerms(context)
    val found = mutableListOf<Term>()
    
    all.forEach { t ->
        val regex = Regex("\\b${Regex.escape(t.term)}\\b", RegexOption.IGNORE_CASE)
        if (regex.containsMatchIn(text)) {
            found.add(t)
        }
    }

    val score = maxOf(15, 100 - (found.size * 20))
    val category = if (found.isNotEmpty()) found[0].category else hint ?: "🧠 General Context"

    var proText = text
    var laymanText = text
    var eli5Text = text

    found.forEach { t ->
        val regex = Regex("\\b${Regex.escape(t.term)}\\b", RegexOption.IGNORE_CASE)
        proText = proText.replace(regex, "${t.term} (${t.literal})")
        laymanText = laymanText.replace(regex, t.layman)
        eli5Text = eli5Text.replace(regex, t.eli5)
    }

    return ApiTranslationResult(
        detectedCategory = category,
        complexityScore = score,
        professionalTranslation = proText,
        laymanTranslation = laymanText,
        eli5Translation = eli5Text,
        highlightedTerms = found
    )
}


// ==========================================
// 2. LEXICON SCREEN (Glossary)
// ==========================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LexiconScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var activeCategory by remember { mutableStateOf("all") }
    var showAddModal by remember { mutableStateOf(false) }

    // Re-load glossary list
    var glossaryList by remember { mutableStateOf(GlossaryDatabase.getAllTerms(context)) }
    
    fun refreshList() {
        glossaryList = GlossaryDatabase.getAllTerms(context)
    }

    // Detail Dialog State
    var showDetailDialog by remember { mutableStateOf(false) }
    var selectedTerm by remember { mutableStateOf<Term?>(null) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DeepSlate)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Jargonaut Lexicon", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Text("Create custom words or read definitions.", fontSize = 14.sp, color = LightGray)
            }
            Button(
                onClick = { showAddModal = true },
                colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet)
            ) {
                Text("+ Custom")
            }
        }

        // Search Box
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search terms...", color = Color.Gray) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = Color.Gray) },
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                focusedBorderColor = ElectricViolet,
                unfocusedBorderColor = Color.DarkGray
            )
        )

        // Fuzzy Finder Banner
        val searchResult = remember(searchQuery, glossaryList) {
            if (searchQuery.trim().isEmpty()) null else GlossaryDatabase.findTerm(context, searchQuery)
        }

        searchResult?.let { result ->
            if (result.match == null && result.suggestions.isNotEmpty()) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = WarningAmber.copy(alpha = 0.15f)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text("Did you mean: ", color = WarningAmber, fontWeight = FontWeight.Bold)
                        result.suggestions.forEach { suggestion ->
                            Text(
                                text = suggestion.term + " ",
                                color = Color.White,
                                textDecoration = TextDecoration.Underline,
                                modifier = Modifier
                                    .padding(horizontal = 4.dp)
                                    .clickable {
                                        searchQuery = suggestion.term
                                    }
                            )
                        }
                    }
                }
            }
        }

        // Category scroll chips
        val categories = listOf("all", "Medical Jargon", "Legal Jargon", "Tech Jargon", "⚓ Custom")
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(categories) { cat ->
                FilterChip(
                    selected = activeCategory == cat,
                    onClick = { activeCategory = cat },
                    label = { Text(cat.uppercase()) }
                )
            }
        }

        // Glossary list view
        val finalTerms = remember(searchQuery, activeCategory, glossaryList, searchResult) {
            val baseList = if (searchQuery.trim().isEmpty()) {
                glossaryList
            } else {
                if (searchResult?.match != null) listOf(searchResult.match) else searchResult?.suggestions ?: emptyList()
            }

            baseList.filter { t ->
                when (activeCategory) {
                    "all" -> true
                    "⚓ Custom" -> t.isCustom
                    else -> t.category == activeCategory
                }
            }
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(finalTerms) { term ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = CardBg),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            selectedTerm = term
                            showDetailDialog = true
                        }
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Text(
                                term.category.take(12) + "..",
                                color = CyberCyan,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                            if (term.isCustom) {
                                IconButton(
                                    onClick = {
                                        GlossaryDatabase.deleteCustomTerm(context, term.term)
                                        refreshList()
                                    },
                                    modifier = Modifier.size(16.dp)
                                ) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.Red, modifier = Modifier.size(12.dp))
                                }
                            }
                        }
                        Text(term.term, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text(term.layman.take(50) + "...", color = LightGray, fontSize = 12.sp)
                    }
                }
            }
        }
    }

    // Modal details dialog
    if (showDetailDialog && selectedTerm != null) {
        val term = selectedTerm!!
        Dialog(onDismissRequest = { showDetailDialog = false }) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1626)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(term.category, color = ElectricViolet, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(term.term, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        }
                        IconButton(onClick = { showDetailDialog = false }) {
                            Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                        }
                    }

                    Text(term.layman, color = Color.White, fontSize = 14.sp)
                }
            }
        }
    }

    // Add Custom Word Dialog Modal
    if (showAddModal) {
        var addTerm by remember { mutableStateOf("") }
        var addCategory by remember { mutableStateOf("General Custom Term") }
        var addLayman by remember { mutableStateOf("") }
        var addEli5 by remember { mutableStateOf("") }
        var addAnalogy by remember { mutableStateOf("") }

        Dialog(onDismissRequest = { showAddModal = false }) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1626)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("Add Custom Term", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)

                    OutlinedTextField(
                        value = addTerm,
                        onValueChange = { addTerm = it },
                        label = { Text("Term Name") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = addLayman,
                        onValueChange = { addLayman = it },
                        label = { Text("Layman Explanation") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = addEli5,
                        onValueChange = { addEli5 = it },
                        label = { Text("ELI5 (Explain Like I'm 5)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = addAnalogy,
                        onValueChange = { addAnalogy = it },
                        label = { Text("LEGO Metaphor analogy") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        TextButton(onClick = { showAddModal = false }) {
                            Text("Cancel", color = Color.Gray)
                        }
                        Button(
                            onClick = {
                                if (addTerm.isEmpty() || addLayman.isEmpty()) return@Button
                                val newTObj = Term(
                                    term = addTerm,
                                    category = addCategory,
                                    literal = "Custom user word.",
                                    layman = addLayman,
                                    eli5 = if (addEli5.isEmpty()) addLayman else addEli5,
                                    professional = addLayman,
                                    analogies = Analogy(
                                        lego = if (addAnalogy.isEmpty()) "Like adding building blocks." else addAnalogy,
                                        sports = "A custom house rule match.",
                                        cooking = "A pinch of custom spice."
                                    ),
                                    isCustom = true
                                )
                                GlossaryDatabase.addCustomTerm(context, newTObj)
                                refreshList()
                                showAddModal = false
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet)
                        ) {
                            Text("Save")
                        }
                    }
                }
            }
        }
    }
}


// ==========================================
// 3. STUDY QUIZ SCREEN
// ==========================================
@Composable
fun QuizScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    
    // Quiz state variables
    var score by remember { mutableStateOf(0) }
    var streak by remember { mutableStateOf(0) }
    var currentProgress by remember { mutableStateOf(1) }
    var isFlipped by remember { mutableStateOf(false) }

    // Shuffled Quiz deck
    val termsList = remember { GlossaryDatabase.getAllTerms(context) }
    val quizDeck = remember(termsList) {
        if (termsList.size >= 4) {
            termsList.shuffled().take(5)
        } else {
            emptyList()
        }
    }

    var currentIndex by remember { mutableStateOf(0) }
    var selectedAnswerIndex by remember { mutableStateOf<Int?>(null) }
    var hasAnswered by remember { mutableStateOf(false) }

    // Check deck constraints
    if (quizDeck.isEmpty()) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(DeepSlate)
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "You need at least 4 terms in the Lexicon to play the Quiz game. Please add some custom terms first!",
                color = Color.White,
                textAlign = TextAlign.Center
            )
        }
        return;
    }

    val currentTerm = quizDeck.getOrNull(currentIndex)
    
    // Generate answers array
    val answerOptions = remember(currentIndex, quizDeck) {
        if (currentTerm == null) return@remember emptyList()
        
        val correctAns = Pair(currentTerm.layman, true)
        val wrongPool = termsList.filter { it.term != currentTerm.term }.shuffled()
        val wrongOptions = wrongPool.take(minOf(3, wrongPool.size)).map { Pair(it.layman, false) }
        
        (listOf(correctAns) + wrongOptions).shuffled()
    }

    // Animation 3D Flip setup
    val rotation by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = tween(durationMillis = 500)
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DeepSlate)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Headers score tracker
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("SCORE", color = LightGray, fontSize = 10.sp)
                Text(score.toString(), color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("STREAK", color = LightGray, fontSize = 10.sp)
                Text("$streak 🔥", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("PROGRESS", color = LightGray, fontSize = 10.sp)
                Text("${currentIndex + 1} / 5", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
        }

        currentTerm?.let { term ->
            // 3D Card Graphic Layout
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .graphicsLayer {
                        rotationY = rotation
                        cameraDistance = 12f * density
                    }
                    .clickable { isFlipped = !isFlipped }
            ) {
                if (rotation <= 90f) {
                    // Front side
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBg),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp).fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(term.category, color = CyberCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(8.dp))
                            Text(term.term, color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(16.dp))
                            Text("Click Card to Flip / See Definition", color = Color.Gray, fontSize = 10.sp)
                        }
                    }
                } else {
                    // Back side (needs Y-axis inversion to look right)
                    Card(
                        colors = CardDefaults.cardColors(containerColor = ElectricViolet.copy(alpha = 0.15f)),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxSize()
                            .graphicsLayer { rotationY = 180f }
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp).fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("Definition", color = ElectricViolet, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(8.dp))
                            Text(term.layman, color = Color.White, fontSize = 14.sp, textAlign = TextAlign.Center)
                            Spacer(Modifier.height(12.dp))
                            Text(
                                "LEGO: " + (term.analogies?.lego ?: "modular bricks"),
                                color = LightGray,
                                fontSize = 11.sp,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            // Choices Grid
            Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                answerOptions.forEachIndexed { oIdx, opt ->
                    Button(
                        onClick = {
                            if (hasAnswered) return@Button
                            selectedAnswerIndex = oIdx
                            hasAnswered = true
                            if (opt.second) {
                                score += 1
                                streak += 1
                            } else {
                                streak = 0
                            }
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = when {
                                hasAnswered && opt.second -> Color.Green.copy(alpha = 0.2f)
                                hasAnswered && selectedAnswerIndex == oIdx && !opt.second -> Color.Red.copy(alpha = 0.2f)
                                else -> CardBg
                            },
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().border(
                            1.dp,
                            if (hasAnswered && opt.second) Color.Green else if (hasAnswered && selectedAnswerIndex == oIdx && !opt.second) Color.Red else Color.Transparent,
                            RoundedCornerShape(12.dp)
                        )
                    ) {
                        Text(
                            opt.first,
                            textAlign = TextAlign.Left,
                            modifier = Modifier.fillMaxWidth(),
                            fontSize = 13.sp
                        )
                    }
                }
            }

            // Navigation next controls
            if (hasAnswered) {
                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = {
                        isFlipped = false
                        selectedAnswerIndex = null
                        hasAnswered = false
                        currentIndex += 1
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Next Challenge")
                }
            }
        } ?: run {
            // End of Quiz State
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBg),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(32.dp).fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text("🎉 Session Completed!", color = Color.Green, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Text("You scored $score out of 5 points.", color = Color.White, fontSize = 16.sp)
                    Button(
                        onClick = {
                            score = 0
                            streak = 0
                            currentIndex = 0
                            selectedAnswerIndex = null
                            hasAnswered = false
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet)
                    ) {
                        Text("Reset Deck")
                    }
                }
            }
        }
    }
}


// ==========================================
// 4. SETTINGS SCREEN
// ==========================================
@Composable
fun SettingsScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val sharedPrefs = context.getSharedPreferences("jargonaut_prefs", Context.MODE_PRIVATE)

    var apiKeyInput by remember { mutableStateOf(sharedPrefs.getString("api_key", "") ?: "") }
    var isKeyVisible by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DeepSlate)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Column {
            Text("Configuration Panel", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Adjust Jargonaut APIs and keys.", fontSize = 14.sp, color = LightGray)
        }

        Card(
            colors = CardDefaults.cardColors(containerColor = CardBg),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Gemini API Key", color = Color.White, fontWeight = FontWeight.Bold)
                Text(
                    "Paste your Gemini API key from AI Studio to unlock dynamic translation mappings and heatmaps.",
                    color = LightGray,
                    fontSize = 12.sp
                )

                OutlinedTextField(
                    value = apiKeyInput,
                    onValueChange = { apiKeyInput = it },
                    placeholder = { Text("AIzaSy...") },
                    visualTransformation = if (isKeyVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        IconButton(onClick = { isKeyVisible = !isKeyVisible }) {
                            Icon(
                                imageVector = if (isKeyVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = "Toggle Visibility",
                                tint = Color.Gray
                            )
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ElectricViolet,
                        unfocusedBorderColor = Color.DarkGray
                    )
                )

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = {
                            if (apiKeyInput.trim().isEmpty()) {
                                Toast.makeText(context, "API Key cannot be empty.", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            sharedPrefs.edit().putString("api_key", apiKeyInput.trim()).apply()
                            Toast.makeText(context, "API Key saved successfully!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricViolet)
                    ) {
                        Text("Save Key")
                    }

                    Button(
                        onClick = {
                            apiKeyInput = ""
                            sharedPrefs.edit().remove("api_key").apply()
                            Toast.makeText(context, "API Key removed.", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray)
                    ) {
                        Text("Delete Key")
                    }
                }
            }
        }
    }
}
