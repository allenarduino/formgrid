import { Router } from 'express';
import { SubmissionController } from './submission.controller';
import { authMiddleware } from '../presentation/middleware/auth';
import { formSubmissionRateLimit, apiRateLimit } from '../middleware/rateLimit';
import { rateLimiters } from '../middleware/enhancedRateLimit';
import { handleFileUpload } from '../middleware/fileUpload';

/**
 * Submission routes
 */
export function createSubmissionRoutes(submissionController?: SubmissionController): Router {
    const router = Router();
    const controller = submissionController || new SubmissionController();

    // Bind methods to preserve 'this' context
    const submitToForm = controller.submitToForm.bind(controller);
    const getSubmissionById = controller.getSubmissionById.bind(controller);
    const getFormSubmissions = controller.getFormSubmissions.bind(controller);
    const getUserSubmissions = controller.getUserSubmissions.bind(controller);
    const updateSubmission = controller.updateSubmission.bind(controller);
    const deleteSubmission = controller.deleteSubmission.bind(controller);
    const bulkDeleteSubmissions = controller.bulkDeleteSubmissions.bind(controller);
    const markSubmissionsAsSpam = controller.markSubmissionsAsSpam.bind(controller);

    // Public routes (no authentication required)
    // Apply both basic and enhanced rate limiting

    // Formspree-style URL: /f/:endpointSlug
    router.post('/f/:endpointSlug',
        formSubmissionRateLimit,
        rateLimiters.formSpecific.middleware(),
        handleFileUpload,
        submitToForm
    );

    // API-prefixed Formspree-style URL: /api/f/:endpointSlug
    router.post('/api/f/:endpointSlug',
        formSubmissionRateLimit,
        rateLimiters.formSpecific.middleware(),
        handleFileUpload,
        submitToForm
    );

    // Original API-style URL: /forms/:endpointSlug/submit
    router.post('/forms/:endpointSlug/submit',
        formSubmissionRateLimit,
        rateLimiters.formSpecific.middleware(),
        handleFileUpload,
        submitToForm
    );

    // Protected routes (authentication required)
    router.get('/submissions/:id', authMiddleware, apiRateLimit, getSubmissionById);
    router.get('/forms/:formId/submissions', authMiddleware, apiRateLimit, getFormSubmissions);
    router.get('/user/submissions', authMiddleware, apiRateLimit, getUserSubmissions);
    router.put('/submissions/:id', authMiddleware, apiRateLimit, updateSubmission);
    router.delete('/submissions/:id', authMiddleware, apiRateLimit, deleteSubmission);
    router.post('/submissions/bulk/delete', authMiddleware, apiRateLimit, bulkDeleteSubmissions);
    router.post('/submissions/bulk/spam', authMiddleware, apiRateLimit, markSubmissionsAsSpam);

    return router;
}

// Export individual route handlers for testing
export { SubmissionController };
