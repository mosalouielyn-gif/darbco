# NPM Conversion Summary

The DARBCO project has been fully configured to use **npm** as the package manager.

## What Changed

### Package Configuration

✅ **Root package.json**
- Added `engines` field requiring Node.js 18+ and npm 9+
- Updated name to `darbco-agricultural-system`
- Added `clean` script for removing node_modules
- Changed `pnpm` overrides to npm `overrides`

✅ **Server package.json**
- Added `engines` field
- Added `prod` script for production deployment
- Updated scripts to use `npx tsx`

✅ **Configuration Files**
- `.npmrc` - Added engine-strict enforcement
- `.nvmrc` - Added Node.js 18 requirement
- `server/.npmrc` - Added for backend
- `package-manager.txt` - Clear instruction file

✅ **Git Configuration**
- Updated `.gitignore` to exclude package-lock.json
- Added pnpm files to gitignore (in case accidentally used)

### Documentation Updates

✅ **README.md**
- Added npm version requirements
- Added package manager section
- Updated all commands to use npm
- Added npm troubleshooting

✅ **QUICKSTART.md**
- Added npm prerequisite
- Highlighted npm-only usage
- Added npm troubleshooting

✅ **MIGRATION_SUMMARY.md**
- Added npm verification step
- Updated all examples to use npm

✅ **New Documentation**
- `NPM_SETUP.md` - Comprehensive npm guide
- `INSTALLATION_CHECKLIST.md` - Step-by-step checklist
- `NPM_CONVERSION.md` - This file

## How to Use on Your Laptop

### First Time Setup

1. **Install Node.js 18+** from https://nodejs.org/
   - npm is included with Node.js

2. **Verify Installation**
   ```bash
   node --version  # Should be v18.x.x or higher
   npm --version   # Should be 9.x.x or higher
   ```

3. **Clone/Download the Project**
   ```bash
   cd /path/to/darbco-project
   ```

4. **Install All Dependencies**
   ```bash
   npm run install:all
   ```
   This installs packages for both frontend and backend.

5. **Set up MySQL Database**
   ```bash
   mysql -u root -p -e "CREATE DATABASE darbco;"
   mysql -u root -p darbco < database/darbco.sql
   ```

6. **Configure Environment**
   ```bash
   # Edit server/.env with your MySQL password
   # Edit .env if needed (frontend)
   ```

7. **Start Everything**
   ```bash
   npm run dev
   ```

8. **Open Browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Daily Usage

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

## Available Scripts

### Root Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:client` | Start frontend only (port 5173) |
| `npm run dev:server` | Start backend only (port 3001) |
| `npm run build` | Build frontend for production |
| `npm run build:server` | Build backend TypeScript to JS |
| `npm run install:all` | Install all dependencies |
| `npm run clean` | Remove all node_modules folders |

### Server Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Run with hot reload (development) |
| `npm start` | Run with tsx (development) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run prod` | Run compiled code (production) |

## Why npm?

1. **Included with Node.js** - No separate installation
2. **Industry standard** - Widely used and supported
3. **Simple and reliable** - Straightforward commands
4. **Cross-platform** - Works on Windows, Mac, Linux

## Important: Do Not Use Other Package Managers

❌ **Do NOT use:**
- pnpm
- yarn
- bun

✅ **Only use:**
- npm

The project is configured with `engine-strict=true` to enforce this.

## File Structure

```
DARBCO/
├── .npmrc                    # npm configuration
├── .nvmrc                    # Node version requirement
├── package.json              # Frontend dependencies
├── package-lock.json         # Dependency lock (not committed)
├── node_modules/             # Frontend packages (not committed)
│
├── server/
│   ├── .npmrc               # Server npm config
│   ├── package.json         # Backend dependencies
│   ├── package-lock.json    # Dependency lock (not committed)
│   └── node_modules/        # Backend packages (not committed)
│
├── README.md                # Main documentation
├── QUICKSTART.md            # Quick setup guide
├── NPM_SETUP.md             # Detailed npm guide
├── INSTALLATION_CHECKLIST.md # Step-by-step checklist
└── NPM_CONVERSION.md        # This file
```

## Troubleshooting

### "npm: command not found"

**Solution**: Install Node.js from https://nodejs.org/

### Slow installation

**Solution**: npm can be slower than pnpm, but it's more reliable.
```bash
# You can speed it up slightly with:
npm install --prefer-offline
```

### Permission errors (Mac/Linux)

**Solution**: Never use sudo with npm. Fix permissions:
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Dependency conflicts

**Solution**:
```bash
npm run clean
npm cache clean --force
npm run install:all
```

### Wrong Node version

**Solution**: Use nvm (Node Version Manager)
```bash
# Install nvm, then:
nvm install 18
nvm use 18
```

## Migration from pnpm (for reference)

If you had previously used pnpm:

1. Remove pnpm files:
   ```bash
   rm pnpm-lock.yaml
   rm -rf node_modules
   rm -rf server/node_modules
   ```

2. Install with npm:
   ```bash
   npm run install:all
   ```

## Verification Checklist

After conversion, verify:

- [ ] `npm --version` shows version 9+
- [ ] `node --version` shows version 18+
- [ ] `npm run install:all` completes successfully
- [ ] Both `node_modules` folders created
- [ ] `npm run dev` starts both servers
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:3001
- [ ] Can log in with test account

## Next Steps

1. Read [QUICKSTART.md](QUICKSTART.md) for setup instructions
2. Read [NPM_SETUP.md](NPM_SETUP.md) for npm details
3. Use [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) as you install

---

**You're all set to use npm!** 🎉

The project is now fully configured for npm on your laptop.
