import { Request, Response, NextFunction } from 'express';
import { DEFAULT_FORM_RATE_LIMIT_PER_MINUTE } from '../form/spamProtectionDefaults';

const FORM_SUBMISSION_WINDOW_MS = 60 * 1000;

/**
 * Simple in-memory rate limiting middleware
 * In production with multiple API instances, use Redis (see enhancedRateLimit.ts)
 */
class RateLimiter {
    private requests: Map<string, { count: number; resetTime: number }> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Clean up expired entries every minute
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60000);
        this.cleanupInterval.unref();
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, data] of this.requests.entries()) {
            if (now > data.resetTime) {
                this.requests.delete(key);
            }
        }
    }

    isAllowed(key: string, limit: number, windowMs: number): boolean {
        const now = Date.now();
        const data = this.requests.get(key);

        if (!data || now > data.resetTime) {
            // First request or window expired
            this.requests.set(key, {
                count: 1,
                resetTime: now + windowMs,
            });
            return true;
        }

        if (data.count >= limit) {
            return false;
        }

        data.count++;
        return true;
    }

    getRemainingRequests(key: string, limit: number): number {
        const data = this.requests.get(key);
        if (!data) {
            return limit;
        }
        return Math.max(0, limit - data.count);
    }

    getResetTime(key: string): number {
        const data = this.requests.get(key);
        return data ? data.resetTime : Date.now();
    }

    clear(): void {
        this.requests.clear();
    }

    destroy(): void {
        clearInterval(this.cleanupInterval);
        this.requests.clear();
    }
}

const rateLimiter = new RateLimiter();

/**
 * Rate limiting middleware
 * @param options - Rate limiting options
 */
export function createRateLimit(options: {
    windowMs?: number;
    max?: number;
    keyGenerator?: (req: Request) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}) {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // limit each IP to 100 requests per windowMs
        keyGenerator = (req: Request) => req.ip || 'unknown',
        skipSuccessfulRequests = false,
        skipFailedRequests = false,
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
        const key = keyGenerator(req);
        const allowed = rateLimiter.isAllowed(key, max, windowMs);

        if (!allowed) {
            const resetTime = rateLimiter.getResetTime(key);
            const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

            res.status(429).json({
                success: false,
                message: 'Too many requests',
                error: 'Rate limit exceeded',
                retryAfter,
            });
            return;
        }

        // Add rate limit headers
        const remaining = rateLimiter.getRemainingRequests(key, max);
        res.set({
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimiter.getResetTime(key)).toISOString(),
        });

        // Track response status for conditional rate limiting
        const originalSend = res.send;
        res.send = function (body: any) {
            const statusCode = res.statusCode;

            if (skipSuccessfulRequests && statusCode < 400) {
                // Don't count successful requests
            } else if (skipFailedRequests && statusCode >= 400) {
                // Don't count failed requests
            } else {
                // Count this request (already counted in isAllowed)
            }

            return originalSend.call(this, body);
        };

        next();
    };
}

/**
 * Form submission specific rate limiting
 * More restrictive for form submissions
 */
export const formSubmissionRateLimit = createRateLimit({
    windowMs: FORM_SUBMISSION_WINDOW_MS,
    max: 10, // global cap: 10 submissions per minute per IP + User-Agent
    keyGenerator: (req: Request) => {
        const ip = req.ip || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';
        return `${ip}:${userAgent}`;
    },
});

/**
 * Per-form submission limit (form.settings.spamProtection.rateLimit).
 * Keyed as form:{formId}:ip:{clientIp}, 60-second window.
 * Returns true if the request is allowed.
 */
export function checkFormSubmissionRateLimit(
    formId: string,
    ip: string,
    maxPerMinute: number
): boolean {
    const limit = maxPerMinute > 0 ? maxPerMinute : DEFAULT_FORM_RATE_LIMIT_PER_MINUTE;
    const key = `form:${formId}:ip:${ip}`;
    return rateLimiter.isAllowed(key, limit, FORM_SUBMISSION_WINDOW_MS);
}

/** Test helper: clear in-memory counters. */
export function resetFormSubmissionRateLimits(): void {
    rateLimiter.clear();
}

/**
 * API rate limiting for authenticated endpoints
 */
export const apiRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 minutes
    keyGenerator: (req: Request) => {
        // Use user ID if authenticated, otherwise IP
        const userId = (req as any).user?.id;
        return userId ? `user:${userId}` : req.ip || 'unknown';
    },
});

/**
 * Public API rate limiting
 */
export const publicApiRateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    keyGenerator: (req: Request) => req.ip || 'unknown',
});

// Cleanup on process exit
process.on('SIGINT', () => {
    rateLimiter.destroy();
});

process.on('SIGTERM', () => {
    rateLimiter.destroy();
});
