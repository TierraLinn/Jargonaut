// Jargonaut Client Application Logic

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  let appState = {
    apiKey: localStorage.getItem("jargonaut_api_key") || "",
    stripeLink: localStorage.getItem("jargonaut_stripe_link") || "https://buy.stripe.com/aFa8wH3Wb82g2xRbb10V001",
    isPremium: localStorage.getItem("jargonaut_premium") === "true",
    translationCount: parseInt(localStorage.getItem("jargonaut_translation_count") || "0"),
    currentTab: "decipher",
    activeTranslation: null, // Stores current translation results (local or AI)
    cognitiveLevel: 2, // 1: Pro, 2: Layman, 3: ELI5
    isHeatmapActive: false,
    quiz: {
      deck: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      currentQuestion: null
    }
  };

  // ==========================================
  // UI ELEMENTS
  // ==========================================
  
  // Navigation
  const navBtns = {
    decipher: document.getElementById("nav-btn-decipher"),
    explorer: document.getElementById("nav-btn-explorer"),
    quiz: document.getElementById("nav-btn-quiz"),
    settings: document.getElementById("nav-btn-settings")
  };
  const tabs = {
    decipher: document.getElementById("tab-decipher"),
    explorer: document.getElementById("tab-explorer"),
    quiz: document.getElementById("tab-quiz"),
    settings: document.getElementById("tab-settings")
  };

  // Status Badge
  const engineStatus = document.getElementById("engine-status");
  const engineStatusText = document.getElementById("engine-status-text");

  // Decipherer Tab
  const jargonInput = document.getElementById("jargon-input");
  const domainHint = document.getElementById("domain-hint");
  const btnDecipher = document.getElementById("btn-decipher");
  const btnClear = document.getElementById("btn-clear");
  const decipherOutput = document.getElementById("decipher-output");
  const btnCopy = document.getElementById("btn-copy");
  const btnVoice = document.getElementById("btn-voice");
  const btnUpload = document.getElementById("btn-upload");
  const fileSelector = document.getElementById("file-selector");
  const btnExportPdf = document.getElementById("btn-export-pdf");
  const btnListen = document.getElementById("btn-listen");
  const cognitiveDial = document.getElementById("cognitive-dial");
  const dialLevelLabel = document.getElementById("dial-level-label");
  const outputLevelBadge = document.getElementById("output-level-badge");
  const clarityScoreVal = document.getElementById("clarity-score-val");
  const gaugeClarityFill = document.getElementById("gauge-clarity-fill");
  const detectedCatBadge = document.getElementById("detected-cat-badge");
  const complexitySummary = document.getElementById("complexity-summary");
  const btnToggleHeatmap = document.getElementById("btn-toggle-heatmap");
  const historyItems = document.getElementById("history-items");

  // Explorer Tab
  const lexiconSearch = document.getElementById("lexicon-search");
  const didYouMeanBar = document.getElementById("did-you-mean-bar");
  const didYouMeanSuggestions = document.getElementById("did-you-mean-suggestions");
  const glossaryContainer = document.getElementById("glossary-container");
  const categoryTabContainer = document.getElementById("lexicon-category-tabs");
  const btnOpenAddModal = document.getElementById("btn-open-add-modal");

  // Modals
  const customTermModal = document.getElementById("custom-term-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCancelModal = document.getElementById("btn-cancel-modal");
  const customTermForm = document.getElementById("custom-term-form");

  const termDetailModal = document.getElementById("term-detail-modal");
  const btnCloseDetailModal = document.getElementById("btn-close-detail-modal");
  const btnAddToDeck = document.getElementById("btn-add-to-deck");

  // Quiz Tab
  const quizScore = document.getElementById("quiz-score");
  const quizStreak = document.getElementById("quiz-streak");
  const quizProgress = document.getElementById("quiz-progress");
  const quizCard = document.getElementById("quiz-card");
  const quizCardCategory = document.getElementById("quiz-card-category");
  const quizCardTerm = document.getElementById("quiz-card-term");
  const quizCardDefinition = document.getElementById("quiz-card-definition");
  const quizCardAnalogy = document.getElementById("quiz-card-analogy");
  const quizOptionsContainer = document.getElementById("quiz-options-container");
  const quizNextControls = document.getElementById("quiz-next-controls");
  const quizFeedbackText = document.getElementById("quiz-feedback-text");
  const btnNextQuestion = document.getElementById("btn-next-question");

  // Settings Tab
  const settingsApiKey = document.getElementById("settings-api-key");
  const btnToggleKeyVisibility = document.getElementById("btn-toggle-key-visibility");
  const btnSaveSettings = document.getElementById("btn-save-settings");
  const btnClearSettings = document.getElementById("btn-clear-settings");

  // Stripe & Upgrade Elements
  const settingsStripeLink = document.getElementById("settings-stripe-link");
  const btnSaveStripe = document.getElementById("btn-save-stripe");
  const upgradeModal = document.getElementById("upgrade-modal");
  const btnCloseUpgradeModal = document.getElementById("btn-close-upgrade-modal");
  const btnUpgradeCheckout = document.getElementById("btn-upgrade-checkout");
  const btnUpgradeCancel = document.getElementById("btn-upgrade-cancel");
  const premiumSidebarBadge = document.getElementById("premium-sidebar-badge");
  const premiumBadgeText = document.getElementById("premium-badge-text");
  const btnSidebarUpgrade = document.getElementById("btn-sidebar-upgrade");


  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    updateEngineStatusBadge();
    updatePremiumUI();
    checkUrlRedirectForPremium();
    setupNavigation();
    setupDecipherer();
    setupExplorer();
    setupQuiz();
    setupSettings();
    renderHistory();
  }

  // Update engine connection state
  function updateEngineStatusBadge() {
    if (appState.apiKey) {
      engineStatus.className = "status-badge connected";
      engineStatusText.textContent = "Gemini Connected";
      settingsApiKey.value = appState.apiKey;
    } else {
      engineStatus.className = "status-badge fallback";
      engineStatusText.textContent = "Local Fallback Mode";
      settingsApiKey.value = "";
    }
  }


  // ==========================================
  // NAVIGATION ROUTER
  // ==========================================
  function setupNavigation() {
    Object.keys(navBtns).forEach(key => {
      navBtns[key].addEventListener("click", () => {
        switchTab(key);
      });
    });
  }

  function switchTab(tabKey) {
    appState.currentTab = tabKey;
    
    // Update active nav button
    Object.keys(navBtns).forEach(key => {
      if (key === tabKey) {
        navBtns[key].classList.add("active");
      } else {
        navBtns[key].classList.remove("active");
      }
    });

    // Update active tab pane
    Object.keys(tabs).forEach(key => {
      if (key === tabKey) {
        tabs[key].classList.add("active");
      } else {
        tabs[key].classList.remove("active");
      }
    });

    // Lazy load tab contents if needed
    if (tabKey === "explorer") {
      renderGlossary();
    } else if (tabKey === "quiz") {
      startNewQuizSession();
    }
  }


  // ==========================================
  // DECIPHERER LOGIC (Universal Translator)
  // ==========================================
  function setupDecipherer() {
    // Translate action
    btnDecipher.addEventListener("click", handleDecipher);
    
    // Clear action
    btnClear.addEventListener("click", () => {
      jargonInput.value = "";
      decipherOutput.innerHTML = "Deciphered output with highlighted terms will appear here...";
      decipherOutput.classList.add("empty");
      btnCopy.disabled = true;
      btnExportPdf.disabled = true;
      btnListen.disabled = true;
      btnToggleHeatmap.disabled = true;
      resetClarityGauge();
      appState.activeTranslation = null;
    });

    // Copy action
    btnCopy.addEventListener("click", () => {
      if (!decipherOutput.classList.contains("empty")) {
        navigator.clipboard.writeText(decipherOutput.textContent.trim());
        const originalText = btnCopy.textContent;
        btnCopy.textContent = "Copied! ✓";
        btnCopy.style.borderColor = "var(--color-success)";
        btnCopy.style.color = "var(--color-success)";
        setTimeout(() => {
          btnCopy.textContent = originalText;
          btnCopy.style.borderColor = "";
          btnCopy.style.color = "";
        }, 2000);
      }
    });

    // Trigger file selection dialog
    btnUpload.addEventListener("click", () => {
      if (!appState.isPremium) {
        showUpgradeModal();
        return;
      }
      fileSelector.click();
    });

    // Read selected file
    fileSelector.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        jargonInput.value = event.target.result;
        fileSelector.value = ""; // Reset
      };
      reader.onerror = () => {
        alert("Error reading file.");
      };
      reader.readAsText(file);
    });

    // Enable drag and drop on input pane
    const inputPane = document.querySelector(".input-pane");
    inputPane.addEventListener("dragover", (e) => {
      e.preventDefault();
      inputPane.style.borderColor = "var(--color-primary)";
    });

    inputPane.addEventListener("dragleave", () => {
      inputPane.style.borderColor = "";
    });

    inputPane.addEventListener("drop", (e) => {
      e.preventDefault();
      inputPane.style.borderColor = "";
      if (!appState.isPremium) {
        showUpgradeModal();
        return;
      }
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".json"))) {
        const reader = new FileReader();
        reader.onload = (event) => {
          jargonInput.value = event.target.result;
        };
        reader.readAsText(file);
      } else {
        alert("Please drop a valid text file (.txt, .md, or .json).");
      }
    });

    // Voice Dictation using Web Speech API
    let recognition = null;
    let isRecording = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          jargonInput.value += (jargonInput.value ? " " : "") + finalTranscript;
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        stopRecording();
        alert("Voice recognition error: " + event.error);
      };

      recognition.onend = () => {
        stopRecording();
      };
    } else {
      btnVoice.style.display = "none"; // Hide button if not supported
    }

    btnVoice.addEventListener("click", () => {
      if (!appState.isPremium) {
        showUpgradeModal();
        return;
      }
      if (!recognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      if (isRecording) {
        recognition.stop();
      } else {
        startRecording();
      }
    });

    function startRecording() {
      isRecording = true;
      btnVoice.textContent = "🛑 Stop";
      btnVoice.style.backgroundColor = "var(--color-danger)";
      btnVoice.style.color = "#FFFFFF";
      recognition.start();
    }

    function stopRecording() {
      isRecording = false;
      btnVoice.textContent = "🎙️ Speak";
      btnVoice.style.backgroundColor = "";
      btnVoice.style.color = "";
    }

    // Export PDF Print Action
    btnExportPdf.addEventListener("click", () => {
      if (!appState.isPremium) {
        showUpgradeModal();
        return;
      }
      window.print();
    });

    // Listen TTS Action
    let isSpeaking = false;
    btnListen.addEventListener("click", () => {
      if (!appState.isPremium) {
        showUpgradeModal();
        return;
      }
      if (!('speechSynthesis' in window)) {
        alert("Text-to-speech is not supported in this browser.");
        return;
      }

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        stopSpeaking();
      } else {
        const textToSpeak = decipherOutput.textContent.trim();
        if (!textToSpeak) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        utterance.onend = () => {
          stopSpeaking();
        };

        utterance.onerror = (e) => {
          console.error("SpeechSynthesis error", e);
          stopSpeaking();
        };

        isSpeaking = true;
        btnListen.textContent = "⏹️ Stop";
        btnListen.style.borderColor = "var(--color-danger)";
        btnListen.style.color = "var(--color-danger)";
        
        window.speechSynthesis.speak(utterance);
      }
    });

    function stopSpeaking() {
      isSpeaking = false;
      btnListen.textContent = "🔊 Listen";
      btnListen.style.borderColor = "";
      btnListen.style.color = "";
    }

    // Heatmap trigger
    btnToggleHeatmap.addEventListener("click", () => {
      appState.isHeatmapActive = !appState.isHeatmapActive;
      if (appState.isHeatmapActive) {
        decipherOutput.classList.add("heatmap-mode");
        btnToggleHeatmap.classList.add("btn-primary");
        btnToggleHeatmap.classList.remove("btn-secondary");
      } else {
        decipherOutput.classList.remove("heatmap-mode");
        btnToggleHeatmap.classList.add("btn-secondary");
        btnToggleHeatmap.classList.remove("btn-primary");
      }
    });

    // Cognitive Dial Slider Change
    cognitiveDial.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      appState.cognitiveLevel = val;
      
      const labels = ["Pro Lite", "Layman", "ELI5"];
      dialLevelLabel.textContent = labels[val - 1];
      outputLevelBadge.textContent = labels[val - 1] + " Terms";

      if (appState.activeTranslation) {
        renderDecipheredOutput();
      }
    });
  }

  // Handle Translate Process
  async function handleDecipher() {
    const text = jargonInput.value.trim();
    if (!text) return;

    if (!appState.isPremium && appState.translationCount >= 3) {
      showUpgradeModal();
      return;
    }

    btnDecipher.disabled = true;
    btnDecipher.querySelector("span").textContent = "Decoding Phrase...";
    decipherOutput.innerHTML = '<div class="empty">Analyzing context and translation structures...</div>';
    decipherOutput.classList.add("empty");

    const selectedDomain = domainHint.value;

    try {
      if (appState.apiKey) {
        // AI Translation Mode
        const result = await translateWithGemini(text, selectedDomain, appState.apiKey);
        appState.activeTranslation = result;
      } else {
        // Fallback local translation mode
        appState.activeTranslation = performLocalTranslation(text, selectedDomain);
      }

      renderDecipheredOutput();
      updateClarityGauge(appState.activeTranslation.complexityScore);
      
      detectedCatBadge.textContent = appState.activeTranslation.detectedCategory || "General Phrasing";
      complexitySummary.textContent = `Clarity score is ${appState.activeTranslation.complexityScore}/100. We identified ${appState.activeTranslation.highlightedTerms.length} terms requiring translation.`;
      
      btnCopy.disabled = false;
      btnExportPdf.disabled = false;
      btnListen.disabled = false;
      btnToggleHeatmap.disabled = false;

      // Save to history
      saveToHistory(text, appState.activeTranslation.detectedCategory, appState.activeTranslation);

      // Increment limits if free user
      if (!appState.isPremium) {
        appState.translationCount++;
        localStorage.setItem("jargonaut_translation_count", appState.translationCount.toString());
        updatePremiumUI();
      }

    } catch (err) {
      decipherOutput.innerHTML = `<div class="empty" style="color: var(--color-danger)">Translation Error: ${err.message}. Check your API settings.</div>`;
      resetClarityGauge();
    } finally {
      btnDecipher.disabled = false;
      btnDecipher.querySelector("span").textContent = "Decipher Phrasing";
    }
  }

  // Perform a smart mock translation using database mappings
  function performLocalTranslation(text, hint) {
    const allTerms = getAllTerms();
    const foundTerms = [];
    
    // Scan for terms
    allTerms.forEach(t => {
      const escaped = t.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      if (regex.test(text)) {
        foundTerms.push(t);
      }
    });

    // If no terms found, check fuzzy matches as fallback
    let detectedCategory = "🧠 General Context";
    if (foundTerms.length > 0) {
      detectedCategory = foundTerms[0].category;
    } else if (hint) {
      detectedCategory = "🔮 " + hint + " Style";
    }

    // Deduct clarity score based on matches
    const score = Math.max(15, 100 - (foundTerms.length * 20));

    // Construct translation outputs
    let proText = text;
    let laymanText = text;
    let eli5Text = text;

    foundTerms.forEach(t => {
      const escaped = t.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

      proText = proText.replace(regex, `$& (${t.literal})`);
      laymanText = laymanText.replace(regex, t.layman);
      eli5Text = eli5Text.replace(regex, t.eli5);
    });

    // Map terms structure to fit API outputs
    const highlightedTerms = foundTerms.map(t => ({
      term: t.term,
      category: t.category,
      literalMeaning: t.literal,
      laymanExplanation: t.layman,
      sportsAnalogy: t.analogies?.sports || "Imagine trying to explain it as a penalty call where no rules make sense.",
      cookingAnalogy: t.analogies?.cooking || "Like throwing random ingredients in the oven.",
      legoAnalogy: t.analogies?.lego || t.eli5
    }));

    return {
      detectedCategory,
      complexityScore: score,
      professionalTranslation: proText,
      laymanTranslation: laymanText,
      eli5Translation: eli5Text,
      highlightedTerms
    };
  }

  // Render the deciphered output with highlights
  function renderDecipheredOutput() {
    const translation = appState.activeTranslation;
    if (!translation) return;

    let targetText = "";
    if (appState.cognitiveLevel === 1) {
      targetText = translation.professionalTranslation;
    } else if (appState.cognitiveLevel === 2) {
      targetText = translation.laymanTranslation;
    } else {
      targetText = translation.eli5Translation;
    }

    decipherOutput.classList.remove("empty");
    
    // Inject highlights
    // We replace highlighted terms with span tags.
    // In ELI5 and Layman mode, the exact jargon words might be rewritten, so we look for translated words, or simply map the jargon terms that were detected.
    // To make it look magical: we wrap whichever words match either the original term OR its translated layman equivalent so the user can click them!
    let markedText = targetText;
    
    translation.highlightedTerms.forEach(termObj => {
      // Escape
      const termEscaped = termObj.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regexOriginal = new RegExp(`\\b${termEscaped}\\b`, 'gi');
      
      // Also try to match the layman expression if it appears in the output
      const laymanEscaped = termObj.laymanExplanation.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // For short words/phrases, check if they exist
      const regexLayman = new RegExp(`\\b${laymanEscaped}\\b`, 'gi');

      // Replace in text safely
      if (regexOriginal.test(markedText)) {
        markedText = markedText.replace(regexOriginal, `<span class="jargon-term" data-term="${encodeURIComponent(termObj.term)}">$&</span>`);
      } else {
        // Fallback: replace a portion of the text that maps to it
        // Or find words containing components
        const words = termObj.term.split(" ");
        words.forEach(w => {
          if (w.length > 3) {
            const rx = new RegExp(`\\b${w}\\b`, 'gi');
            markedText = markedText.replace(rx, `<span class="jargon-term" data-term="${encodeURIComponent(termObj.term)}">$&</span>`);
          }
        });
      }
    });

    decipherOutput.innerHTML = markedText;

    // Attach click listeners to highlight terms
    const termSpans = decipherOutput.querySelectorAll(".jargon-term");
    termSpans.forEach(span => {
      span.addEventListener("click", (e) => {
        const termName = decodeURIComponent(e.currentTarget.getAttribute("data-term"));
        openTermDetail(termName);
      });
    });
  }

  // Clarity score gauge controller
  function updateClarityGauge(score) {
    clarityScoreVal.textContent = score;
    
    // Circle circumference = 2 * pi * r (r=40 -> 251.2)
    const circum = 251.2;
    const offset = circum - (score / 100) * circum;
    gaugeClarityFill.style.strokeDashoffset = offset;

    // Set gauge color based on score
    if (score >= 70) {
      gaugeClarityFill.style.stroke = "var(--color-success)";
    } else if (score >= 40) {
      gaugeClarityFill.style.stroke = "var(--color-warning)";
    } else {
      gaugeClarityFill.style.stroke = "var(--color-danger)";
    }
  }

  function resetClarityGauge() {
    clarityScoreVal.textContent = "--";
    gaugeClarityFill.style.strokeDashoffset = 251.2;
    gaugeClarityFill.style.stroke = "var(--color-secondary)";
    detectedCatBadge.textContent = "---";
    complexitySummary.textContent = "Input text complexity analysis will appear here after translation.";
  }


  // ==========================================
  // TRANSLATION HISTORY
  // ==========================================
  function saveToHistory(text, category, translationResult) {
    try {
      const history = JSON.parse(localStorage.getItem("jargonaut_history") || "[]");
      // Prevent duplicate texts in recent history
      const filtered = history.filter(item => item.text.toLowerCase() !== text.toLowerCase());
      
      filtered.unshift({
        text,
        category,
        translation: translationResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Keep only top 5
      localStorage.setItem("jargonaut_history", JSON.stringify(filtered.slice(0, 5)));
      renderHistory();
    } catch (e) {
      console.error(e);
    }
  }

  function renderHistory() {
    try {
      const history = JSON.parse(localStorage.getItem("jargonaut_history") || "[]");
      if (history.length === 0) {
        historyItems.innerHTML = '<p class="empty-state">No translation history yet.</p>';
        return;
      }

      historyItems.innerHTML = history.map((item, idx) => `
        <div class="history-card" data-index="${idx}">
          <div class="history-meta">
            <h4>"${item.text.length > 50 ? item.text.substring(0, 50) + "..." : item.text}"</h4>
            <span>Parsed at ${item.timestamp}</span>
          </div>
          <span class="history-badge">${item.category || "General"}</span>
        </div>
      `).join("");

      // Attach click events
      historyItems.querySelectorAll(".history-card").forEach(card => {
        card.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-index"));
          const selected = history[idx];
          
          jargonInput.value = selected.text;
          appState.activeTranslation = selected.translation;
          
          renderDecipheredOutput();
          updateClarityGauge(selected.translation.complexityScore);
          
          detectedCatBadge.textContent = selected.translation.detectedCategory || "General Context";
          complexitySummary.textContent = `Loaded from history. Clarity score is ${selected.translation.complexityScore}/100. We identified ${selected.translation.highlightedTerms.length} terms.`;
          
          btnCopy.disabled = false;
          btnExportPdf.disabled = false;
          btnListen.disabled = false;
          btnToggleHeatmap.disabled = false;
        });
      });
    } catch (e) {
      console.error(e);
    }
  }


  // ==========================================
  // GLOSSARY & LEXICON EXPLORER
  // ==========================================
  let activeExplorerCategory = "all";

  function setupExplorer() {
    // Search filter
    lexiconSearch.addEventListener("input", handleExplorerSearch);
    
    // Category click handler
    categoryTabContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("cat-tab")) {
        categoryTabContainer.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        activeExplorerCategory = e.target.getAttribute("data-category");
        renderGlossary();
      }
    });

    // Modal controls
    btnOpenAddModal.addEventListener("click", () => {
      customTermModal.classList.add("active");
    });

    btnCloseModal.addEventListener("click", () => {
      customTermModal.classList.remove("active");
      customTermForm.reset();
    });

    btnCancelModal.addEventListener("click", () => {
      customTermModal.classList.remove("active");
      customTermForm.reset();
    });

    // Form Submission
    customTermForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const term = document.getElementById("custom-term").value.trim();
      const category = document.getElementById("custom-category").value;
      const layman = document.getElementById("custom-layman").value.trim();
      const eli5 = document.getElementById("custom-eli5").value.trim() || layman;
      const analogyLego = document.getElementById("custom-analogy-lego").value.trim() || `It is like building bricks because it forms a modular piece of ${term}`;

      const newTermObj = {
        term,
        category,
        literal: "Custom user-defined term.",
        layman,
        eli5,
        professional: layman,
        analogies: {
          lego: analogyLego,
          sports: "Imagine scoring a goal in a custom set of house rules.",
          cooking: "A custom ingredient added to your secret recipe."
        },
        isCustom: true // Mark to allow deletion
      };

      const success = addCustomTerm(newTermObj);
      if (success) {
        customTermModal.classList.remove("active");
        customTermForm.reset();
        renderGlossary();
        
        // Show success alert
        alert(`Successfully added "${term}" to your custom lexicon!`);
      }
    });
  }

  // Renders vocabulary glossary
  function renderGlossary(filteredTerms = null) {
    const terms = filteredTerms || getAllTerms();
    
    // Filter by category tab
    const categoryFiltered = terms.filter(t => {
      if (activeExplorerCategory === "all") return true;
      if (activeExplorerCategory === "custom") return t.isCustom === true;
      return t.category === activeExplorerCategory;
    });

    if (categoryFiltered.length === 0) {
      glossaryContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
          No vocabulary entries found for this category.
        </div>`;
      return;
    }

    // Render cards
    glossaryContainer.innerHTML = categoryFiltered.map(t => `
      <div class="glossary-card" data-term="${encodeURIComponent(t.term)}">
        <div class="card-top">
          <span class="card-cat">${t.category}</span>
          ${t.isCustom ? `<button class="card-delete-btn" data-term="${encodeURIComponent(t.term)}" title="Delete Custom Term">&times;</button>` : ''}
        </div>
        <h3>${t.term}</h3>
        <p>${t.layman.length > 90 ? t.layman.substring(0, 90) + "..." : t.layman}</p>
        <span class="card-footer-tip">View Analogizer →</span>
      </div>
    `).join("");

    // Attach click events to card
    glossaryContainer.querySelectorAll(".glossary-card").forEach(card => {
      card.addEventListener("click", (e) => {
        // Prevent trigger if clicking delete button
        if (e.target.classList.contains("card-delete-btn")) return;
        const termName = decodeURIComponent(card.getAttribute("data-term"));
        openTermDetail(termName);
      });
    });

    // Attach click events to delete button
    glossaryContainer.querySelectorAll(".card-delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const termName = decodeURIComponent(btn.getAttribute("data-term"));
        if (confirm(`Are you sure you want to delete "${termName}" from your custom vocabulary?`)) {
          deleteCustomTerm(termName);
          renderGlossary();
        }
      });
    });
  }

  // Handle Search input
  function handleExplorerSearch() {
    const query = lexiconSearch.value.trim();
    if (!query) {
      didYouMeanBar.classList.add("hidden");
      renderGlossary();
      return;
    }

    const searchResult = findTerm(query);
    
    if (searchResult.match) {
      // Found exact match, render just this one card
      didYouMeanBar.classList.add("hidden");
      renderGlossary([searchResult.match]);
    } else if (searchResult.suggestions.length > 0) {
      // Suggest corrections
      didYouMeanBar.classList.remove("hidden");
      didYouMeanSuggestions.innerHTML = searchResult.suggestions.map(s => `
        <span class="did-you-mean-suggestion" data-term="${encodeURIComponent(s.term)}">${s.term}</span>
      `).join(" ");

      // Attach clicks to suggestions
      didYouMeanSuggestions.querySelectorAll(".did-you-mean-suggestion").forEach(span => {
        span.addEventListener("click", (e) => {
          const tName = decodeURIComponent(e.currentTarget.getAttribute("data-term"));
          lexiconSearch.value = tName;
          handleExplorerSearch();
        });
      });

      // Show partial matches in list
      renderGlossary(searchResult.suggestions);
    } else {
      // No match found
      didYouMeanBar.classList.add("hidden");
      renderGlossary([]);
    }
  }


  // ==========================================
  // DETAIL MODAL (Interactive Analogizer)
  // ==========================================
  let activeAnalogyTheme = "lego";
  let activeDetailTerm = null;

  function openTermDetail(termName) {
    const terms = getAllTerms();
    // In case it was dynamically translated by AI and isn't in local DB, fetch from active translation list
    let termObj = terms.find(t => t.term.toLowerCase() === termName.toLowerCase());
    
    if (!termObj && appState.activeTranslation) {
      const match = appState.activeTranslation.highlightedTerms.find(t => t.term.toLowerCase() === termName.toLowerCase());
      if (match) {
        termObj = {
          term: match.term,
          category: match.category,
          literal: match.literalMeaning,
          layman: match.laymanExplanation,
          analogies: {
            lego: match.legoAnalogy,
            sports: match.sportsAnalogy,
            cooking: match.cookingAnalogy
          }
        };
      }
    }

    if (!termObj) return;
    
    activeDetailTerm = termObj;
    
    // Fill text fields
    document.getElementById("detail-category").textContent = termObj.category;
    document.getElementById("detail-term").textContent = termObj.term;
    document.getElementById("detail-def-literal").textContent = termObj.literal || "Professional term definition.";
    document.getElementById("detail-def-layman").textContent = termObj.layman;

    // Reset analogy tab
    activeAnalogyTheme = "lego";
    updateAnalogyView();

    // Show modal
    termDetailModal.classList.add("active");
  }

  // Setup detail modal listeners
  btnCloseDetailModal.addEventListener("click", () => {
    termDetailModal.classList.remove("active");
  });

  btnAddToDeck.addEventListener("click", () => {
    if (!activeDetailTerm) return;
    
    const newTermObj = {
      term: activeDetailTerm.term,
      category: activeDetailTerm.category,
      literal: activeDetailTerm.literal || activeDetailTerm.literalMeaning || "Discovered from decipher engine.",
      layman: activeDetailTerm.layman || activeDetailTerm.laymanExplanation,
      eli5: activeDetailTerm.eli5 || activeDetailTerm.laymanExplanation || activeDetailTerm.layman,
      professional: activeDetailTerm.professional || activeDetailTerm.laymanExplanation || activeDetailTerm.layman,
      analogies: {
        lego: activeDetailTerm.analogies?.lego || activeDetailTerm.legoAnalogy || "Standard brick metaphor",
        sports: activeDetailTerm.analogies?.sports || activeDetailTerm.sportsAnalogy || "Standard game metaphor",
        cooking: activeDetailTerm.analogies?.cooking || activeDetailTerm.cookingAnalogy || "Standard recipe metaphor"
      },
      isCustom: true
    };

    const success = addCustomTerm(newTermObj);
    if (success) {
      alert(`"${activeDetailTerm.term}" added to your custom Study Deck! You can now test yourself in the Quiz tab.`);
    } else {
      alert(`"${activeDetailTerm.term}" is already in your Lexicon and Quiz deck!`);
    }
  });

  termDetailModal.querySelectorAll(".analogy-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      termDetailModal.querySelectorAll(".analogy-tab").forEach(t => t.classList.remove("active"));
      e.currentTarget.classList.add("active");
      activeAnalogyTheme = e.currentTarget.getAttribute("data-theme");
      updateAnalogyView();
    });
  });

  function updateAnalogyView() {
    if (!activeDetailTerm || !activeDetailTerm.analogies) return;
    
    const content = activeDetailTerm.analogies[activeAnalogyTheme] || "No analogy found for this theme.";
    document.getElementById("detail-analogy-content").textContent = content;
  }


  // ==========================================
  // STUDY QUIZ GAMEPLAY
  // ==========================================
  function setupQuiz() {
    quizCard.addEventListener("click", () => {
      quizCard.classList.toggle("flipped");
    });

    btnNextQuestion.addEventListener("click", loadNextQuizQuestion);
  }

  function startNewQuizSession() {
    appState.quiz.score = 0;
    appState.quiz.streak = 0;
    appState.quiz.currentIndex = 0;
    
    quizScore.textContent = "0";
    quizStreak.textContent = "0 🔥";
    quizProgress.textContent = "1 / 5";

    // Shuffle terms to form deck
    const terms = getAllTerms();
    // We need at least 4 terms to play multiple choice
    if (terms.length < 4) {
      quizOptionsContainer.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 20px;">
          You need at least 4 terms in the dictionary to play the quiz. Please add some custom terms!
        </div>`;
      quizCardTerm.textContent = "Empty Lexicon";
      quizCardCategory.textContent = "Add Terms First";
      quizCardDefinition.textContent = "Add terms to start studying.";
      quizCardAnalogy.textContent = "";
      return;
    }

    appState.quiz.deck = [...terms].sort(() => 0.5 - Math.random()).slice(0, 5);
    loadNextQuizQuestion();
  }

  function loadNextQuizQuestion() {
    quizCard.classList.remove("flipped");
    quizNextControls.classList.add("hidden");
    
    const deck = appState.quiz.deck;
    const index = appState.quiz.currentIndex;

    if (index >= deck.length) {
      // Completed session
      quizOptionsContainer.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 20px; color: var(--color-success)">
          <h3>🎉 Arena Completed!</h3>
          <p>You scored ${appState.quiz.score} out of ${deck.length} points.</p>
          <button class="btn btn-primary" style="margin-top: 15px;" onclick="location.reload()">Reset Session</button>
        </div>`;
      return;
    }

    // Update Progress UI
    quizProgress.textContent = `${index + 1} / ${deck.length}`;
    
    const correctTerm = deck[index];
    appState.quiz.currentQuestion = correctTerm;

    // Set Card Front & Back Text
    quizCardTerm.textContent = correctTerm.term;
    quizCardCategory.textContent = correctTerm.category;
    quizCardDefinition.textContent = correctTerm.layman;
    quizCardAnalogy.textContent = correctTerm.analogies?.lego || "A simple modular block explanation.";

    // Generate 3 wrong options
    const allTerms = getAllTerms();
    const wrongPool = allTerms.filter(t => t.term !== correctTerm.term);
    const shuffledWrong = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Make options array
    const options = [
      { text: correctTerm.layman, correct: true },
      ...shuffledWrong.map(w => ({ text: w.layman, correct: false }))
    ].sort(() => 0.5 - Math.random()); // Shuffle options

    // Render options
    quizOptionsContainer.innerHTML = options.map((opt, oIdx) => `
      <button class="quiz-choice-btn" data-correct="${opt.correct}" data-index="${oIdx}">
        ${opt.text}
      </button>
    `).join("");

    // Attach click handlers
    quizOptionsContainer.querySelectorAll(".quiz-choice-btn").forEach(btn => {
      btn.addEventListener("click", handleQuizAnswer);
    });
  }

  function handleQuizAnswer(e) {
    const btn = e.currentTarget;
    const isCorrect = btn.getAttribute("data-correct") === "true";
    
    // Disable all options
    quizOptionsContainer.querySelectorAll(".quiz-choice-btn").forEach(b => {
      b.disabled = true;
      const bCorrect = b.getAttribute("data-correct") === "true";
      if (bCorrect) {
        b.classList.add("correct");
      }
    });

    if (isCorrect) {
      appState.quiz.score += 1;
      appState.quiz.streak += 1;
      
      quizScore.textContent = appState.quiz.score;
      quizStreak.textContent = `${appState.quiz.streak} 🔥`;

      quizFeedbackText.textContent = "Correct! Spot on! 🎉";
      quizFeedbackText.className = "feedback-msg correct";
    } else {
      btn.classList.add("incorrect");
      appState.quiz.streak = 0;
      quizStreak.textContent = "0 🔥";

      quizFeedbackText.textContent = "Oops, not quite! Read the card back to learn. 📚";
      quizFeedbackText.className = "feedback-msg incorrect";
      
      // Auto-flip card to show definition
      setTimeout(() => {
        quizCard.classList.add("flipped");
      }, 500);
    }

    // Increment index
    appState.quiz.currentIndex += 1;
    
    // Show next controls
    quizNextControls.classList.remove("hidden");
  }


  // ==========================================
  // SETTINGS & CONFIGURATION
  // ==========================================
  function setupSettings() {
    // Show/Hide API key
    btnToggleKeyVisibility.addEventListener("click", () => {
      if (settingsApiKey.type === "password") {
        settingsApiKey.type = "text";
        btnToggleKeyVisibility.textContent = "🙈";
      } else {
        settingsApiKey.type = "password";
        btnToggleKeyVisibility.textContent = "👁️";
      }
    });

    // Save Settings
    btnSaveSettings.addEventListener("click", () => {
      const keyVal = settingsApiKey.value.trim();
      if (!keyVal) {
        alert("Please enter a valid API Key.");
        return;
      }

      localStorage.setItem("jargonaut_api_key", keyVal);
      appState.apiKey = keyVal;
      updateEngineStatusBadge();
      alert("Gemini API Key successfully saved!");
    });

    // Clear Settings
    btnClearSettings.addEventListener("click", () => {
      if (confirm("Are you sure you want to remove your Gemini API Key? The app will return to offline fallback mode.")) {
        localStorage.removeItem("jargonaut_api_key");
        appState.apiKey = "";
        updateEngineStatusBadge();
        alert("Gemini API Key removed.");
      }
    });

    // Stripe Save Link
    if (appState.stripeLink) {
      settingsStripeLink.value = appState.stripeLink;
    }
    
    btnSaveStripe.addEventListener("click", () => {
      const linkVal = settingsStripeLink.value.trim();
      if (!linkVal) {
        alert("Please enter a valid Stripe Payment Link URL.");
        return;
      }
      localStorage.setItem("jargonaut_stripe_link", linkVal);
      appState.stripeLink = linkVal;
      alert("Stripe Payment Link URL successfully saved!");
    });

    // Upgrade Modal controls
    btnCloseUpgradeModal.addEventListener("click", hideUpgradeModal);
    btnUpgradeCancel.addEventListener("click", hideUpgradeModal);
    btnSidebarUpgrade.addEventListener("click", showUpgradeModal);

    btnUpgradeCheckout.addEventListener("click", () => {
      const checkoutUrl = appState.stripeLink || "https://buy.stripe.com/mock_premium_checkout";
      window.open(checkoutUrl, "_blank");
      hideUpgradeModal();
    });
  }

  function showUpgradeModal() {
    upgradeModal.classList.add("active");
  }

  function hideUpgradeModal() {
    upgradeModal.classList.remove("active");
  }

  function updatePremiumUI() {
    if (appState.isPremium) {
      premiumSidebarBadge.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
      premiumSidebarBadge.style.border = "1px solid #f59e0b";
      premiumBadgeText.textContent = "👑 Premium Activated";
      premiumBadgeText.style.color = "#fff";
      btnSidebarUpgrade.style.display = "none";
    } else {
      premiumSidebarBadge.style.background = "rgba(255, 255, 255, 0.05)";
      premiumSidebarBadge.style.border = "1px solid rgba(255,255,255,0.1)";
      premiumBadgeText.textContent = `⭐ Free Tier (${appState.translationCount}/3 used)`;
      premiumBadgeText.style.color = "#9ca3af";
      btnSidebarUpgrade.style.display = "block";
    }
  }

  function checkUrlRedirectForPremium() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("status") === "success") {
      localStorage.setItem("jargonaut_premium", "true");
      appState.isPremium = true;
      updatePremiumUI();
      
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      alert("👑 Congratulations! Jargonaut Premium has been successfully activated!");
    }
  }

  // Start app
  init();

});
