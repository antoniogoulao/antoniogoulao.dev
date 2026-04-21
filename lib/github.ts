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
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=100`,
      {cache: 'force-cache'}
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  } catch {
    return [];
  }
}