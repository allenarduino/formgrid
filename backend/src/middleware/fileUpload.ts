import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

// File filter to validate file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow all file types for now, but you can add restrictions here
    // Example: only allow images
    // if (file.mimetype.startsWith('image/')) {
    //     cb(null, true);
    // } else {
    //     cb(new Error('Only image files are allowed'));
    // }
    cb(null, true);
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Maximum 10 files per request
    }
});

// Middleware for handling file uploads
export const handleFileUpload = upload.any();

// Helper function to get file URLs
export const getFileUrl = (filename: string): string => {
    return `/uploads/${filename}`;
};

// Helper function to delete file
export const deleteFile = (filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(uploadDir, filename);
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
