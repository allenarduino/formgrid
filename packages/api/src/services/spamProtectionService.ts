import axios from 'axios';
import { env } from '../config/env';

/**
 * Spam protection configuration interface
 */
export interface SpamProtectionConfig {
    honeypotField?: string;
    enableRecaptcha?: boolean;
    recaptchaSecret?: string;
    rateLimitPerIp?: number;
    rateLimitPerForm?: number;
    rateLimitWindow?: number; // in minutes
}

/**
 * reCAPTCHA verification response
 */
interface RecaptchaResponse {
    success: boolean;
    'error-codes'?: string[];
    challenge_ts?: string;
    hostname?: string;
}

/**
 * Rate limiting data structure
 */
interface RateLimitData {
    count: number;
    resetTime: number;
}

/**
 * SpamProtectionService for handling various spam protection mechanisms
 */
export class SpamProtectionService {
    private rateLimitStore: Map<string, RateLimitData> = new Map();

    /**
     * Validate honeypot field
     * @param payload - Submission payload
     * @param honeypotField - Name of the honeypot field (default: 'website')
     * @returns boolean - true if valid (honeypot is empty), false if spam
     */
    validateHoneypot(payload: Record<string, any>, honeypotField: string = 'website'): boolean {
        // Honeypot should be empty or contain only whitespace
        const honeypotValue = payload[honeypotField];
        return !honeypotValue || (typeof honeypotValue === 'string' && honeypotValue.trim() === '');
    }

    /**
     * Verify Google reCAPTCHA token
     * This is the core CAPTCHA verification function that talks to Google's servers
     * 
     * @param token - reCAPTCHA token from frontend (generated when user completes "I'm not a robot")
     * @param secret - reCAPTCHA secret key (from environment variables)
     * @param remoteIp - Client's IP address (optional, for additional verification)
     * @returns Promise<boolean> - true if valid, false if invalid
     */
    async verifyRecaptcha(token: string, secret: string, remoteIp?: string): Promise<boolean> {
        // Validate inputs - both token and secret are required
        if (!token || !secret) {
            console.log('reCAPTCHA verification skipped: missing token or secret');
            return false;
        }

        console.log('Verifying reCAPTCHA token with Google...', {
            tokenPreview: token.substring(0, 20) + '...',
            hasSecret: !!secret,
            clientIp: remoteIp
        });

        try {
            // Send verification request to Google's reCAPTCHA API
            const response = await axios.post<RecaptchaResponse>(
                'https://www.google.com/recaptcha/api/siteverify',
                new URLSearchParams({
                    secret,           // Your private secret key
                    response: token,  // Token from frontend
                    ...(remoteIp && { remoteip: remoteIp }), // Optional IP verification
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 10000, // 10 second timeout to avoid hanging
                }
            );

            const { success, 'error-codes': errorCodes } = response.data;

            // Google returns success: true/false
            if (!success) {
                console.warn('reCAPTCHA verification failed:', {
                    errorCodes,
                    tokenPreview: token.substring(0, 20) + '...'
                });
                return false;
            }

            console.log('reCAPTCHA verification successful');
            return true;
        } catch (error) {
            console.error('reCAPTCHA verification error:', error);
            return false;
        }
    }

    /**
     * Check rate limiting for IP address
     * @param ip - Client IP address
     * @param limit - Maximum requests per window
     * @param windowMinutes - Time window in minutes
     * @returns boolean - true if within limit, false if rate limited
     */
    checkRateLimitByIp(ip: string, limit: number = 10, windowMinutes: number = 60): boolean {
        const key = `ip:${ip}`;
        return this.checkRateLimit(key, limit, windowMinutes);
    }

    /**
     * Check rate limiting for form
     * @param formId - Form ID
     * @param limit - Maximum requests per window
     * @param windowMinutes - Time window in minutes
     * @returns boolean - true if within limit, false if rate limited
     */
    checkRateLimitByForm(formId: string, limit: number = 50, windowMinutes: number = 60): boolean {
        const key = `form:${formId}`;
        return this.checkRateLimit(key, limit, windowMinutes);
    }

    /**
     * Check rate limiting for IP + Form combination
     * @param ip - Client IP address
     * @param formId - Form ID
     * @param limit - Maximum requests per window
     * @param windowMinutes - Time window in minutes
     * @returns boolean - true if within limit, false if rate limited
     */
    checkRateLimitByIpAndForm(ip: string, formId: string, limit: number = 5, windowMinutes: number = 60): boolean {
        const key = `ip_form:${ip}:${formId}`;
        return this.checkRateLimit(key, limit, windowMinutes);
    }

    /**
     * Generic rate limiting check
     * @param key - Unique key for rate limiting
     * @param limit - Maximum requests per window
     * @param windowMinutes - Time window in minutes
     * @returns boolean - true if within limit, false if rate limited
     */
    private checkRateLimit(key: string, limit: number, windowMinutes: number): boolean {
        const now = Date.now();
        const windowMs = windowMinutes * 60 * 1000;
        const resetTime = now + windowMs;

        const existing = this.rateLimitStore.get(key);

        if (!existing) {
            // First request
            this.rateLimitStore.set(key, { count: 1, resetTime });
            return true;
        }

        if (now > existing.resetTime) {
            // Window has expired, reset
            this.rateLimitStore.set(key, { count: 1, resetTime });
            return true;
        }

        if (existing.count >= limit) {
            // Rate limit exceeded
            return false;
        }

        // Increment count
        existing.count++;
        this.rateLimitStore.set(key, existing);
        return true;
    }

    /**
     * Clean up expired rate limit entries
     */
    cleanupExpiredEntries(): void {
        const now = Date.now();
        for (const [key, data] of this.rateLimitStore.entries()) {
            if (now > data.resetTime) {
                this.rateLimitStore.delete(key);
            }
        }
    }

    /**
     * Get rate limit status for a key
     * @param key - Rate limit key
     * @returns Rate limit status or null if not found
     */
    getRateLimitStatus(key: string): { count: number; resetTime: number; remaining: number } | null {
        const data = this.rateLimitStore.get(key);
        if (!data) {
            return null;
        }

        const now = Date.now();
        if (now > data.resetTime) {
            return null; // Expired
        }

        return {
            count: data.count,
            resetTime: data.resetTime,
            remaining: Math.max(0, data.resetTime - now),
        };
    }

    /**
     * Comprehensive spam check - This is where all spam protection happens
     * This function runs multiple checks in sequence: honeypot, rate limiting, and CAPTCHA
     * 
     * @param payload - Submission payload (contains all form fields + CAPTCHA token)
     * @param ip - Client IP address (for rate limiting and CAPTCHA verification)
     * @param formId - Form ID (for per-form rate limiting)
     * @param config - Spam protection configuration (from dashboard settings)
     * @returns Promise<{ isValid: boolean; reason?: string }>
     */
    async performSpamCheck(
        payload: Record<string, any>,
        ip: string,
        formId: string,
        config: SpamProtectionConfig
    ): Promise<{ isValid: boolean; reason?: string }> {
        console.log('Starting comprehensive spam check...', {
            ip,
            formId,
            configEnabled: {
                honeypot: !!config.honeypotField,
                captcha: !!config.enableRecaptcha,
                rateLimit: !!config.rateLimitPerIp
            }
        });

        // 1. HONEYPOT CHECK - Check if hidden field was filled by bots
        if (config.honeypotField) {
            console.log('Checking honeypot field...');
            if (!this.validateHoneypot(payload, config.honeypotField)) {
                console.log('Honeypot check failed - bot detected');
                return { isValid: false, reason: 'Honeypot field filled - likely spam' };
            }
            console.log('Honeypot check passed');
        }

        // 2. RATE LIMITING CHECKS - Prevent spam by limiting submissions per IP/form
        if (config.rateLimitPerIp) {
            console.log(`Checking IP rate limit: ${config.rateLimitPerIp} per ${config.rateLimitWindow} minutes`);
            if (!this.checkRateLimitByIp(ip, config.rateLimitPerIp, config.rateLimitWindow)) {
                console.log('IP rate limit exceeded');
                return { isValid: false, reason: 'IP rate limit exceeded' };
            }
            console.log('IP rate limit check passed');
        }

        if (config.rateLimitPerForm) {
            console.log(`Checking form rate limit: ${config.rateLimitPerForm} per ${config.rateLimitWindow} minutes`);
            if (!this.checkRateLimitByForm(formId, config.rateLimitPerForm, config.rateLimitWindow)) {
                console.log('Form rate limit exceeded');
                return { isValid: false, reason: 'Form rate limit exceeded' };
            }
            console.log('Form rate limit check passed');
        }

        if (config.rateLimitPerIp || config.rateLimitPerForm) {
            const ipFormLimit = Math.min(config.rateLimitPerIp || 10, config.rateLimitPerForm || 50) || 5;
            console.log(`Checking IP+Form rate limit: ${ipFormLimit} per ${config.rateLimitWindow} minutes`);
            if (!this.checkRateLimitByIpAndForm(ip, formId, ipFormLimit, config.rateLimitWindow)) {
                console.log('IP+Form rate limit exceeded');
                return { isValid: false, reason: 'IP + Form rate limit exceeded' };
            }
            console.log('IP+Form rate limit check passed');
        }

        // 3. reCAPTCHA VERIFICATION - The main CAPTCHA check
        if (config.enableRecaptcha && config.recaptchaSecret) {
            console.log('Starting reCAPTCHA verification...');

            // Look for reCAPTCHA token in form data
            // Frontend can send it as either 'recaptcha_token' or 'g-recaptcha-response'
            const recaptchaToken = payload.recaptcha_token || payload['g-recaptcha-response'];

            if (!recaptchaToken) {
                console.log('reCAPTCHA token missing from form data');
                return { isValid: false, reason: 'reCAPTCHA token required' };
            }

            console.log('reCAPTCHA token found, verifying with Google...');

            // Verify token with Google's servers
            const isRecaptchaValid = await this.verifyRecaptcha(recaptchaToken, config.recaptchaSecret, ip);
            if (!isRecaptchaValid) {
                console.log('reCAPTCHA verification failed');
                return { isValid: false, reason: 'reCAPTCHA verification failed' };
            }

            console.log('reCAPTCHA verification passed');
        }

        console.log('All spam protection checks passed - submission is valid');
        return { isValid: true };
    }

    /**
     * Get default spam protection configuration
     * @returns Default configuration
     */
    getDefaultConfig(): SpamProtectionConfig {
        return {
            honeypotField: 'website',
            enableRecaptcha: false,
            ...(env.RECAPTCHA_SECRET_KEY && { recaptchaSecret: env.RECAPTCHA_SECRET_KEY }),
            rateLimitPerIp: 10,
            rateLimitPerForm: 50,
            rateLimitWindow: 60, // 1 hour
        };
    }
}
