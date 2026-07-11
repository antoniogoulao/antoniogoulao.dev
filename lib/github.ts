export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

export async function fetchGitHubRepos(
  username: string,
  limit = 6
): Promise<GitHubRepo[]> {
  try {
    // Fetched once at build time (output: 'export' — no runtime revalidation).
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const repos = Array.isArray(data) ? (data as GitHubRepo[]) : [];
    return repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  } catch {
    return [];
  }
}