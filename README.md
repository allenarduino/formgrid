# FormGrid

**Form Endpoint API Generator** - Create powerful API endpoints for your HTML forms. Generate secure, spam-protected form endpoints that work with any website or application. Built with Node.js, React, and TypeScript, featuring comprehensive file upload capabilities and multi-storage support.

Kindly find examples at [Formgrid Examples](https://github.com/allenarduino/formgrid-examples)

## Features

### API Endpoint Generation
- **Instant API Creation** - Generate secure form endpoints in seconds
- **Unique Endpoint URLs** - Each form gets its own dedicated API endpoint
- **Multiple Submission Methods** - HTML forms, JavaScript, or direct API calls
- **Automatic Code Generation** - Get ready-to-use HTML and JavaScript snippets
- **Cross-Origin Support** - Works with any website or application

### File Upload System
- **Multiple Storage Options** - Local, MinIO, AWS S3, and Google Cloud Storage
- **File Type Restrictions** - Configure accepted file types per field
- **Multiple File Uploads** - Allow single or multiple files per field
- **File Size Limits** - Configurable file size restrictions
- **Secure File Serving** - Protected file access with proper URLs

### Dashboard & Management
- **Modern Dashboard** - Clean, responsive interface with comprehensive analytics
- **Submission Management** - View, filter, and manage form submissions
- **File Management** - Download and preview uploaded files
- **Form Analytics** - Track submission counts and form performance
- **Bulk Operations** - Mark submissions as spam, delete multiple submissions

### Developer Experience
- **Zero Backend Required** - No server setup needed for form handling
- **Universal Integration** - Works with any frontend framework or static site
- **Webhook Support** - Real-time notifications for new submissions
- **RESTful API** - Standard HTTP methods for form submissions
- **Rate Limiting** - Built-in protection against spam and abuse

### Authentication & Security
- **JWT Authentication** - Secure token-based authentication
- **Email/Password Auth** - Simple signup and login with JWT tokens
- **Password Reset** - Secure email-based password reset flow (optional)
- **Protected Routes** - Route-level authentication guards
- **Spam Protection** - Honeypot and reCAPTCHA integration

## Project Structure

This is a **monorepo** managed with **pnpm workspaces**:

```
formgrid/
├── apps/                          # End-user facing applications
│   └── dashboard/                 # React + Vite dashboard (@formgrid/dashboard)
│       ├── src/
│       │   ├── components/        # Reusable UI components
│       │   ├── pages/             # Application pages (Dashboard, Form Builder)
│       │   ├── layouts/           # Layout components
│       │   ├── context/           # React context providers
│       │   ├── hooks/             # Custom React hooks
│       │   └── lib/               # Utility libraries
│       └── public/                # Static assets
├── packages/                      # Reusable libraries & backend code
│   ├── api/                       # Node.js + TypeScript API (@formgrid/api)
│   │   ├── src/
│   │   │   ├── auth/              # Authentication logic & routes
│   │   │   ├── user/              # User management
│   │   │   ├── form/              # Form creation and management
│   │   │   ├── submission/        # Form submission handling
│   │   │   ├── services/          # Email, spam protection, analytics
│   │   │   ├── middleware/        # Rate limiting, file uploads
│   │   │   ├── infrastructure/    # Storage adapters, email providers
│   │   │   ├── jobs/              # Queues, cron jobs, async tasks
│   │   │   └── scripts/           # Utility scripts for maintenance
│   │   ├── prisma/                # Database schema and migrations
│   │   ├── tests/                 # Unit & integration tests
│   │   └── uploads/               # Local file storage
│   └── cli/                       # CLI tool (@formgrid/cli)
│       └── src/                   # Supabase-like CLI for Docker management
├── docker/                        # Docker configurations
│   ├── docker-compose.yml         # Multi-storage Docker configuration
│   ├── docker-compose.override.yml
│   └── README.md
├── scripts/                       # Monorepo-level dev scripts
├── Makefile                       # Convenience commands for dev/build/deploy
├── package.json                   # Root workspace configuration
├── pnpm-workspace.yaml            # pnpm workspace definition
├── tsconfig.base.json             # Shared TypeScript config
├── STORAGE_SETUP.md              # Storage configuration guide
└── README.md                     # This file
```

## Quick Start

### For End Users (Simple Setup)

```bash
# 1. Install the CLI
npm install -g formgrid-cli

# 2. Clone the repository
git clone <repository-url>
cd formgrid

# 3. Install dependencies
npm install -g pnpm
pnpm install

# 4. Initialize environment files
formgrid init

# 5. Start everything
formgrid start -d

# 6. Access at http://localhost:5173
```

**That's it!** See [INSTALLATION.md](INSTALLATION.md) for detailed setup options.

---

### For Developers (Full Setup)

#### Prerequisites
- Node.js 18+ 
- pnpm 8+ (recommended) - `npm install -g pnpm`
- Docker and Docker Compose
- MySQL (or use Docker)

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd formgrid
   ```

2. **Install dependencies**
   ```bash
   # Install all workspace dependencies
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend environment
   cd packages/api
   cp .env.example .env
   # Edit .env with your configuration
   cd ../..
   ```

4. **Set up the database**
   ```bash
   cd packages/api
   npx prisma migrate dev
   npx prisma generate
   cd ../..
   ```

5. **Start the application**
   ```bash
   # Using Docker (recommended)
   make run-local
   # or: docker compose -f docker/docker-compose.yml up --build

   # Or run locally (development)
   pnpm run dev
   # This runs both dashboard and api in parallel

   # Or run individually
   pnpm run dashboard:dev  # Frontend only
   pnpm run api:dev        # Backend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4001
   - MinIO Console: http://localhost:9001 (if using MinIO storage)

## CLI Tool

FormGrid comes with a Supabase-like CLI for managing your local Docker instance.

### Install the CLI

```bash
# Install globally from npm
npm install -g formgrid-cli

# Or use without installing
npx formgrid-cli start
```

### Using the CLI

```bash
# First time setup
formgrid init          # Create environment files

# Start and manage
formgrid start -d      # Start in background
formgrid status        # Check status
formgrid logs          # View logs
formgrid stop          # Stop everything

# Or from monorepo root (without global install)
pnpm formgrid init
pnpm formgrid start -d
pnpm formgrid status

# All available commands
formgrid --help
```

### Available Commands

| Command | Description |
|---------|-------------|
| `formgrid init` | **Initialize environment files (run first!)** |
| `formgrid start` | Start all Docker services |
| `formgrid start -d` | Start in detached/background mode |
| `formgrid stop` | Stop all services |
| `formgrid restart` | Restart all services |
| `formgrid logs` | View logs (all services) |
| `formgrid logs -s backend` | View specific service logs |
| `formgrid ps` | List running containers |
| `formgrid status` | Check service health |
| `formgrid clean` | Remove all containers & volumes |
| `formgrid migrate` | Run database migrations |

See [`packages/cli/README.md`](packages/cli/README.md) for detailed CLI documentation.

## Storage Configuration

FormGrid supports multiple storage options for file uploads:

### Local Storage (Default)
```bash
make run-local
# or: docker compose -f docker/docker-compose.yml up
```

### MinIO (S3-Compatible)
```bash
FILE_STORAGE_TYPE=minio docker compose -f docker/docker-compose.yml up
```

### AWS S3
```bash
FILE_STORAGE_TYPE=s3 AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx docker compose -f docker/docker-compose.yml up
```

### Google Cloud Storage
```bash
FILE_STORAGE_TYPE=gcs GCS_PROJECT_ID=xxx docker compose -f docker/docker-compose.yml up
```

For detailed storage setup instructions, see [STORAGE_SETUP.md](./STORAGE_SETUP.md).

## How It Works

1. **Create an Endpoint** - Generate a unique API endpoint for your form
2. **Configure Fields** - Set up form fields including file uploads with restrictions
3. **Get Your Code** - Copy the generated HTML/JavaScript form code
4. **Embed Anywhere** - Add the form to any website, static site, or application
5. **Collect Submissions** - View and manage submissions in your dashboard
6. **No Backend Needed** - FormGrid handles all the server-side processing

## How to Use

### HTML Form Snippet
```html
<!-- Simple HTML form - just change the action URL -->
<form action="https://your-formgrid-instance.com/api/f/your-form-slug" method="POST">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
</form>
```

### JavaScript (Async Submission)
```javascript
// Works with any frontend framework or vanilla JavaScript
const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://your-formgrid-instance.com/api/f/your-form-slug', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        }
    } catch (error) {
        alert('Error submitting form');
    }
});
```

### With File Upload
Use these code snippets if you want to include file upload functionality in your form.

#### HTML Form (with file upload)
```html
<form action="https://your-formgrid-instance.com/api/f/your-form-slug" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <input type="file" name="attachment" accept="image/*,.pdf">
    <button type="submit">Send Message</button>
</form>
```

#### JavaScript (with file upload)
```javascript
// Works with any frontend framework or vanilla JavaScript
const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://your-formgrid-instance.com/api/f/your-form-slug', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        } else {
            alert('Error submitting form');
        }
    } catch (error) {
        alert('Error submitting form');
    }
});
```

## Environment Variables

### Required
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=mysql://user:password@localhost:3306/formgrid
```

### Optional
```env
# File Storage
FILE_STORAGE_TYPE=local
MAX_FILE_SIZE=10485760
MAX_FILES=10

# Email (for password reset - optional)
EMAIL_PROVIDER=console
EMAIL_FROM=FormGrid <noreply@formgrid.dev>
RESEND_API_KEY=your-resend-api-key

# SMTP (alternative to Resend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name

# Spam Protection (optional)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## Development

### Available Scripts

**Root (Monorepo):**
```bash
pnpm install             # Install all dependencies
pnpm run dev             # Start all services (dashboard + api)
pnpm run build           # Build all workspaces
pnpm run test            # Run all tests
pnpm run clean           # Clean all workspaces

# Individual workspace commands
pnpm run dashboard:dev   # Start dashboard only
pnpm run dashboard:build # Build dashboard only
pnpm run api:dev         # Start API only
pnpm run api:build       # Build API only
pnpm run api:test        # Test API only
```

**Dashboard (apps/dashboard):**
```bash
cd apps/dashboard
pnpm run dev             # Start development server
pnpm run build           # Build for production
pnpm run preview         # Preview production build
```

**API (packages/api):**
```bash
cd packages/api
pnpm run dev             # Start development server
pnpm run build           # Build for production
pnpm run start           # Start production server
pnpm run worker          # Start queue worker
pnpm run cleanup         # Clean up old files
pnpm run setup:minio     # Setup MinIO bucket
```

### Database Management
```bash
cd packages/api
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio
```

### Using Make Commands
```bash
make install             # Install dependencies
make dev                 # Start all services locally
make build               # Build all workspaces
make run-local           # Start with Docker
make down-local          # Stop Docker services
make clean               # Clean Docker volumes
make test                # Run all tests
make migrate             # Run database migrations
make help                # Show all available commands
```

## Deployment

### Docker Production
```bash
# Build and start all services
docker compose -f docker/docker-compose.yml up -d --build

# Setup storage (if needed)
docker compose -f docker/docker-compose.yml exec backend pnpm run setup:minio

# Cleanup old files
docker compose -f docker/docker-compose.yml exec backend pnpm run cleanup
```

### Manual Deployment
1. Install dependencies: `pnpm install`
2. Build all workspaces: `pnpm run build`
3. Set up your database and environment variables in `packages/api/.env`
4. Run database migrations: `cd packages/api && npx prisma migrate deploy`
5. Start the API server: `cd packages/api && pnpm start`
6. Serve the dashboard build files from `apps/dashboard/dist`

### Production Environment Variables
Make sure to set these in your production environment:
- `NODE_ENV=production`
- `DATABASE_URL` - Your production database URL
- `JWT_SECRET` - Strong secret for JWT tokens
- `RESEND_API_KEY` - For email sending
- `FILE_STORAGE_TYPE` - Choose: local, s3, gcs, or minio
- Configure storage-specific variables based on your choice

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**FormGrid** - The Form Endpoint API Generator that creates powerful, secure API endpoints for your HTML forms. No backend required.
