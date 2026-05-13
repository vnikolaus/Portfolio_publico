export type GitHubRepositoryInfo = {
    owner: string;
    repo: string;
    normalizedUrl: string;
    cloneUrl: string;
};

export function parseGitHubRepositoryUrl(url: string): GitHubRepositoryInfo {
    let parsedUrl: URL;

    try {
        parsedUrl = new URL(url);
    } catch {
        throw new Error("Invalid repository URL.");
    }

    if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "github.com") {
        throw new Error("Only public HTTPS GitHub URLs are supported.");
    }

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathParts.length < 2) {
        throw new Error("GitHub URL must include owner and repository name.");
    }

    const owner = pathParts[0];
    const repo = pathParts[1].replace(/\.git$/, "");

    if (!isValidGitHubPathPart(owner) || !isValidGitHubPathPart(repo)) {
        throw new Error("GitHub owner or repository name has an invalid format.");
    }

    const normalizedUrl = `https://github.com/${owner}/${repo}`;

    return {
        owner,
        repo,
        normalizedUrl,
        cloneUrl: `${normalizedUrl}.git`,
    };
}

function isValidGitHubPathPart(value: string): boolean {
    return /^[A-Za-z0-9._-]+$/.test(value);
}
