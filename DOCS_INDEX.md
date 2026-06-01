# 📚 Documentation Index

All documentation for the DARBCO Agricultural Management System.

## 🎯 Getting Started (Choose Your Path)

### 1. [START_HERE.md](START_HERE.md)
**Start here!** Quick overview and 5-step setup guide.
- What is DARBCO
- Prerequisites
- Quick start steps
- Common commands
- Test accounts

### 2. Installation Guides (Pick Based on Database)

#### ⭐ Using XAMPP: [XAMPP_INSTALLATION.md](XAMPP_INSTALLATION.md)
**Easiest method** - Visual interface with phpMyAdmin.
- Installing XAMPP
- Using phpMyAdmin to create database
- Importing via phpMyAdmin
- No command-line MySQL needed
- Managing database visually
- Daily usage with XAMPP

#### 🌟 Using Standalone MySQL: [STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md)
**Most comprehensive guide** - Complete walkthrough from start to finish.
- Detailed prerequisites installation (Node.js, MySQL)
- Project setup with explanations
- Database creation and verification
- Configuration walkthrough
- Using the system and database
- Troubleshooting with solutions
- Sample workflows and examples

#### ⚡ For Experienced Users: [QUICKSTART.md](QUICKSTART.md)
Fast 5-step setup guide with troubleshooting.
- Quick installation steps
- Configuration guide
- Troubleshooting tips
- Test accounts

#### ✅ Checklist Format: [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)
Step-by-step checklist to ensure nothing is missed.
- Pre-installation checks
- Installation steps
- Verification steps
- Common issues

## 📖 Main Documentation

### [README.md](README.md)
Complete system documentation.
- Full feature list
- Tech stack details
- API endpoints
- Project structure
- Building for production

## 🔧 Technical Guides

### [NPM_SETUP.md](NPM_SETUP.md)
Everything about using npm with this project.
- Why npm
- Installing dependencies
- Common commands
- Troubleshooting npm issues
- npm scripts reference

### [NPM_CONVERSION.md](NPM_CONVERSION.md)
Details about the npm conversion.
- What changed
- Package configuration
- How to use npm
- Available scripts
- Migration from pnpm

### [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)
PHP to Node.js migration details.
- Architecture changes
- File structure
- API endpoints
- Key features preserved
- New features added
- Breaking changes

## 📝 Reference Files

### Configuration Files
- `.env.example` - Environment variables template
- `server/.env.example` - Backend environment template
- `.npmrc` - npm configuration
- `.nvmrc` - Node version requirement
- `package-manager.txt` - Package manager instruction

### Database
- `database/darbco.sql` - MySQL schema and sample data

## 🎨 Project Organization

```
DARBCO Documentation/
│
├── Getting Started
│   ├── START_HERE.md                ⭐ Start here
│   ├── QUICKSTART.md                Quick setup
│   └── INSTALLATION_CHECKLIST.md    Detailed checklist
│
├── Main Docs
│   └── README.md                    Complete guide
│
├── Technical
│   ├── NPM_SETUP.md                 npm guide
│   ├── NPM_CONVERSION.md            npm details
│   └── MIGRATION_SUMMARY.md         PHP → Node.js
│
└── Reference
    ├── DOCS_INDEX.md                This file
    ├── .env.example                 Config template
    └── database/darbco.sql          Database schema
```

## 🚀 Quick Commands Reference

```bash
# First time setup
npm run install:all                  # Install all dependencies
mysql -u root -p darbco < database/darbco.sql  # Import database

# Daily development
npm run dev                          # Start everything
npm run dev:client                   # Frontend only
npm run dev:server                   # Backend only

# Production
npm run build                        # Build frontend
npm run build:server                 # Build backend

# Maintenance
npm run clean                        # Remove node_modules
npm cache clean --force              # Clear npm cache
npm run install:all                  # Reinstall everything
```

## 🎓 Learning Path

### For First-Time Setup (Beginners)
1. Read [START_HERE.md](START_HERE.md)
2. Follow [STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md) - **MOST DETAILED**
3. Refer to troubleshooting sections if needed

### For First-Time Setup (Experienced)
1. Read [START_HERE.md](START_HERE.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Use [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) to verify

### For Understanding the System
1. Read [README.md](README.md) for overview
2. Read [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) for architecture
3. Explore the code in `src/` and `server/`

### For Development
1. Read [NPM_SETUP.md](NPM_SETUP.md) for npm usage
2. Read [README.md](README.md) API endpoints section
3. Check `server/routes/` for API implementation

### For Production Deployment
1. Read [README.md](README.md) Building for Production section
2. Review `server/.env.example` for configuration
3. Check [NPM_SETUP.md](NPM_SETUP.md) for production scripts

## 💡 Tips

- **New to this?** Use [STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md) - it explains everything
- **Keep `.env` files updated** - Check `.env.example` for required variables
- **Use checklist for verification** - [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) ensures nothing is missed
- **Bookmark this index** - Quick reference to all docs
- **Read START_HERE first** - It points you to the right docs for your needs

## ❓ FAQ Quick Links

**How do I install? (I'm new to this)**  
→ [STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md) - Complete guide

**How do I install? (I'm experienced)**  
→ [START_HERE.md](START_HERE.md) or [QUICKSTART.md](QUICKSTART.md)

**npm issues?**  
→ [NPM_SETUP.md](NPM_SETUP.md) troubleshooting section

**Database problems?**  
→ [QUICKSTART.md](QUICKSTART.md) troubleshooting section

**What changed from PHP?**  
→ [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)

**How do I run it?**  
→ `npm run dev` (see [START_HERE.md](START_HERE.md))

**Production deployment?**  
→ [README.md](README.md) Building for Production

**API documentation?**  
→ [README.md](README.md) API Endpoints section

**Test accounts?**  
→ [START_HERE.md](START_HERE.md) or [QUICKSTART.md](QUICKSTART.md)

---

**Need help?** Start with [START_HERE.md](START_HERE.md) and follow the links!
