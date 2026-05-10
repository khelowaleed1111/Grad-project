# 📦 GitHub Setup Guide for Aqar Platform

## Step 1: Install Git

### Windows
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (recommended)
4. Restart your terminal/PowerShell after installation

### Verify Installation
```bash
git --version
```

## Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name:** `aqar-platform` (or your preferred name)
   - **Description:** "Modern bilingual real estate platform built with MERN stack"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README (we already have one)
4. Click **Create repository**

## Step 4: Initialize Local Git Repository

Open PowerShell/Terminal in your project folder:

```bash
cd "c:\Users\Khaled\Desktop\Aqar project"
```

Initialize Git:
```bash
git init
```

## Step 5: Add Files to Git

```bash
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status
```

**IMPORTANT:** Verify that `.env` files are NOT listed in `git status`. They should be ignored.

## Step 6: Create First Commit

```bash
git commit -m "Initial commit: Complete Aqar real estate platform"
```

## Step 7: Connect to GitHub

Replace `yourusername` with your actual GitHub username:

```bash
git remote add origin https://github.com/yourusername/aqar-platform.git
```

## Step 8: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

### If prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your password)

#### How to create a Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name: "Aqar Platform"
4. Select scopes: `repo` (full control)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## Step 9: Verify Upload

1. Go to your GitHub repository URL
2. Refresh the page
3. You should see all your files (except .env files)

## 🔒 Security Checklist

Before pushing, verify these files are **NOT** included:

- ❌ `aqar/server/.env` (contains MongoDB password, JWT secret)
- ❌ `aqar/client/.env` (contains Google Maps API key)
- ❌ `node_modules/` folders
- ✅ `.env.example` files (these are safe - no real credentials)

### Double-check:
```bash
git status
```

If you see `.env` files listed, they will be uploaded! Stop and fix `.gitignore`.

## 📝 Future Updates

After making changes to your code:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

## 🌿 Working with Branches (Optional)

Create a new branch for features:
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make changes, then commit
git add .
git commit -m "Add new feature"

# Push branch to GitHub
git push -u origin feature/new-feature
```

## 🚨 Common Issues

### Issue: "git: command not found"
**Solution:** Git is not installed. Follow Step 1.

### Issue: "Permission denied"
**Solution:** Use a Personal Access Token instead of password.

### Issue: ".env files are being uploaded"
**Solution:** 
1. Remove them from Git: `git rm --cached aqar/server/.env aqar/client/.env`
2. Commit: `git commit -m "Remove .env files"`
3. Push: `git push`

### Issue: "Repository already exists"
**Solution:** Use a different repository name or delete the existing one on GitHub.

## 📚 Useful Git Commands

```bash
# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard

# Pull latest changes from GitHub
git pull

# Clone repository to another computer
git clone https://github.com/yourusername/aqar-platform.git
```

## 🎯 Next Steps After Upload

1. Update README.md with your actual GitHub URL
2. Add a LICENSE file if needed
3. Set up GitHub Actions for CI/CD (optional)
4. Add repository topics on GitHub: `mern`, `real-estate`, `react`, `nodejs`, `mongodb`
5. Add a nice cover image to your repository

## 📧 Need Help?

If you encounter issues:
1. Check GitHub's documentation: https://docs.github.com
2. Search for the error message on Stack Overflow
3. Verify your .gitignore is working correctly

---

**Remember:** Never commit `.env` files or any files containing passwords, API keys, or secrets!
