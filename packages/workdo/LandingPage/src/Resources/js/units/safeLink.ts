export const isSafeLandingLink = (href?: string | null): boolean => {
    if (!href) return false;

    const normalized = href.trim();
    if (!normalized) return false;

    if (/[\u0000-\u001F\u007F]/.test(normalized)) return false;

    if (normalized.startsWith('#')) {
        return /^#[A-Za-z0-9\-_.:]+$/.test(normalized);
    }

    if (normalized.startsWith('/')) {
        return !normalized.startsWith('//');
    }

    try {
        const parsed = new URL(normalized);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

export const normalizeSafeLandingLink = (href?: string | null, fallback = '/'): string => {
    return isSafeLandingLink(href) ? href!.trim() : fallback;
};