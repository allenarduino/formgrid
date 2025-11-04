import { PrismaClient, User } from '@prisma/client';
import { prisma } from '../config/prisma';

/**
 * Authentication repository for user authentication operations
 * Handles auth-specific database queries
 */
export class AuthRepository {
    private prisma: PrismaClient;

    constructor(prismaClient?: PrismaClient) {
        this.prisma = prismaClient || prisma;
    }

    /**
     * Create a new user with authentication data
     * @param data - User creation data including email and passwordHash
     * @returns Promise<User> - The created user
     */
    async createUser(data: {
        email: string;
        passwordHash: string;
        isEmailVerified?: boolean;
        verificationToken?: string;
        verificationTokenExpires?: Date;
    }): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                isEmailVerified: data.isEmailVerified || false,
                verificationToken: data.verificationToken || null,
                verificationTokenExpires: data.verificationTokenExpires || null,
            },
        });
    }

    /**
     * Find a user by their email address
     * @param email - The email address to search for
     * @returns Promise<User | null> - The user if found, null otherwise
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Find a user by their unique ID
     * @param id - The user ID to search for
     * @returns Promise<User | null> - The user if found, null otherwise
     */
    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Update a user with the provided data
     * @param id - The user ID to update
     * @param data - Partial user data to update
     * @returns Promise<User> - The updated user
     */
    async updateUser(id: string, data: Partial<User>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    /**
     * Check if a user exists by email
     * @param email - The email address to check
     * @returns Promise<boolean> - True if user exists, false otherwise
     */
    async userExistsByEmail(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return user !== null;
    }

    /**
     * Set password reset token for user
     * @param userId - The user ID to set reset token for
     * @param resetToken - The password reset token
     * @param resetExpires - When the token expires
     * @returns Promise<User> - The updated user
     */
    async setPasswordResetToken(userId: string, resetToken: string, resetExpires: Date): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires: resetExpires,
            },
        });
    }

    /**
     * Find user by password reset token
     * @param resetToken - The password reset token to search for
     * @returns Promise<User | null> - The user if found and token is valid, null otherwise
     */
    async findByPasswordResetToken(resetToken: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                passwordResetToken: resetToken,
                passwordResetExpires: {
                    gt: new Date(), // Token must not be expired
                },
            },
        });
    }

    /**
     * Update user's password and clear reset token
     * @param userId - The user ID to update password for
     * @param passwordHash - The new hashed password
     * @returns Promise<User> - The updated user
     */
    async updatePassword(userId: string, passwordHash: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
    }

    /**
     * Find user by verification token
     * @param verificationToken - The verification token to search for
     * @returns Promise<User | null> - The user if found and token is valid, null otherwise
     */
    async findByVerificationToken(verificationToken: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                verificationToken: verificationToken,
                verificationTokenExpires: {
                    gt: new Date(), // Token must not be expired
                },
            },
        });
    }

    /**
     * Verify user email and clear verification token
     * @param userId - The user ID to verify
     * @returns Promise<User> - The updated user
     */
    async verifyUserEmail(userId: string): Promise<User> {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null,
            },
        });
    }
}
