const GITHUB_BASE = "https://api.github.com";

export async function githubFetch(url: string, token: string) {
  const res = await fetch(`${GITHUB_BASE}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(
      `GitHub API failed (${res.status}): ${text}`
    );
  }

  return res.json();
}
