import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { EmailProvider } from '../infrastructure/email/EmailProvider';
import { env } from '../config/env';

/**
 * Authentication service for user registration, verification, and login
 */
export class AuthService {
    constructor(
        private authRepo: AuthRepository,
        private userRepo: UserRepository,
        private emailProvider: EmailProvider
    ) { }

    /**
     * Register a new user and return JWT token
     * @param email - User's email address
     * @param password - Plain text password
     * @returns Promise<{ id: string; email: string; token: string }> - User info with JWT token
     * @throws Error if user already exists or registration fails
     */
    async signUp(email: string, password: string): Promise<{ id: string; email: string; token: string }> {
        // Check if user already exists
        const existingUser = await this.authRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user (email is automatically verified)
        const user = await this.authRepo.createUser({
            email,
            passwordHash,
            isEmailVerified: true,
        });

        // Create blank profile for the user
        await this.userRepo.createProfile(user.id);

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        return {
            id: user.id,
            email: user.email,
            token,
        };
    }

    /**
     * Authenticate user and return JWT token
     * @param email - User's email address
     * @param password - Plain text password
     * @returns Promise<{ token: string }> - JWT token
     * @throws Error if credentials are invalid
     */
    async login(email: string, password: string): Promise<{ token: string }> {
        // Find user by email
        const user = await this.authRepo.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        if (!user.passwordHash) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        return { token };
    }

    /**
     * Verify JWT token and return user info
     * @param token - JWT token to verify
     * @returns Promise<{ id: string; email: string }> - User info from token
     * @throws Error if token is invalid or expired
     */
    async verifyToken(token: string): Promise<{ id: string; email: string }> {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string };
            return {
                id: decoded.sub,
                email: decoded.email,
            };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Request password reset for user
     * @param email - User's email address
     * @returns Promise<void>
     * @throws Error if user not found
     */
    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.authRepo.findByEmail(email);
        if (!user) {
            // Don't reveal if user exists or not for security
            return;
        }

        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save reset token to database
        await this.authRepo.setPasswordResetToken(user.id, resetToken, resetTokenExpires);

        // Send password reset email
        const resetLink = `${env.APP_URL}/reset-password?token=${resetToken}`;
        const emailHtml = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your account. Click the link below to reset your password:</p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
        `;

        await this.emailProvider.send(
            email,
            'Password Reset Request',
            emailHtml
        );
    }

    /**
     * Reset user's password using reset token
     * @param resetToken - The password reset token
     * @param newPassword - The new password
     * @returns Promise<{ id: string; email: string }> - User info
     * @throws Error if token is invalid or expired
     */
    async resetPassword(resetToken: string, newPassword: string): Promise<{ id: string; email: string }> {
        // Find user by reset token
        const user = await this.authRepo.findByPasswordResetToken(resetToken);
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update password and clear reset token
        const updatedUser = await this.authRepo.updatePassword(user.id, passwordHash);

        return {
            id: updatedUser.id,
            email: updatedUser.email,
        };
    }

    /**
     * Verify user email using verification token
     * @param verificationToken - The email verification token
     * @returns Promise<{ id: string; email: string }> - User info
     * @throws Error if token is invalid or expired
     */
    async verifyEmail(verificationToken: string): Promise<{ id: string; email: string }> {
        // Find user by verification token
        const user = await this.authRepo.findByVerificationToken(verificationToken);
        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        // Verify email and clear token
        const verifiedUser = await this.authRepo.verifyUserEmail(user.id);

        return {
            id: verifiedUser.id,
            email: verifiedUser.email,
        };
    }
}
