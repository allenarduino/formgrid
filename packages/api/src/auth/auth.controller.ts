import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { createEmailProvider } from '../infrastructure/email';
import { signupSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema } from './auth.validation';
import { env } from '../config/env';

/**
 * Authentication controller for handling HTTP requests
 */
export class AuthController {
    private authService: AuthService;
    private authRepo: AuthRepository;

    constructor(authService?: AuthService) {
        if (authService) {
            this.authService = authService;
            this.authRepo = new AuthRepository();
        } else {
            // Initialize dependencies for backward compatibility
            this.authRepo = new AuthRepository();
            const userRepo = new UserRepository();
            const emailProvider = createEmailProvider();
            this.authService = new AuthService(this.authRepo, userRepo, emailProvider);
        }
    }

    /**
     * POST /api/auth/signup
     * Register a new user
     */
    async signUp(req: Request, res: Response): Promise<void> {
        try {
            // Validate input with Zod
            const validationResult = signupSchema.safeParse(req.body);
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

            const { email, password } = validationResult.data;
            const result = await this.authService.signUp(email, password);

            res.status(201).json({
                success: true,
                message: 'User created successfully.',
                data: {
                    id: result.id,
                    email: result.email,
                    token: result.token,
                },
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            // Validate input with Zod
            const validationResult = loginSchema.safeParse(req.body);
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

            const { email, password } = validationResult.data;
            const result = await this.authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token: result.token,
                },
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    /**
     * POST /api/auth/verify-token
     * Verify JWT token and return user info
     */
    async verifyToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;

            if (!token) {
                res.status(400).json({
                    success: false,
                    message: 'Token is required',
                });
                return;
            }

            const userInfo = await this.authService.verifyToken(token);

            res.status(200).json({
                success: true,
                message: 'Token is valid',
                data: userInfo,
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    /**
     * GET /api/auth/me
     * Get current user info from JWT token
     */
    async getMe(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({
                    success: false,
                    message: 'Authorization header with Bearer token is required',
                });
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            const userInfo = await this.authService.verifyToken(token);

            // Fetch full user data from database including Google OAuth fields
            const fullUser = await this.authRepo.findById(userInfo.id);

            if (!fullUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
                return;
            }

            // Return full user data
            res.status(200).json({
                success: true,
                message: 'User info retrieved successfully',
                data: {
                    id: fullUser.id,
                    email: fullUser.email,
                },
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    /**
     * POST /api/auth/forgot-password
     * Request password reset
     */
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            // Validate input with Zod
            const validationResult = passwordResetRequestSchema.safeParse(req.body);
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

            const { email } = validationResult.data;
            await this.authService.requestPasswordReset(email);

            // Always return success for security (don't reveal if user exists)
            res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    /**
     * POST /api/auth/reset-password
     * Reset password using reset token
     */
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            // Validate input with Zod
            const validationResult = passwordResetSchema.safeParse(req.body);
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

            const { token, password } = validationResult.data;
            const user = await this.authService.resetPassword(token, password);

            res.status(200).json({
                success: true,
                message: 'Password reset successfully',
                data: {
                    id: user.id,
                    email: user.email,
                },
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    /**
     * GET /api/auth/verify
     * Verify email using verification token - returns HTML page
     */
    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query;

            if (!token || typeof token !== 'string') {
                res.status(400).send(this.getErrorPage('Verification token is required'));
                return;
            }

            const user = await this.authService.verifyEmail(token);

            // Return success HTML page
            res.status(200).send(this.getSuccessPage(user.email));
        } catch (error) {
            // Return error HTML page
            res.status(400).send(this.getErrorPage((error as Error).message));
        }
    }

    /**
     * Get success HTML page for email verification
     */
    private getSuccessPage(email: string): string {
        const loginUrl = `${env.APP_URL}/login`;
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified Successfully</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
        <p class="text-gray-600 mb-4">Your email address <strong>${email}</strong> has been successfully verified.</p>
        <p class="text-gray-600 mb-6">You can now log in to your account.</p>
        <a href="${loginUrl}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
            Go to Login
        </a>
    </div>
</body>
</html>
        `;
    }

    /**
     * Get error HTML page for email verification
     */
    private getErrorPage(errorMessage: string): string {
        const loginUrl = `${env.APP_URL}/login`;
        // Escape HTML in error message to prevent XSS
        const safeErrorMessage = errorMessage
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Failed</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p class="text-gray-600 mb-4">${safeErrorMessage}</p>
        <p class="text-gray-600 mb-6">The verification link may be invalid or expired. Please request a new verification email.</p>
        <a href="${loginUrl}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
            Go to Login
        </a>
    </div>
</body>
</html>
        `;
    }
}
