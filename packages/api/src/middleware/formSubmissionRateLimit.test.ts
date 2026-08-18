import {
    checkFormSubmissionRateLimit,
    resetFormSubmissionRateLimits,
} from './rateLimit';
import { resolveSpamProtectionSettings } from '../form/spamProtectionDefaults';

describe('checkFormSubmissionRateLimit', () => {
    beforeEach(() => {
        resetFormSubmissionRateLimits();
    });

    afterEach(() => {
        resetFormSubmissionRateLimits();
    });

    it('allows N requests and blocks N+1', () => {
        const formId = 'form-1';
        const ip = '203.0.113.10';
        const maxPerMinute = 3;

        expect(checkFormSubmissionRateLimit(formId, ip, maxPerMinute)).toBe(true);
        expect(checkFormSubmissionRateLimit(formId, ip, maxPerMinute)).toBe(true);
        expect(checkFormSubmissionRateLimit(formId, ip, maxPerMinute)).toBe(true);
        expect(checkFormSubmissionRateLimit(formId, ip, maxPerMinute)).toBe(false);
    });

    it('uses separate keys per form', () => {
        const ip = '203.0.113.10';

        expect(checkFormSubmissionRateLimit('form-a', ip, 1)).toBe(true);
        expect(checkFormSubmissionRateLimit('form-a', ip, 1)).toBe(false);
        expect(checkFormSubmissionRateLimit('form-b', ip, 1)).toBe(true);
    });

    it('uses separate keys per IP', () => {
        const formId = 'form-1';

        expect(checkFormSubmissionRateLimit(formId, '203.0.113.10', 1)).toBe(true);
        expect(checkFormSubmissionRateLimit(formId, '203.0.113.10', 1)).toBe(false);
        expect(checkFormSubmissionRateLimit(formId, '198.51.100.20', 1)).toBe(true);
    });
});

describe('resolveSpamProtectionSettings', () => {
    it('defaults rateLimit to 10', () => {
        expect(resolveSpamProtectionSettings(undefined).rateLimit).toBe(10);
        expect(resolveSpamProtectionSettings({}).rateLimit).toBe(10);
    });

    it('uses the configured rateLimit', () => {
        expect(resolveSpamProtectionSettings({ rateLimit: 2 }).rateLimit).toBe(2);
        expect(resolveSpamProtectionSettings({ rateLimit: 3 }).rateLimit).toBe(3);
    });
});
