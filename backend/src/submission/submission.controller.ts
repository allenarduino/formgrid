import { Request, Response } from 'express';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { FormRepository } from '../form/form.repository';
import { createSubmissionSchema, submissionQuerySchema } from './submission.validation';
import { getFileUrl } from '../middleware/fileUpload';

/**
 * Submission controller for handling HTTP requests
 */
export class SubmissionController {
    private submissionService: SubmissionService;

    constructor(submissionService?: SubmissionService) {
        if (submissionService) {
            this.submissionService = submissionService;
        } else {
            // Initialize dependencies for backward compatibility
            const submissionRepo = new SubmissionRepository();
            const formRepo = new FormRepository();
            this.submissionService = new SubmissionService(submissionRepo, formRepo);
        }
    }

    /**
     * POST /api/forms/:endpointSlug/submit
     * Submit data to a form (public endpoint)
     */
    async submitToForm(req: Request, res: Response): Promise<void> {
        try {
            const { endpointSlug } = req.params;

            if (!endpointSlug) {
                res.status(400).json({
                    success: false,
                    message: 'Form endpoint slug is required',
                });
                return;
            }

            // Handle HTML form submissions (application/x-www-form-urlencoded)
            let submissionData;

            // Check if this is an HTML form submission
            const contentType = req.get('Content-Type') || '';
            const isHtmlForm = contentType.includes('application/x-www-form-urlencoded') ||
                contentType.includes('multipart/form-data') ||
                (!contentType.includes('application/json') && Object.keys(req.body).length > 0);

            if (isHtmlForm) {
                // For HTML forms, store ALL fields dynamically in formData
                const { honeypot, 'g-recaptcha-response': recaptchaResponse, ...allFormFields } = req.body;

                // Handle file uploads if any
                const files = req.files as Express.Multer.File[];
                const fileData: { [key: string]: any } = {};

                if (files && files.length > 0) {
                    files.forEach(file => {
                        const fieldName = file.fieldname;
                        if (!fileData[fieldName]) {
                            fileData[fieldName] = [];
                        }
                        fileData[fieldName].push({
                            filename: file.filename,
                            originalName: file.originalname,
                            mimetype: file.mimetype,
                            size: file.size,
                            url: getFileUrl(file.filename)
                        });
                    });
                }

                submissionData = {
                    formData: { ...allFormFields, ...fileData }, // Store ALL fields and files dynamically
                    honeypot,
                    'g-recaptcha-response': recaptchaResponse
                };

                // Validate the processed data
                const validationResult = createSubmissionSchema.safeParse(submissionData);
                if (!validationResult.success) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: validationResult.error.issues.map((err: any) => ({
                            field: err.path.join('.'),
                            message: err.message,
                        })),
                    });
                    return;
                }
                submissionData = validationResult.data;
            } else {
                // For JSON submissions, validate normally
                const validationResult = createSubmissionSchema.safeParse(req.body);
                if (!validationResult.success) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: validationResult.error.issues.map((err: any) => ({
                            field: err.path.join('.'),
                            message: err.message,
                        })),
                    });
                    return;
                }
                submissionData = validationResult.data;
            }

            // Get client IP and User-Agent
            const ip = req.ip || req.connection.remoteAddress || 'unknown';
            const userAgent = req.get('User-Agent') || 'unknown';
            const submission = await this.submissionService.submitToForm(
                endpointSlug,
                submissionData,
                ip,
                userAgent
            );

            // Queue background jobs for notifications
            await this.queueBackgroundJobs(submission, endpointSlug);

            // Use the isHtmlForm variable already declared above

            if (isHtmlForm) {
                // Get form details to check for redirect URL
                const formRepo = new FormRepository();
                const form = await formRepo.findByEndpointSlug(endpointSlug);

                // Use custom redirect URL or default success page
                const redirectUrl = (form?.settings as any)?.redirectUrl || 'http://localhost:5173/success.html';

                return res.redirect(redirectUrl);
            } else {
                // JSON response for API calls
                res.status(201).json({
                    success: true,
                    message: 'Form submitted successfully',
                    data: {
                        id: submission.id,
                        status: submission.status,
                        submittedAt: submission.createdAt,
                    },
                });
            }
        } catch (error) {
            const errorMessage = (error as Error).message;
            const isHtmlForm = req.get('content-type')?.includes('application/x-www-form-urlencoded');

            if (isHtmlForm) {
                // For HTML forms, redirect to error page with error message
                const errorPageUrl = `http://localhost:5173/error.html?message=${encodeURIComponent(errorMessage)}`;
                return res.redirect(errorPageUrl);
            } else {
                // JSON responses for API calls
                if (errorMessage.includes('not found') || errorMessage.includes('not active')) {
                    res.status(404).json({
                        success: false,
                        message: errorMessage,
                    });
                } else if (errorMessage.includes('Rate limit') || errorMessage.includes('Spam')) {
                    res.status(429).json({
                        success: false,
                        message: errorMessage,
                    });
                } else if (errorMessage.includes('required') || errorMessage.includes('must be')) {
                    res.status(400).json({
                        success: false,
                        message: errorMessage,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: 'Failed to submit form',
                        error: errorMessage,
                    });
                }
            }
        }
    }

    /**
     * GET /api/submissions/:id
     * Get a specific submission by ID (protected)
     */
    async getSubmissionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Submission ID is required',
                });
                return;
            }

            const submission = await this.submissionService.getById(id);

            if (!submission) {
                res.status(404).json({
                    success: false,
                    message: 'Submission not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Submission retrieved successfully',
                data: {
                    id: submission.id,
                    formId: submission.formId,
                    payload: submission.payload,
                    name: submission.name,
                    email: submission.email,
                    status: submission.status,
                    createdAt: submission.createdAt,
                    updatedAt: submission.updatedAt,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve submission',
                error: (error as Error).message,
            });
        }
    }

    /**
     * GET /api/forms/:formId/submissions
     * Get all submissions for a specific form (protected)
     */
    async getFormSubmissions(req: Request, res: Response): Promise<void> {
        try {
            const { formId } = req.params;

            if (!formId) {
                res.status(400).json({
                    success: false,
                    message: 'Form ID is required',
                });
                return;
            }

            // Validate query parameters
            const queryResult = submissionQuerySchema.safeParse(req.query);
            if (!queryResult.success) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid query parameters',
                    errors: queryResult.error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }

            const { page = 1, limit = 10 } = queryResult.data;
            const result = await this.submissionService.getByFormId(formId, page, limit);

            res.status(200).json({
                success: true,
                message: 'Form submissions retrieved successfully',
                data: {
                    submissions: result.submissions.map(submission => ({
                        id: submission.id,
                        payload: submission.payload,
                        name: submission.name,
                        email: submission.email,
                        status: submission.status,
                        createdAt: submission.createdAt,
                        updatedAt: submission.updatedAt,
                    })),
                    pagination: {
                        page,
                        limit,
                        total: result.total,
                        totalPages: result.totalPages,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve form submissions',
                error: (error as Error).message,
            });
        }
    }

    /**
     * GET /api/user/submissions
     * Get all submissions for the current user (protected)
     */
    async getUserSubmissions(req: Request, res: Response): Promise<void> {
        try {
            // Get user ID from authenticated request
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }

            // Validate query parameters
            const queryResult = submissionQuerySchema.safeParse(req.query);
            if (!queryResult.success) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid query parameters',
                    errors: queryResult.error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }

            const { page = 1, limit = 10 } = queryResult.data;
            const result = await this.submissionService.getByUserId(userId, page, limit);

            res.status(200).json({
                success: true,
                message: 'User submissions retrieved successfully',
                data: {
                    submissions: result.submissions.map(submission => ({
                        id: submission.id,
                        formId: submission.formId,
                        payload: submission.payload,
                        name: submission.name,
                        email: submission.email,
                        status: submission.status,
                        createdAt: submission.createdAt,
                        updatedAt: submission.updatedAt,
                    })),
                    pagination: {
                        page,
                        limit,
                        total: result.total,
                        totalPages: result.totalPages,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve user submissions',
                error: (error as Error).message,
            });
        }
    }

    /**
     * DELETE /api/submissions/:id
     * Delete a single submission (protected)
     */
    async deleteSubmission(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Submission ID is required',
                });
                return;
            }

            const deletedSubmission = await this.submissionService.delete(id);

            res.status(200).json({
                success: true,
                message: 'Submission deleted successfully',
                data: {
                    id: deletedSubmission.id,
                    deletedAt: new Date().toISOString(),
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete submission',
                error: (error as Error).message,
            });
        }
    }

    /**
     * POST /api/submissions/bulk/delete
     * Bulk delete submissions (protected)
     */
    async bulkDeleteSubmissions(req: Request, res: Response): Promise<void> {
        try {
            const { submissionIds } = req.body;

            if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Submission IDs array is required',
                });
                return;
            }

            const deletedCount = await this.submissionService.bulkDelete(submissionIds);

            res.status(200).json({
                success: true,
                message: `${deletedCount} submission(s) deleted successfully`,
                data: {
                    deletedCount,
                    deletedAt: new Date().toISOString(),
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete submissions',
                error: (error as Error).message,
            });
        }
    }

    /**
     * POST /api/submissions/bulk/spam
     * Mark submissions as spam (protected)
     */
    async markSubmissionsAsSpam(req: Request, res: Response): Promise<void> {
        try {
            const { submissionIds } = req.body;

            if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Submission IDs array is required',
                });
                return;
            }

            const updatedCount = await this.submissionService.markAsSpam(submissionIds);

            res.status(200).json({
                success: true,
                message: `${updatedCount} submission(s) marked as spam successfully`,
                data: {
                    updatedCount,
                    updatedAt: new Date().toISOString(),
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to mark submissions as spam',
                error: (error as Error).message,
            });
        }
    }

    /**
     * PUT /api/submissions/:id
     * Update a submission status (protected)
     */
    async updateSubmission(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Submission ID is required',
                });
                return;
            }

            // Get user ID from authenticated request
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }

            const { status } = req.body;

            if (!status || !['new', 'read', 'responded'].includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Valid status is required (new, read, responded)',
                });
                return;
            }

            const submission = await this.submissionService.update(id, { status });

            res.status(200).json({
                success: true,
                message: 'Submission updated successfully',
                data: {
                    id: submission.id,
                    status: submission.status,
                    updatedAt: submission.updatedAt,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update submission',
                error: (error as Error).message,
            });
        }
    }

    /**
     * Queue background jobs for notifications
     * @param submission - The submission
     * @param endpointSlug - The form endpoint slug
     */
    private async queueBackgroundJobs(submission: any, endpointSlug: string): Promise<void> {
        try {
            // Get form details for notifications
            const formRepo = new FormRepository();
            const form = await formRepo.findByEndpointSlug(endpointSlug);

            if (form) {
                // Queue email notification
                await this.submissionService.queueEmailNotification(submission, form);

                // Queue webhook
                await this.submissionService.queueWebhook(submission, form);
            }
        } catch (error) {
            // Log error but don't fail the submission
            console.error('Failed to queue background jobs:', error);
        }
    }
}
