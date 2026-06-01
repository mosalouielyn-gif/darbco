# NPM Setup Guide

This project uses **npm** as the package manager.

## Why npm?

- **Bundled with Node.js** - No extra installation needed
- **Standard and reliable** - Industry-standard package manager
- **Compatible** - Works on all operating systems
- **Simple** - Straightforward commands and configuration

## Verify npm Installation

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version
```

If npm is not installed, download Node.js from https://nodejs.org/ (npm is included).

## Installing Dependencies

### First Time Setup

```bash
# Install all dependencies (root + server)
npm run install:all
```

This command will:
1. Install frontend dependencies in the root directory
2. Navigate to `server/` and install backend dependencies

### Manual Installation

If you prefer to install separately:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Common npm Commands

### Running the Application

```bash
# Run both frontend and backend together
npm run dev

# Run frontend only (port 5173)
npm run dev:client

# Run backend only (port 3001)
npm run dev:server
```

### Building for Production

```bash
# Build frontend
npm run build

# Build backend
npm run build:server
```

### Cleaning Up

```bash
# Remove all node_modules and build artifacts
npm run clean

# Then reinstall
npm run install:all
```

## Troubleshooting

### "npm: command not found"

- Install Node.js from https://nodejs.org/
- npm comes bundled with Node.js

### Dependency conflicts

```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall
npm run clean
npm run install:all
```

### Old package-lock.json causing issues

```bash
# Delete lock file and reinstall
rm package-lock.json
rm server/package-lock.json
npm run install:all
```

### Permission errors (Linux/Mac)

```bash
# Don't use sudo with npm!
# Instead, fix npm permissions:
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Important Notes

1. **Do not use pnpm or yarn** - This project is configured for npm
2. **Do not commit node_modules** - They're in .gitignore
3. **Commit package-lock.json** - It ensures consistent installs
4. **Use Node 18+** - Earlier versions may not work

## File Structure

```
DARBCO/
├── package.json           # Frontend dependencies and scripts
├── package-lock.json      # Frontend dependency lock file
├── node_modules/          # Frontend dependencies (git-ignored)
├── server/
│   ├── package.json       # Backend dependencies and scripts
│   ├── package-lock.json  # Backend dependency lock file
│   └── node_modules/      # Backend dependencies (git-ignored)
└── ...
```

## npm Scripts Reference

### Root package.json

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend together |
| `npm run dev:client` | Run frontend dev server |
| `npm run dev:server` | Run backend dev server |
| `npm run build` | Build frontend for production |
| `npm run build:server` | Build backend TypeScript to JS |
| `npm run install:all` | Install all dependencies |
| `npm run clean` | Remove all node_modules and builds |

### server/package.json

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend with hot reload |
| `npm start` | Run backend with tsx (dev) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run prod` | Run compiled JavaScript (production) |

## Version Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

These are enforced in package.json via the `engines` field.

## Next Steps

After installing dependencies:

1. Set up the MySQL database
2. Configure `server/.env`
3. Run `npm run dev`
4. Open http://localhost:5173

See [QUICKSTART.md](QUICKSTART.md) for the full setup process.
