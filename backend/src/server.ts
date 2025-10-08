import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import { config } from 'dotenv';
import path from 'path';
import { createAuthRoutes } from './auth';
import { createUserRoutes } from './user';
import { createFormRoutes } from './form';
import { createSubmissionRoutes } from './submission';
import { prisma } from './config/prisma';
import { env } from './config/env';
import { createEmailProvider } from './infrastructure/email';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { FormService } from './form/form.service';
import { SubmissionService } from './submission/submission.service';
import { AuthRepository } from './auth/auth.repository';
import { UserRepository } from './user/user.repository';
import { FormRepository } from './form/form.repository';
import { SubmissionRepository } from './submission/submission.repository';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { FormController } from './form/form.controller';
import { SubmissionController } from './submission/submission.controller';
import { configureGoogleStrategy } from './auth/google.strategy';

// Load environment variables
config();

const app = express();
const PORT = env.PORT || 4000;

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5500',  // Added for HTML file testing
        'http://localhost:5500'   // Added for HTML file testing
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize repositories with Prisma instance
const authRepository = new AuthRepository(prisma);
const userRepository = new UserRepository(prisma);
const formRepository = new FormRepository(prisma);
const submissionRepository = new SubmissionRepository(prisma);

// Initialize email provider based on environment
const emailProvider = createEmailProvider();

// Initialize services with dependencies
const authService = new AuthService(authRepository, userRepository, emailProvider);
const userService = new UserService(userRepository);
const formService = new FormService(formRepository);
const submissionService = new SubmissionService(submissionRepository, formRepository);

// Initialize controllers with services
const authController = new AuthController(authService);
const userController = new UserController(userService);
const formController = new FormController(formService);
const submissionController = new SubmissionController(submissionService);

// Initialize Passport and Google OAuth strategy
configureGoogleStrategy();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/user', createUserRoutes(userController));
app.use('/api/forms', createFormRoutes(formController));
app.use('/api', createSubmissionRoutes(submissionController));

// Root route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Express + TypeScript Authentication API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            user: '/api/user',
            forms: '/api/forms',
            submissions: '/api',
            health: '/health'
        }
    });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', error);

    res.status(400).json({
        success: false,
        error: error.message || 'Internal server error'
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
        await prisma.$disconnect();
        console.log('Prisma client disconnected');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

// Start server
const server = app.listen(PORT, () => {
    console.log('====================================');
    console.log('🚀 Server is running!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV || 'development'}`);
    console.log(`📧 Email Provider: ${env.EMAIL_PROVIDER || 'console'}`);
    console.log('====================================');
    console.log('\n📋 Available endpoints:');
    console.log('  GET  /health - Health check');
    console.log('  POST /api/auth/signup - Register user');
    console.log('  GET  /api/auth/verify?token=xxx - Verify email');
    console.log('  POST /api/auth/login - Login user');
    console.log('  GET  /api/auth/google - Google OAuth login');
    console.log('  GET  /api/auth/google/callback - Google OAuth callback');
    console.log('  GET  /api/auth/me - Get current user (protected)');
    console.log('  GET  /api/user/me - Get user profile (protected)');
    console.log('  PUT  /api/user/me/profile - Update profile (protected)');
    console.log('  GET  /api/forms - Get all forms (protected)');
    console.log('  POST /api/forms - Create form (protected)');
    console.log('  GET  /api/forms/:id - Get form by ID (protected)');
    console.log('  PUT  /api/forms/:id - Update form (protected)');
    console.log('  DELETE /api/forms/:id - Delete form (protected)');
    console.log('  GET  /api/forms/slug/:endpointSlug - Get form by slug (public)');
    console.log('  POST /api/f/:endpointSlug - Submit to form (public, Formspree-style)');
    console.log('  DELETE /api/submissions/:id - Delete submission (protected)');
    console.log('  POST /api/submissions/bulk/delete - Bulk delete submissions (protected)');
    console.log('  POST /api/submissions/bulk/spam - Mark submissions as spam (protected)');
    console.log('  POST /api/forms/:endpointSlug/submit - Submit to form (public)');
    console.log('  GET  /api/submissions/:id - Get submission by ID (protected)');
    console.log('  GET  /api/forms/:formId/submissions - Get form submissions (protected)');
    console.log('  GET  /api/user/submissions - Get user submissions (protected)');
    console.log('  PUT  /api/submissions/:id - Update submission status (protected)');
    console.log('====================================');
});

// Export for testing
export { app, server };