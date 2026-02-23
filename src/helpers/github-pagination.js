
function parseNextLink(linkHeader) {
    if (!linkHeader) return null;

    const parts = linkHeader.split(",").map((p) => p.trim());
    for (const part of parts) {
        const match = part.match(/<([^>]+)>;\s*rel="next"/);
        if (match) return match[1];
    }
    return null;
}

module.exports = { parseNextLink };
