// Jargonaut Database of Terms & Fuzzy Search Utilities

const DEFAULT_TERMS = [
  // MEDICAL JARGON
  {
    term: "Idiopathic",
    category: "Medical Jargon",
    literal: "Of unknown cause.",
    layman: "A disease or condition that arises spontaneously or for which the cause is unknown.",
    eli5: "When a doctor says a sickness is 'idiopathic', it means the doctor doesn't know why you got sick, like a toy breaking for no obvious reason.",
    professional: "Denoting any disease or condition which arises spontaneously or for which the cause is unknown.",
    analogies: {
      sports: "It's like a referee calling a foul but nobody, including the referee, knows what rule was broken.",
      cooking: "It's like a cake collapsing in the oven even though you followed the recipe perfectly, and you have no idea why.",
      lego: "It's like a LEGO tower falling down suddenly when no one was touching it or shaking the table."
    }
  },
  {
    term: "Myocardial Infarction",
    category: "Medical Jargon",
    literal: "Heart muscle death due to lack of blood.",
    layman: "A heart attack, which happens when blood flow to part of the heart is blocked, damaging the heart muscle.",
    eli5: "A heart attack. The pipes bringing blood to the heart get clogged, and part of the heart muscle gets hurt because it can't breathe.",
    professional: "Necrosis of a portion of cardiac muscle caused by obstruction in a coronary artery.",
    analogies: {
      sports: "It's like a stadium's entry gates getting completely blocked, so the players on the field can't get any water and collapse from exhaustion.",
      cooking: "It's like a fuel line getting clogged on a gas stove, causing the burner to go completely cold mid-cook.",
      lego: "It's like a blockage in a water-pump LEGO contraption that stops the motor from getting power, causing it to overheat and fail."
    }
  },
  {
    term: "Cephalgia",
    category: "Medical Jargon",
    literal: "Head pain.",
    layman: "A headache.",
    eli5: "A headache. Your head feels ouchy, like a tiny drum is beating inside your brain.",
    professional: "Pain in the head; headache.",
    analogies: {
      sports: "It's like stadium noise being so loud that you can't hear the coach's whistle, making your ears ring.",
      cooking: "It's like a pressure cooker whistling and rattling intensely because the steam release valve is stuck.",
      lego: "It's like putting a LEGO brick on wrong so it pinches the other blocks, making the structure unstable and tight."
    }
  },

  // LEGAL JARGON
  {
    term: "In perpetuity",
    category: "Legal Jargon",
    literal: "Forever.",
    layman: "For an unlimited period of time; forever or indefinitely.",
    eli5: "Forever and ever. Like a promise that never, ever stops, even after you grow up and get very old.",
    professional: "Continuing forever; legally bound without an expiration date.",
    analogies: {
      sports: "It's like a game with no timer that keeps playing forever, passing from generation to generation.",
      cooking: "It's like a magical soup pot that never empties; no matter how much you ladle out, it stays full forever.",
      lego: "It's like glueing your LEGO blocks together so they can never be pulled apart, staying built forever."
    }
  },
  {
    term: "Force Majeure",
    category: "Legal Jargon",
    literal: "Superior force.",
    layman: "An unexpected event, like a natural disaster, that prevents someone from fulfilling a contract.",
    eli5: "An 'act of God' or super big accident (like a hurricane or alien invasion) that makes it impossible to do what you promised, so you don't get in trouble.",
    professional: "Unforeseeable circumstances that prevent someone from fulfilling a contract.",
    analogies: {
      sports: "It's like a baseball game being cancelled because a massive thunderstorm floods the entire field.",
      cooking: "It's like trying to bake a cake, but a sudden power outage turns off the oven and leaves you in the dark.",
      lego: "It's like building a nice LEGO castle, but the family dog walks by and accidentally steps on it, crushing it completely."
    }
  },
  {
    term: "Tort",
    category: "Legal Jargon",
    literal: "Twisted or wrong action.",
    layman: "A wrongful act (other than a breach of contract) that causes harm to someone, leading to legal liability.",
    eli5: "Accidentally or on purpose hurting someone or breaking their things, which means you have to pay to fix it.",
    professional: "A civil wrong that unfairly causes someone else to suffer loss or harm, resulting in legal liability.",
    analogies: {
      sports: "It's like tripping an opposing player when the ball is nowhere near them; it's a foul that goes beyond normal play.",
      cooking: "It's like accidentally spilling hot soup on a guest's lap because you weren't looking where you were walking.",
      lego: "It's like knocking over someone else's built LEGO spaceship because you were running around the room too fast."
    }
  },

  // TECH & ENGINEERING JARGON
  {
    term: "Spaghetti Code",
    category: "Tech Jargon",
    literal: "Tangled programming code.",
    layman: "Programming code that is messy, poorly structured, and tangled, making it very hard to understand or modify.",
    eli5: "Code that is tangled up like a big bowl of noodles. If you pull on one noodle, the whole plate shakes, and you can't find where it starts or ends.",
    professional: "Unstructured and difficult-to-maintain computer program source code, caused by complex control flow.",
    analogies: {
      sports: "It's like a football game where there are no playbooks and players just run in random directions crisscrossing each other.",
      cooking: "It's like throwing twenty different ingredients into a blender without measuring, making it impossible to separate the flavors later.",
      lego: "It's like dumping all your LEGO pieces in a giant tangled heap and joining them randomly without instructions."
    }
  },
  {
    term: "Idempotent",
    category: "Tech Jargon",
    literal: "Same power.",
    layman: "An operation that produces the exact same result no matter how many times you run it.",
    eli5: "Like an elevator button. Clicking it once calls the elevator. Clicking it ten more times doesn't make it arrive any faster; it does the same thing.",
    professional: "A property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result.",
    analogies: {
      sports: "It's like hitting the restart button on a scoreboard: no matter how many times you press it, the score remains 0 - 0.",
      cooking: "It's like putting a lid on a pot: once the lid is on, putting it on again doesn't make the pot 'more covered'.",
      lego: "It's like pressing down a LEGO brick that is already fully snapped in place: pressing it again doesn't change its position."
    }
  },
  {
    term: "Technical Debt",
    category: "Tech Jargon",
    literal: "Imperfect code design cost.",
    layman: "Choosing an easy, quick coding solution now instead of a better approach that would take longer, creating extra work for later.",
    eli5: "Like throwing all your toys into the closet to clean your room fast. It looks clean now, but later you will have a hard time finding anything and have to clean it for real.",
    professional: "The implied cost of additional rework caused by choosing an easy solution now instead of using a better approach.",
    analogies: {
      sports: "It's like playing a game with minor injuries: you might finish the game, but you'll have to rest much longer afterwards to heal.",
      cooking: "It's like cooking a big meal and leaving all the dishes in the sink. You eat fast, but now you have a mountain of crusty pots to clean.",
      lego: "It's like building the base of your LEGO tower out of weak, loose blocks because you were in a hurry. Now you can't build it any higher without it falling."
    }
  },

  // FINANCE
  {
    term: "Amortization",
    category: "Financial Jargon",
    literal: "Killing off a debt.",
    layman: "Spreading out loan payments or asset costs over a set period of time so they are paid off gradually.",
    eli5: "Breaking a big bill into tiny bite-sized pieces so you can pay a little bit every month instead of all at once.",
    professional: "The action or process of gradually writing off the initial cost of an asset or paying off a debt over time.",
    analogies: {
      sports: "It's like running a marathon in stages over a week instead of trying to run all 26 miles in one go.",
      cooking: "It's like slicing a giant, heavy cake into twelve small slices so you can eat a little slice every day without getting sick.",
      lego: "It's like building a giant LEGO castle by adding exactly three bricks a day, making it easy to finish without getting tired."
    }
  },

  // SURFER SLANG
  {
    term: "Shred",
    category: "🏄 Surfer Slang",
    literal: "To tear to pieces.",
    layman: "To ride a surfboard (or skateboard/snowboard) exceptionally well, carving waves with speed, power, and skill.",
    eli5: "Surfing or skating super fast and doing cool tricks, showing everyone you are really good at it!",
    professional: "To perform board sports maneuvers with an aggressive, highly skilled, and dynamic style.",
    analogies: {
      sports: "It's like a soccer player dribbling past five defenders and scoring a spectacular bicycle kick goal.",
      cooking: "It's like a chef chopping onions at lightning speed with perfect accuracy, looking like a pro.",
      lego: "It's like clicking together a massive LEGO set in five minutes flat without even looking at the instruction manual."
    }
  },
  {
    term: "Gnarly",
    category: "🏄 Surfer Slang",
    literal: "Gnarled or knotty.",
    layman: "Something extreme, challenging, dangerous, or awesome (depending on context, often referring to massive or rough waves).",
    eli5: "Something that is super scary but also very exciting and cool, like a giant roller coaster.",
    professional: "A colloquial descriptor for conditions, events, or terrain that are highly intense, hazardous, or impressive.",
    analogies: {
      sports: "It's like trying to bike down a steep, muddy mountain trail filled with rocks and tree roots.",
      cooking: "It's like cooking with ghost peppers: it's dangerous, hot, and wild, but exciting if you can handle it.",
      lego: "It's like trying to build a LEGO tower while riding on a bumpy school bus."
    }
  },

  // GEN-Z SLANG
  {
    term: "Rizz",
    category: "💬 Gen-Z Slang",
    literal: "Charisma.",
    layman: "Charisma, charm, or the ability to attract or charm someone romantically.",
    eli5: "Having a lot of charm or being super good at making people like you, like a friendly puppy that everyone wants to play with.",
    professional: "Slang abbreviation of 'charisma', denoting interpersonal charm and romantic appeal.",
    analogies: {
      sports: "It's like a player who can wave at the crowd and get everyone cheering instantly without even playing yet.",
      cooking: "It's like putting a secret glaze on a pastry that makes it look so delicious that everyone in the shop immediately wants to buy it.",
      lego: "It's like having a special shiny gold LEGO brick that makes any spaceship you put it on look ten times cooler."
    }
  },
  {
    term: "No Cap",
    category: "💬 Gen-Z Slang",
    literal: "No lie.",
    layman: "Truthfully; not lying or exaggerating. Emphasizes that a statement is completely real.",
    eli5: "Cross my heart and hope to die! I am telling the 100% truth, no jokes or fibs.",
    professional: "An idiomatic assertion of absolute veracity; synonymous with 'seriously' or 'without exaggeration'.",
    analogies: {
      sports: "It's like a referee reviewing a video replay to prove 100% that a ball crossed the goal line.",
      cooking: "It's like a chef showing you the raw ingredients they used so you know it's real butter and not margarine.",
      lego: "It's like built-in LEGO studs that lock together: they are solid, real, and don't slide around."
    }
  },

  // IDIOMS & OLD PHRASING
  {
    term: "Wherefore",
    category: "📜 Old Phrasing",
    literal: "Why.",
    layman: "Why or for what reason. (Often misunderstood to mean 'where').",
    eli5: "A fancy old way of saying 'why?'. So when Juliet says 'Wherefore art thou Romeo?', she is asking 'Why are you Romeo?' (why must you belong to the enemy family?), not 'Where are you?'.",
    professional: "An archaic adverb meaning 'for what reason' or 'why'.",
    analogies: {
      sports: "It's like asking why the rules say you can't touch the ball with your hands in soccer.",
      cooking: "It's like asking why a recipe demands yeast to bake bread.",
      lego: "It's like asking why the instructions tell you to put green blocks at the bottom."
    }
  },
  {
    term: "Bite the bullet",
    category: "🎭 Idioms",
    literal: "Chomp down on ammunition.",
    layman: "To face a difficult or painful situation with courage and get it over with.",
    eli5: "Doing something scary or yucky (like eating broccoli or getting a shot) because you know you just have to do it.",
    professional: "To accept a difficult, inevitable situation with fortitude and resolve.",
    analogies: {
      sports: "It's like running the final uphill stretch of a race when your legs are burning, knowing you just have to push through to the finish.",
      cooking: "It's like scrubbing a burnt pot: it's hard work, but you just have to buckle down and do it to get it clean.",
      lego: "It's like pulling apart two stuck flat LEGO plates with your fingers—it hurts a little, but you have to do it to keep building."
    }
  },

  // REGIONAL DIALECTS
  {
    term: "Fair dinkum",
    category: "🌏 Regional Dialects",
    literal: "True work.",
    layman: "An Australian term meaning genuine, honest, or true.",
    eli5: "Being completely real and honest. Like saying 'For real!' or 'This is the real deal!'",
    professional: "An Australian colloquialism denoting authenticity, truthfulness, or reliability.",
    analogies: {
      sports: "It's like a gold medal that is tested and proven to be 100% solid gold, not fake paint.",
      cooking: "It's like eating a pie made with real fresh apples from the farm, not canned jelly.",
      lego: "It's like a real, official LEGO brand brick instead of a cheap knockoff that doesn't fit."
    }
  },

  // BIBLICAL LANGUAGE
  {
    term: "Gird up your loins",
    category: "⛪ Biblical Language",
    literal: "Tie up your long robes with a belt.",
    layman: "To prepare oneself for action, hard work, or a difficult challenge.",
    eli5: "Tying your shoes and getting ready to run really fast or do something hard.",
    professional: "An ancient cultural idiom meaning to gather up loose garments to enable swift movement, now used metaphorically to prepare for strenuous effort.",
    analogies: {
      sports: "It's like taping your ankles and putting on your mouthguard before heading onto the field for the championship game.",
      cooking: "It's like putting on your apron and washing your hands before starting a massive, complex feast.",
      lego: "It's like double-checking your baseplates and organizing all your blocks before starting to build a giant 5,000-piece castle."
    }
  },

  // ANCIENT & ESOTERIC
  {
    term: "As above, so below",
    category: "📜 Ancient & Esoteric",
    literal: "What happens in heaven or higher realms happens on earth or lower realms.",
    layman: "The idea that the big universe (macrocosm) and the individual human (microcosm) are reflections of each other; patterns repeat at all scales.",
    eli5: "Like how a tiny water droplet has the same shape and properties as the giant ocean. The little things work just like the big things.",
    professional: "A Hermetic maxim expressing the concept of correspondence, suggesting that the celestial and terrestrial realms, or the universal and individual spheres, operate under identical patterns.",
    analogies: {
      sports: "It's like how the strategy used by the professional coach in the NFL is the exact same strategy a kid uses in backyard flag football.",
      cooking: "It's like how a tiny pinch of salt changes the flavor of a single bowl of soup in the exact same way it changes a 100-gallon vat of soup.",
      lego: "It's like how you can build a tiny LEGO house using the exact same structural joints and snaps that you use to build a skyscraper LEGO city."
    }
  },

  // INSURANCE JARGON
  {
    term: "Deductible",
    category: "🛡️ Insurance Jargon",
    literal: "The amount that can be deducted.",
    layman: "The initial amount of money you must pay out-of-pocket for damage before your insurance provider pays the rest.",
    eli5: "Paying a little bit of your own pocket money to fix your broken toy before the insurance fairy covers the big bill.",
    professional: "The specified amount of money that the insured must pay before an insurance company will pay a claim.",
    analogies: {
      sports: "It's like having to run a lap around the track yourself before the coach lets you join the game.",
      cooking: "It's like buying the eggs yourself before the cooking school provides all the flour and chocolate for the cake.",
      lego: "It's like providing the baseplate yourself before your friend gives you all the free blocks to build the castle."
    }
  },

  // MILITARY JARGON
  {
    term: "FUBAR",
    category: "🪖 Military Jargon",
    literal: "Fouled Up Beyond All Recognition.",
    layman: "A situation that is completely ruined, broken down, or ruined beyond repair.",
    eli5: "Something that is completely and totally broken, like a mud pie that got ran over by a lawnmower.",
    professional: "An acronym denoting a state of total disorder, failure, or damage beyond repair or recognition.",
    analogies: {
      sports: "It's like a play where the quarterback trips, fumbles, the ball bounces off three referees, and the other team scores.",
      cooking: "It's like dropping a three-tiered wedding cake down a flight of stairs; it's a mushy mess.",
      lego: "It's like a LEGO spaceship getting stepped on by an elephant, leaving only dust and broken pieces."
    }
  },

  // GAMING JARGON
  {
    term: "Aggro",
    category: "🎮 Gaming Jargon",
    literal: "Aggression.",
    layman: "Causing a hostile computer-controlled enemy to focus all their attention and attacks on your character.",
    eli5: "Waving your hands and shouting at a monster so it chases you instead of your friends.",
    professional: "The state of hostile target threat generation, directing enemy AI attention to a specific player character.",
    analogies: {
      sports: "It's like a defender in basketball waving their arms frantically in front of the shooter to block their view.",
      cooking: "It's like a boiling pot of milk rising up to overflow, requiring your immediate attention so it doesn't spill.",
      lego: "It's like waving a red flag at a LEGO bull model to make it crash into your shield."
    }
  },

  // POP CULTURE
  {
    term: "Main Character Energy",
    category: "🎬 Pop Culture",
    literal: "Forcefulness of a protagonist.",
    layman: "Behaving in a way that suggests you are the center of attention or the hero of your own movie, showing confidence.",
    eli5: "Walking around like you are the king or queen of the playground and everyone is playing your game.",
    professional: "Denoting self-assured, spotlight-seeking behavior, acting as though one's life is a dramatized narrative.",
    analogies: {
      sports: "It's like the star player taking the final shot with 1 second left on the clock, fully believing they will score.",
      cooking: "It's like a single ingredient, like truffle oil, that completely dominates the flavor of the entire dish.",
      lego: "It's like putting a giant neon green dragon right in the middle of a medieval LEGO town."
    }
  }
];

// Helper: Calculate Levenshtein Distance for fuzzy search
function getLevenshteinDistance(a, b) {
  const tmp = [];
  let i, j, val;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  for (i = 0; i <= a.length; i++) tmp[i] = [i];
  for (j = 0; j <= b.length; j++) tmp[0][j] = j;
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      val = (a[i - 1] === b[j - 1]) ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + val // substitution
      );
    }
  }
  return tmp[a.length][b.length];
}

// Get custom terms from LocalStorage
function getCustomTerms() {
  try {
    const list = localStorage.getItem("jargonaut_custom_terms");
    return list ? JSON.parse(list) : [];
  } catch (e) {
    console.error("Error loading custom terms", e);
    return [];
  }
}

// Add custom term to LocalStorage
function addCustomTerm(termObj) {
  try {
    const list = getCustomTerms();
    // Prevent duplicates
    const filtered = list.filter(t => t.term.toLowerCase() !== termObj.term.toLowerCase());
    filtered.push(termObj);
    localStorage.setItem("jargonaut_custom_terms", JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Error saving custom term", e);
    return false;
  }
}

// Delete custom term
function deleteCustomTerm(termName) {
  try {
    const list = getCustomTerms();
    const filtered = list.filter(t => t.term.toLowerCase() !== termName.toLowerCase());
    localStorage.setItem("jargonaut_custom_terms", JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Error deleting custom term", e);
    return false;
  }
}

// Get all terms combined (defaults + customs)
function getAllTerms() {
  return [...DEFAULT_TERMS, ...getCustomTerms()];
}

// Fuzzy matching dictionary search ("Did you mean?")
function findTerm(query) {
  if (!query) return null;
  const cleanQuery = query.trim().toLowerCase();
  const allTerms = getAllTerms();

  // 1. Try exact match
  const exact = allTerms.find(t => t.term.toLowerCase() === cleanQuery);
  if (exact) return { match: exact, suggestions: [] };

  // 2. Try partial/includes match
  const partials = allTerms.filter(t => t.term.toLowerCase().includes(cleanQuery));
  if (partials.length > 0) {
    return { match: null, suggestions: partials };
  }

  // 3. Try fuzzy match (Levenshtein distance <= 3 or threshold)
  const matches = allTerms.map(t => {
    const dist = getLevenshteinDistance(cleanQuery, t.term.toLowerCase());
    return { termObj: t, distance: dist };
  });

  // Filter terms with distance <= 4 or based on term length
  const suggestions = matches
    .filter(m => m.distance <= Math.max(3, Math.floor(m.termObj.term.length / 2)))
    .sort((a, b) => a.distance - b.distance)
    .map(m => m.termObj);

  return {
    match: null,
    suggestions: suggestions.slice(0, 3) // Return top 3 suggestions
  };
}

// Analyze local text and extract matching terms, complexity, and highlights
function analyzeTextLocal(text) {
  if (!text) return null;
  const allTerms = getAllTerms();
  const found = [];
  let scoreAccumulator = 100;
  
  // Sort terms by length descending to match longer phrases first
  const sortedTerms = [...allTerms].sort((a, b) => b.term.length - a.term.length);

  let processedText = text;
  
  // Simple check for matching phrases
  sortedTerms.forEach(termObj => {
    // Regex word boundary matching
    const escapedTerm = termObj.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
    
    if (regex.test(processedText)) {
      found.push(termObj);
      scoreAccumulator -= 15; // Deduct score for each jargon match
    }
  });

  const finalScore = Math.max(10, scoreAccumulator);
  return {
    terms: found,
    score: finalScore
  };
}
