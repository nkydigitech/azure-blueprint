# GitHub Pages deployment

## PowerShell

```powershell
cd path\to\azure-blueprint
git init
git add .
git commit -m "Build Azure Blueprint learning platform"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/azure-blueprint.git
git push -u origin main
```

Then open the repository on GitHub:

**Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**

The site is static, so no server or paid backend is required.

## Updating

```powershell
git add .
git commit -m "Update Azure Blueprint curriculum"
git push
```
