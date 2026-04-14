export function buildPrompt(action: string, profile: any) {
  const baseRules = `Rules: valid JSON only, no markdown, no extra text, JSON.parse()-able. Third person ("this dev", never "you/your"). Use exact repo names (no username prefix), exact commit messages, exact stats. No "as seen in X on [date]" — just "in X". No dates.`;

  const profileJSON = JSON.stringify(profile, null, 2);

  switch (action) {
    case "analyze":
      return `Cold, objective analyst. Third-person. Fact-based. NO advice, suggestions, or motivation — only what IS true.
${baseRules}

Return JSON:
{
  "skillLevel": "beginner|intermediate|advanced",
  "coreIdentity": "Role based on exact repos",
  "currentReality": "Objective state citing most active repos/languages",
  "strengths": ["Strength citing specific repo/stat (2-3 sentences)", "..."],
  "weaknesses": ["Weakness citing specific repo/stat (2-3 sentences)", "..."],
  "developerType": "What the data shows, in depth"
}

Strengths/weaknesses: minimum 3 each, cite exact repos, no softening, no buzzwords.

Profile: ${profileJSON}`;

    case "improve":
      return `Strict technical lead. Engineering habits only — no roasting, no career advice, no motivation.
${baseRules}

Return JSON:
{
  "improvements": ["In repo X (be specific)", "..."],
  "missingPractices": ["In repo Y (e.g., zero tests)", "..."],
  "refactorSuggestions": ["In repo Z (e.g., monolithic file)", "..."]
}

Minimum 3 per field. Focus: code structure, CI/CD, testing, architecture. Name the repo every time.

Profile: ${profileJSON}`;

    case "judge":
      return `Stern impassive judge. Third-person verdict on recent commits only. NO advice. NO fixes. Just rule.
${baseRules}

Judge on: consistency, intent, commit message quality (quote exact messages), focus vs chaos.

Return JSON:
{
  "verdict": "positive|neutral|negative",
  "commitDiscipline": "Judgment on discipline (cite patterns)",
  "commitsReveal": "What commits reveal about work ethic, citing exact repos",
  "redFlags": ["Flag quoting specific bad commit or stat", "..."],
  "biggestOffenses": ["Offense quoting exact commit message or repo", "..."],
  "finalRuling": "One cold, final sentence"
}

Minimum 3 redFlags and biggestOffenses. Never repeat commit messages. Repo names only, no username prefix.

Recent commits: ${JSON.stringify(profile.recentCommits, null, 2)}`;

    case "roast":
      return `Savage comedian + senior dev. ONLY goal: brutally mock this developer. NO advice. NO motivation. PURE mockery.
${baseRules}

Return JSON:
{
  "brutalCritique": ["Mock observation naming specific repo/stat (sting with real data)", "..."],
  "savageAnalogies": ["Devastating analogy using actual repo name or commit", "..."],
  "roastClosing": "One final, soul-crushing punchline"
}

Min 4 brutalCritique, min 3 savageAnalogies. Use "lol", "lmao" naturally. Mock their stack, commit messages, repo names, inactivity — by name. Make it sting because it's true.

Profile: ${profileJSON}`;

    case "pvp": {
  const { player1, player2 } = profile;
  return `You are an elite GitHub strategist and sharp battle analyst presiding over a high-stakes 1v1 profile showdown in the GitHub arena.
${baseRules}

Analyze BOTH profiles in depth and declare a winner. Your commentary must be energetic, insightful, and competitive while staying professional — use precise tech analysis with occasional subtle gaming-inspired flair for excitement. Vary your phrasing and metaphors across every section to avoid repetition. Never overuse words like grind, DPS, carry, meta, loadout, or aura. Judgments MUST be 100% grounded in the real data provided — do not invent or exaggerate stats.

You MUST evaluate them across these five categories and decide a clear winner (or tie) for each:
- "consistency": based on longestStreak, currentStreak, activeWeeks, totalContributions (Who shows stronger consistency and long-term output?)
- "output": based on totalCommits, totalPRs, totalIssues, totalReviews (Who produces the highest volume of meaningful contributions?)
- "influence": based on totalStars, followers, reposOver100Stars (Who commands the strongest community reach and influence?)
- "breadth": based on uniqueLanguages, topLanguages, repoCount (Who brings the most versatile and complete technical toolkit?)
- "experience": based on accountAgeYears, orgsCount (Who has the most seasoned experience and established track record?)

For each category, assign a score out of 10 for both players based on their stats (10 means world-class elite, 5 is average).

Return exactly this JSON structure (no extra text, no markdown, no explanations):

{
  "player1": "${player1.username}",
  "player2": "${player2.username}",
  "categoryScores": {
    "consistency": { "player1Score": 0, "player2Score": 0 },
    "output": { "player1Score": 0, "player2Score": 0 },
    "influence": { "player1Score": 0, "player2Score": 0 },
    "breadth": { "player1Score": 0, "player2Score": 0 },
    "experience": { "player1Score": 0, "player2Score": 0 }
  },
  "overallWinner": "player1|player2|tie",
  "winnerUsername": "exact github username of winner or 'tie'",
  "score": { "player1": 0, "player2": 0 },
  "verdict": "3-4 sentences. A clear, climactic final breakdown of the entire matchup. Reference the exact stats that decided the key categories and explain why one profile ultimately prevailed (or why it was dead even).",
  "closingRemark": "One sharp, memorable final line (max 15 words) that perfectly captures the outcome."
}

Important scoring rules:
- Evaluate each category and assign points (0 to 10) to both players.
- Set "score.player1" and "score.player2" to the total summed points across all 5 categories.
- The overallWinner MUST be the player with the highest total score. If scores are equal, it's a "tie".

Player 1 (${player1.username}):
${JSON.stringify(player1, null, 2)}

Player 2 (${player2.username}):
${JSON.stringify(player2, null, 2)}`;
}

    default:
      throw new Error("Invalid action");
  }
}