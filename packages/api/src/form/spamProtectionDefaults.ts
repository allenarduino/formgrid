/**
 * Defaults for form.settings.spamProtection.
 * Rate limiting is always applied (default 10/min per IP per form).
 * `enabled` / `honeypot` control CAPTCHA and honeypot, not the rate limit.
 */

export const DEFAULT_FORM_RATE_LIMIT_PER_MINUTE = 10;
export const MAX_FORM_RATE_LIMIT_PER_MINUTE = 100;

export interface ResolvedSpamProtectionSettings {
    enabled: boolean;
    honeypot: boolean;
    rateLimit: number;
}

function asRecord(raw: unknown): Record<string, unknown> {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        return raw as Record<string, unknown>;
    }
    return {};
}

/**
 * Normalize dashboard/API spam-protection settings into a complete config.
 */
export function resolveSpamProtectionSettings(raw?: unknown): ResolvedSpamProtectionSettings {
    const settings = asRecord(raw);
    const parsedLimit = settings.rateLimit;
    let rateLimit = DEFAULT_FORM_RATE_LIMIT_PER_MINUTE;

    if (typeof parsedLimit === 'number' && Number.isFinite(parsedLimit) && parsedLimit > 0) {
        rateLimit = Math.min(MAX_FORM_RATE_LIMIT_PER_MINUTE, Math.floor(parsedLimit));
    }

    return {
        enabled: settings.enabled === true,
        honeypot: settings.honeypot === true,
        rateLimit,
    };
}
