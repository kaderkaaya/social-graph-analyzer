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

export async function startCompareJob(username) {
    const res = await fetch(`${API_BASE}/job/compare-with-jobIds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.data.result;
}

export async function getJob(jobId) {
    const res = await fetch(`${API_BASE}/job/${jobId}`);

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message || `HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.data.result; 
}
