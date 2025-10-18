# Changelog

## [1.1.0] - 2025-10-18

### Changed
- Updated for FormGrid v2.0 with simplified authentication
- Removed Google OAuth configuration requirements
- Email configuration now optional (only needed for password reset)
- Simplified setup process - no OAuth credentials needed

### Breaking Changes
- Users upgrading from 1.0.x need to run database migration
- See project README for migration instructions

## [1.0.3] - 2025-10-11

### Added
- `formgrid init` command to set up environment files automatically
- Pre-start validation that checks for .env files
- Helpful error messages when .env files are missing

### Fixed
- CLI now creates docker/.env and packages/api/.env if missing
- Start command prompts to run `formgrid init` if .env files don't exist
- Better user experience for first-time setup

## [1.0.2] - 2025-10-11

### Changed
- Updated README with clearer usage instructions
- Emphasized that CLI must be run from project root directory

## [1.0.1] - 2025-10-11

### Fixed
- Added project root validation to prevent errors when running outside FormGrid directory
- CLI now checks for required files before executing commands
- Added helpful error messages guiding users to navigate to project root
- Improved user experience with clear instructions for first-time users

## [1.0.0] - 2025-10-11

### Added
- Initial release of @formgrid/cli
- Supabase-like CLI for managing Formgrid with Docker
- Commands:
  - `formgrid start` - Start all Docker services
  - `formgrid start -d` - Start in detached mode
  - `formgrid stop` - Stop all services
  - `formgrid restart` - Restart all services
  - `formgrid logs` - View logs
  - `formgrid logs -s <service>` - View specific service logs
  - `formgrid ps` - List running containers
  - `formgrid status` - Check service health with color-coded output
  - `formgrid clean` - Remove all containers and volumes
  - `formgrid migrate` - Run database migrations
- Colorful terminal output with chalk
- Loading spinners with ora
- Beautiful status display
- Error handling and user-friendly messages

### Tech Stack
- TypeScript with strict mode
- Commander.js for CLI framework
- Execa for process execution
- Chalk for colored output
- Ora for spinners
- tsup for fast bundling
- ESM + CJS dual output

### Features
- Works from any directory in the monorepo
- Detached mode for background execution
- Service-specific log viewing
- Health status checking
- Clean command for fresh starts
- Migration support


