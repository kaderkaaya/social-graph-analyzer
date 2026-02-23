const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function compareGithubUsers(username) {
    const result = await fetch(`${API_BASE}/github/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });

    if (!result.ok) {
        const error = await result.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || `HTTP ${result.status}`);
    }

    const json = await result.json();
    return json.data.result;
}
