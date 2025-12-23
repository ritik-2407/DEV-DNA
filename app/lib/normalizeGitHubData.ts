export async function normaliseGitHubData( user :any , repos: any[] , events: any[]){

    const now = Date.now()

    const createdAt = new Date(user.created_at).getTime()

    const languages : Record<string , number> ={}

    repos.forEach((repo) => {
        if(repo.lannguage){
            languages[repo.languages] = (languages[repo.language] || 0 ) + 1
        }
    })

    return {
    user: {
      username: user.login,
      name: user.name,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      accountAgeYears: Math.floor(
        (now - createdAt) / (1000 * 60 * 60 * 24 * 365)
      ),
    },

    repos: {
      total: repos.length,
      topStarred: repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map((r) => ({
          name: r.name,
          stars: r.stargazers_count,
          language: r.language,
          updatedAt: r.updated_at,
        })),
      languages,
    },

    activity: {
      recentEventsCount: events.length,
      pushEvents: events.filter(e => e.type === "PushEvent").length,
      prEvents: events.filter(e => e.type === "PullRequestEvent").length,
      issueEvents: events.filter(e => e.type === "IssuesEvent").length,
    },
  }
}
