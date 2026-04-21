import {fetchGitHubRepos} from '@/lib/github';

const mockRepos = [
  {id: 1, name: 'alpha', description: 'First', html_url: 'https://github.com/a', stargazers_count: 5, language: 'TypeScript', fork: false},
  {id: 2, name: 'beta', description: 'Second', html_url: 'https://github.com/b', stargazers_count: 12, language: 'Go', fork: false},
  {id: 3, name: 'forked', description: 'Forked', html_url: 'https://github.com/c', stargazers_count: 20, language: 'Rust', fork: true},
];

global.fetch = jest.fn();

describe('fetchGitHubRepos', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns non-fork repos sorted by stars descending', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    });

    const result = await fetchGitHubRepos('testuser');

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('beta');
    expect(result[1].name).toBe('alpha');
  });

  it('respects the limit parameter', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockRepos[0], mockRepos[1]],
    });

    const result = await fetchGitHubRepos('testuser', 1);
    expect(result).toHaveLength(1);
  });

  it('returns empty array when API responds with non-ok status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ok: false});
    const result = await fetchGitHubRepos('testuser');
    expect(result).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchGitHubRepos('testuser');
    expect(result).toEqual([]);
  });
});