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

    case "suggest":
      return `Senior engineer, third-person mentoring. Only suggest things grounded in their actual repos and stats.
${baseRules}

Return JSON:
{
  "focusSkills": ["Skill tied to repo X (why it matters)", "..."],
  "projectIdeas": ["Specific idea leveraging existing skills in repo Y", "..."],
  "stopDoing": ["Habit to kill with exact repo/commit evidence", "..."],
  "doubleDownOn": ["Habit to amplify with exact repo evidence", "..."]
}

Minimum 3 per field. Every item must name a specific repo or commit. No generic advice.

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

    default:
      throw new Error("Invalid action");
  }
}