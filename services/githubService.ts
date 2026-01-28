export interface GithubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

const STORAGE_KEY = 'devdeck_github_config';

export const getGithubConfig = (): GithubConfig | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveGithubConfig = (config: GithubConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const clearGithubConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const pushToGithub = async (
  filename: string, 
  content: string, 
  message: string
): Promise<{ url: string; sha: string }> => {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub configuration missing. Please check settings.");

  const path = filename.startsWith('/') ? filename.substring(1) : filename;
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
  
  // 1. Check if file exists to get SHA (for updates)
  let sha: string | undefined;
  try {
    const checkRes = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (checkRes.ok) {
      const data = await checkRes.json();
      sha = data.sha;
    }
  } catch (e) {
    // Ignore error, assume file doesn't exist (create mode)
  }

  // 2. Prepare payload (Base64 encoding safe for Unicode)
  const base64Content = btoa(unescape(encodeURIComponent(content)));

  const payload = {
    message: message || `Update ${filename} via DevDeck`,
    content: base64Content,
    branch: config.branch || 'main',
    sha
  };

  // 3. Push (PUT)
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to push to GitHub");
  }

  const result = await response.json();
  return { url: result.content.html_url, sha: result.content.sha };
};